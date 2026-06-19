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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    const body = await req.json();
    const allowed = [
      'title', 'description', 'assetType', 'sortOrder', 'isFree', 'isPublished',
      'videoUrl', 'videoDuration', 'videoProvider', 'pdfUrl', 'articleContent', 'quizId', 'questionSetId',
    ];
    const data = Object.fromEntries(
      Object.entries(body)
        .filter(([k]) => allowed.includes(k))
        .map(([k, v]) => [k, v === '' ? null : v])
    );

    const asset = await prisma.learningAsset.update({
      where: { id },
      data,
      include: {
        module: { select: { title: true, course: { select: { title: true } } } },
        quiz: { select: { title: true } },
        questionSet: { select: { title: true } },
      },
    });
    return NextResponse.json({ asset });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await withAdmin();
    const { id } = await params;
    if (!id) return badRequest('id is required');
    await prisma.learningAsset.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
