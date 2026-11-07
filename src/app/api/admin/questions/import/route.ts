import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromR2, uploadToR2 } from '@/lib/r2';
import { parseDifficulty, parseQuestionType, parseSourceType, validateAnswerInput } from '@/lib/question-input';
import { localImageSources, replaceImgSrc, type ImportQuestion } from '@/lib/question-import';

const MAX_QUESTIONS = 200;
const MAX_FIGURE_BYTES = 5 * 1024 * 1024;
const FIGURE_TYPES: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
// Every figure uploaded by an import lives under this prefix, so orphans are easy to find in R2
const R2_PREFIX = 'question-imports';

async function withAdmin() {
  try {
    return await requireAdmin();
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') throw { status: 401 };
    if (e instanceof Error && e.message === 'FORBIDDEN') throw { status: 403 };
    throw e;
  }
}

function authError(e: unknown): NextResponse | null {
  if (e && typeof e === 'object' && 'status' in e) {
    const err = e as { status: number };
    if (err.status === 401) return unauthorized();
    if (err.status === 403) return forbidden();
  }
  return null;
}

const cleanTags = (raw: unknown): string[] =>
  (Array.isArray(raw) ? raw : []).map(t => String(t).trim()).filter(Boolean);

// Bulk-creates reviewed questions from the PDF import page.
// multipart/form-data: "payload" = JSON batch, "figure" = image files referenced by <img src="name">.
// Batch fields (subject, topic, source, tags, points, quiz / set) apply to every question.
// All-or-nothing: everything is validated before any upload; if the DB transaction fails,
// the figures uploaded for this request are deleted again.
export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const form = await req.formData();
    const body = JSON.parse(String(form.get('payload') ?? '{}'));
    const figureFiles = new Map(
      form.getAll('figure').filter((f): f is File => f instanceof File).map(f => [f.name, f]),
    );
    const { subjectId, topicId, quizId, questionSetId } = body;

    if (!subjectId) return badRequest('subjectId is required');
    const sourceType = body.sourceType === undefined ? 'MCQ' : parseSourceType(body.sourceType);
    if (!sourceType) return badRequest('Invalid sourceType');
    const points = body.points === undefined ? 1 : Number(body.points);
    if (!Number.isInteger(points) || points < 1) return badRequest('points must be a positive integer');
    const batchTags = cleanTags(body.tags);

    const rawQuestions: unknown[] = Array.isArray(body.questions) ? body.questions : [];
    if (rawQuestions.length === 0) return badRequest('No questions to import');
    if (rawQuestions.length > MAX_QUESTIONS) return badRequest(`At most ${MAX_QUESTIONS} questions per import`);

    for (const file of figureFiles.values()) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!FIGURE_TYPES[ext]) return badRequest(`Figure ${file.name}: only ${Object.keys(FIGURE_TYPES).join(', ')} allowed`);
      if (file.size > MAX_FIGURE_BYTES) return badRequest(`Figure ${file.name} is larger than 5 MB`);
    }

    const [subject, topic, quiz, questionSet] = await Promise.all([
      prisma.subject.findUnique({ where: { id: subjectId }, select: { id: true } }),
      topicId ? prisma.topic.findUnique({ where: { id: topicId }, select: { subjectId: true } }) : null,
      quizId ? prisma.quiz.findUnique({ where: { id: quizId }, select: { id: true } }) : null,
      questionSetId ? prisma.questionSet.findUnique({ where: { id: questionSetId }, select: { id: true } }) : null,
    ]);
    if (!subject) return badRequest('Subject not found');
    if (topicId && topic?.subjectId !== subjectId) return badRequest('Topic does not belong to the subject');
    if (quizId && !quiz) return badRequest('Quiz not found');
    if (questionSetId && !questionSet) return badRequest('Question set not found');

    const errors: { index: number; error: string }[] = [];
    const usedFigures = new Set<string>();
    const rows = rawQuestions.map((raw, index) => {
      const q = (raw ?? {}) as Record<string, unknown>;
      const fail = (error: string) => { errors.push({ index, error }); return null; };

      const statement = typeof q.statement === 'string' ? q.statement.trim() : '';
      if (!statement) return fail('statement is required');
      const questionType = parseQuestionType(q.questionType);
      if (!questionType) return fail('Invalid questionType');
      const difficulty = q.difficulty === undefined ? 'MEDIUM' : parseDifficulty(q.difficulty);
      if (!difficulty) return fail('Invalid difficulty');
      const answer = validateAnswerInput(questionType, q.options, q.acceptedAnswers);
      if ('error' in answer) return fail(answer.error);

      const explanation = typeof q.explanation === 'string' && q.explanation.trim() ? q.explanation : null;
      const figures = localImageSources({ statement, explanation: explanation ?? '', options: answer.data.options } as ImportQuestion);
      const missing = figures.filter(name => !figureFiles.has(name));
      if (missing.length) return fail(`Figure file missing: ${missing.join(', ')}`);
      figures.forEach(name => usedFigures.add(name));

      const skill = typeof q.skill === 'string' ? q.skill.trim() : '';
      const tags = [...new Set([...batchTags, ...(skill ? [skill] : [])])];
      return { statement, explanation, difficulty, tags, ...answer.data };
    });
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Some questions are invalid', errors }, { status: 400 });
    }

    // Upload only after everything validated, and only the figures actually used
    const batchId = `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
    const uploadedKeys: string[] = [];
    const urls = new Map<string, string>();
    try {
      for (const name of usedFigures) {
        const file = figureFiles.get(name)!;
        const ext = name.split('.').pop()!.toLowerCase();
        const key = `${R2_PREFIX}/${batchId}/${name.replace(/[^\w.-]/g, '_')}`;
        const url = await uploadToR2(Buffer.from(await file.arrayBuffer()), key, FIGURE_TYPES[ext], {
          source: 'question-import',
          batch: batchId,
        });
        uploadedKeys.push(key);
        urls.set(name, url);
      }

      const created = await prisma.$transaction(async (tx) => {
        const ids: string[] = [];
        for (const row of rows) {
          if (!row) continue;
          const question = await tx.question.create({
            data: {
              statement: replaceImgSrc(row.statement, urls),
              explanation: row.explanation === null ? null : replaceImgSrc(row.explanation, urls),
              difficulty: row.difficulty,
              questionType: row.questionType,
              sourceType,
              acceptedAnswers: row.acceptedAnswers,
              subjectId,
              topicId: topicId || null,
              tags: row.tags,
              points,
              options: {
                create: row.options.map((o, idx) => ({
                  content: replaceImgSrc(o.content, urls),
                  isCorrect: o.isCorrect,
                  sortOrder: idx,
                })),
              },
            },
            select: { id: true },
          });
          ids.push(question.id);
        }

        if (quizId) {
          const start = await tx.quizQuestion.count({ where: { quizId } });
          await tx.quizQuestion.createMany({
            data: ids.map((questionId, i) => ({ quizId, questionId, points, sortOrder: start + i })),
          });
        }
        if (questionSetId) {
          const start = await tx.questionSetItem.count({ where: { questionSetId } });
          await tx.questionSetItem.createMany({
            data: ids.map((questionId, i) => ({ questionSetId, questionId, sortOrder: start + i })),
          });
        }
        return ids;
      }, { timeout: 60_000 });

      return NextResponse.json({
        created: created.length,
        questionIds: created,
        figuresUploaded: uploadedKeys.length,
        addedToQuiz: quizId ? created.length : 0,
        addedToQuestionSet: questionSetId ? created.length : 0,
      }, { status: 201 });
    } catch (e) {
      // Nothing was saved — remove this batch's figures so failed imports don't leave files in R2
      await deleteFromR2(uploadedKeys).catch(err =>
        console.error(`[question-import] could not delete ${R2_PREFIX}/${batchId}/*:`, err),
      );
      throw e;
    }
  } catch (e) {
    if (e instanceof SyntaxError) return badRequest('payload is not valid JSON');
    const auth = authError(e);
    if (auth) return auth;
    console.error('[question-import] import failed:', e);
    const message = e instanceof Error && e.message.includes('R2 environment variables')
      ? 'Figure upload is not configured on this server (R2_* environment variables missing). Nothing was saved.'
      : 'Import failed — nothing was saved. See the server log for details.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
