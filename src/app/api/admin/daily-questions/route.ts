import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { requireAdmin, unauthorized, forbidden, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays, dateKeyToDb, dbToDateKey } from '@/lib/progress/time';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS = 31;
const todayUtcKey = () => new Date().toISOString().slice(0, 10);

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

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// GET ?from=YYYY-MM-DD&days=14                → schedule per track
// GET ?trackId=…&search=…                      → candidate questions from the track's subject pool
export async function GET(req: NextRequest) {
  try {
    await withAdmin();
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get('trackId');

    if (trackId) {
      const search = searchParams.get('search')?.trim() ?? '';
      const questions = await prisma.question.findMany({
        where: {
          isActive: true,
          questionType: { in: ['SINGLE_CORRECT', 'NUMERIC'] },
          subject: { dailyQuestionTracks: { some: { trackId } } },
          ...(search && {
            OR: [
              { id: search },
              { statement: { contains: search, mode: 'insensitive' as const } },
            ],
          }),
        },
        select: { id: true, statement: true, difficulty: true, subject: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      return NextResponse.json({
        questions: questions.map(q => ({ ...q, statement: plain(q.statement).slice(0, 220) })),
      });
    }

    const from = searchParams.get('from') ?? todayUtcKey();
    if (!DATE_KEY.test(from)) return badRequest('from must be YYYY-MM-DD');
    const days = Math.min(MAX_DAYS, Math.max(1, parseInt(searchParams.get('days') ?? '14')));
    const to = addDays(from, days - 1);

    const tracks = await prisma.dailyQuestionTrack.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        isActive: true,
        subjects: { select: { subject: { select: { name: true } } } },
        dailyQuestions: {
          where: { date: { gte: dateKeyToDb(from), lte: dateKeyToDb(to) } },
          orderBy: { date: 'asc' },
          select: {
            date: true,
            isManual: true,
            question: { select: { id: true, statement: true, difficulty: true, subject: { select: { name: true } } } },
            _count: { select: { attempts: true } },
          },
        },
      },
    });

    return NextResponse.json({
      from,
      days,
      today: todayUtcKey(),
      tracks: tracks.map(t => ({
        id: t.id,
        name: t.name,
        isActive: t.isActive,
        subjects: t.subjects.map(s => s.subject.name),
        entries: t.dailyQuestions.map(d => ({
          date: dbToDateKey(d.date),
          isManual: d.isManual,
          attempts: d._count.attempts,
          question: { ...d.question, statement: plain(d.question.statement).slice(0, 220) },
        })),
      })),
    });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT { trackId, date, questionId } → schedule (or replace) the question for that day
export async function PUT(req: NextRequest) {
  try {
    await withAdmin();
    const { trackId, date, questionId } = await req.json();
    if (typeof trackId !== 'string' || typeof questionId !== 'string') return badRequest('trackId and questionId are required');
    if (typeof date !== 'string' || !DATE_KEY.test(date)) return badRequest('date must be YYYY-MM-DD');
    // Behind-UTC zones are still on yesterday's UTC date, so allow it
    if (date < addDays(todayUtcKey(), -1)) return badRequest('Past days cannot be changed');

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        isActive: true,
        questionType: { in: ['SINGLE_CORRECT', 'NUMERIC'] },
        subject: { dailyQuestionTracks: { some: { trackId } } },
      },
      select: { id: true },
    });
    if (!question) return badRequest('Question must be active, single-answer or numeric, and from one of this track’s subjects');

    const key = { trackId_date: { trackId, date: dateKeyToDb(date) } };
    const existing = await prisma.dailyQuestion.findUnique({
      where: key,
      select: { questionId: true, _count: { select: { attempts: true } } },
    });
    // Students have already answered — swapping the question would orphan their results
    if (existing && existing._count.attempts > 0 && existing.questionId !== questionId) {
      return NextResponse.json({ error: 'Students have already answered this day’s question' }, { status: 409 });
    }

    const dq = await prisma.dailyQuestion.upsert({
      where: key,
      create: { trackId, date: dateKeyToDb(date), questionId, isManual: true },
      update: { questionId, isManual: true },
    });
    return NextResponse.json({ dailyQuestion: dq });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') return badRequest('Unknown track');
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE ?trackId=…&date=… → clear a scheduled day so it is auto-picked again
export async function DELETE(req: NextRequest) {
  try {
    await withAdmin();
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get('trackId');
    const date = searchParams.get('date');
    if (!trackId || !date || !DATE_KEY.test(date)) return badRequest('trackId and date are required');

    const { count } = await prisma.dailyQuestion.deleteMany({
      where: { trackId, date: dateKeyToDb(date), attempts: { none: {} } },
    });
    if (count === 0) {
      return NextResponse.json({ error: 'Nothing to reset — the day is unscheduled or already answered' }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
