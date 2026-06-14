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
    const search = searchParams.get('search') ?? '';
    const published = searchParams.get('published');

    const where = {
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
      ...(published !== null && published !== '' && { isPublished: published === 'true' }),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { firstName: true, lastName: true } },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await withAdmin();
    const body = await req.json();
    const { title, slug, content, excerpt, categoryId, coverImage, tags, isPublished, isFeatured } = body;

    if (!title || !slug || !content) return badRequest('title, slug, and content are required');

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const post = await prisma.blogPost.create({
      data: {
        authorId: admin.id,
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        categoryId: categoryId ?? null,
        coverImage: coverImage ?? null,
        tags: tags ?? [],
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
