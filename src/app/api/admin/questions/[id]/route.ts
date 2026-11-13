import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  parseDifficulty,
  parseQuestionType,
  parseSourceType,
  validateAnswerInput,
  type QuestionAnswerInput,
} from '@/lib/question-input';

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    const body = await req.json();
    const { statement, passage, explanation, subjectId, topicId, tags, points, isActive } = body;

    const existing = await prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!existing) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    if (subjectId === null || subjectId === '') return badRequest('subjectId is required');
    const sourceType = body.sourceType === undefined ? undefined : parseSourceType(body.sourceType);
    if (sourceType === null) return badRequest('Invalid sourceType');
    const difficulty = body.difficulty === undefined ? undefined : parseDifficulty(body.difficulty);
    if (difficulty === null) return badRequest('Invalid difficulty');

    // Any change to type or answer data re-validates the full answer key against the
    // effective type, falling back to stored values for whatever the caller omitted.
    const touchesAnswer =
      body.questionType !== undefined || body.options !== undefined || body.acceptedAnswers !== undefined;
    let answer: QuestionAnswerInput | null = null;
    if (touchesAnswer) {
      const questionType = body.questionType === undefined ? existing.questionType : parseQuestionType(body.questionType);
      if (!questionType) return badRequest('Invalid questionType');
      const result = validateAnswerInput(
        questionType,
        body.options ?? existing.options,
        body.acceptedAnswers ?? existing.acceptedAnswers,
      );
      if ('error' in result) return badRequest(result.error);
      answer = result.data;
    }

    await prisma.$transaction(async (tx) => {
      await tx.question.update({
        where: { id },
        data: {
          ...(statement && { statement }),
          ...(passage !== undefined && { passage: passage || null }),
          ...(explanation !== undefined && { explanation }),
          ...(difficulty && { difficulty }),
          ...(sourceType && { sourceType }),
          ...(subjectId !== undefined && { subjectId }),
          ...(topicId !== undefined && { topicId }),
          ...(tags && { tags }),
          ...(points && { points }),
          ...(typeof isActive === 'boolean' && { isActive }),
          ...(answer && { questionType: answer.questionType, acceptedAnswers: answer.acceptedAnswers }),
        },
      });

      if (answer) {
        await tx.questionOption.deleteMany({ where: { questionId: id } });
        await tx.questionOption.createMany({
          data: answer.options.map((o, idx) => ({
            questionId: id,
            content: o.content,
            isCorrect: o.isCorrect,
            sortOrder: idx,
          })),
        });
      }
    });

    const updated = await prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json({ question: updated });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
