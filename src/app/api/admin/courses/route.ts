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
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const where = {
      ...(category && { category: category as never }),
      ...(published !== null && { isPublished: published === 'true' }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          section: { select: { name: true, slug: true } },
          _count: { select: { enrollments: true, modules: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({ courses, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { sectionId, title, slug, description, shortDesc, category, difficulty, price, isFree } = body;

    if (!sectionId || !title || !slug || !description || !category) {
      return badRequest('sectionId, title, slug, description, and category are required');
    }

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const course = await prisma.course.create({
      data: {
        sectionId,
        title,
        slug,
        description,
        shortDesc: shortDesc ?? null,
        category,
        difficulty: difficulty ?? 'MEDIUM',
        price: price ?? 0,
        isFree: isFree ?? false,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await withAdmin();
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return badRequest('id is required');

    // Only allow safe fields
    const allowed = ['title', 'description', 'shortDesc', 'price', 'isFree', 'isPublished', 'isFeatured', 'difficulty', 'thumbnailUrl', 'tags', 'requirements', 'objectives'];
    const data = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );

    const course = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ course });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
