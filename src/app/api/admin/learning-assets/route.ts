import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized, forbidden, badRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

export async function GET(req: NextRequest) {
  try {
    await withAdmin();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const moduleId = searchParams.get('moduleId');
    const search = searchParams.get('search') ?? '';

    const where = {
      ...(moduleId && { moduleId }),
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
    };

    const [assets, total] = await Promise.all([
      prisma.learningAsset.findMany({
        where,
        include: {
          module: { select: { title: true, course: { select: { title: true } } } },
          quiz: { select: { title: true } },
          questionSet: { select: { title: true } },
        },
        orderBy: [{ moduleId: 'asc' }, { sortOrder: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.learningAsset.count({ where }),
    ]);

    return NextResponse.json({ assets, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const {
      moduleId, title, description, assetType, sortOrder, isFree, isPublished,
      videoUrl, videoDuration, videoProvider, pdfUrl, articleContent, quizId, questionSetId,
    } = body;

    if (!moduleId) return badRequest('moduleId is required');
    if (!title) return badRequest('title is required');
    if (!assetType) return badRequest('assetType is required');

    const count = await prisma.learningAsset.count({ where: { moduleId } });

    const asset = await prisma.learningAsset.create({
      data: {
        moduleId,
        title,
        description: description ?? null,
        assetType,
        sortOrder: sortOrder ?? count,
        isFree: isFree ?? false,
        isPublished: isPublished ?? false,
        videoUrl: videoUrl ?? null,
        videoDuration: videoDuration ?? null,
        videoProvider: videoProvider ?? null,
        pdfUrl: pdfUrl ?? null,
        articleContent: articleContent ?? null,
        quizId: quizId ?? null,
        questionSetId: questionSetId ?? null,
      },
      include: {
        module: { select: { title: true, course: { select: { title: true } } } },
        quiz: { select: { title: true } },
        questionSet: { select: { title: true } },
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
