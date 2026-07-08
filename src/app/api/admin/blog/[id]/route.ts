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
    const allowed = ['title', 'content', 'excerpt', 'categoryId', 'coverImage', 'tags', 'isPublished', 'isFeatured'];
    const data: Record<string, unknown> = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

    if (typeof data.content === 'string' || typeof data.excerpt === 'string') {
      const { sanitizeHtml } = await import('@/components/admin/RichEditor/utils/sanitize');
      if (typeof data.content === 'string') data.content = sanitizeHtml(data.content);
      if (typeof data.excerpt === 'string') data.excerpt = sanitizeHtml(data.excerpt);
    }

    if (typeof data.isPublished === 'boolean' && data.isPublished) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({ where: { id }, data });
    return NextResponse.json({ post });
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

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
