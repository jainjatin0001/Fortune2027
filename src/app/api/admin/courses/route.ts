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
    const published = searchParams.get('published');

    const where = {
      ...(published !== null && { isPublished: published === 'true' }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          program: { select: { name: true, slug: true } },
          _count: { select: { enrollments: true, modules: true } },
          instructors: {
            orderBy: { isPrimary: 'desc' },
            take: 1,
            select: { instructorId: true },
          },
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
    const { programId, title, slug, description, shortDesc, difficulty, price, isFree } = body;

    if (!programId || !title || !slug || !description) {
      return badRequest('programId, title, slug, and description are required');
    }

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

    const { objectives, requirements, tags, thumbnailUrl, instructorId } = body;

    const course = await prisma.course.create({
      data: {
        programId,
        title,
        slug,
        description,
        shortDesc: shortDesc ?? null,
        difficulty: difficulty ?? 'MEDIUM',
        price: price ?? 0,
        isFree: isFree ?? false,
        objectives: objectives ?? [],
        requirements: requirements ?? [],
        tags: tags ?? [],
        thumbnailUrl: thumbnailUrl ?? null,
      },
    });

    if (instructorId) {
      await prisma.courseInstructor.create({
        data: { courseId: course.id, instructorId, isPrimary: true },
      });
    }

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

    const allowed = ['title', 'description', 'shortDesc', 'price', 'isFree', 'isPublished', 'isFeatured', 'difficulty', 'thumbnailUrl', 'tags', 'requirements', 'objectives'];
    const data = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );

    const course = await prisma.course.update({ where: { id }, data });

    if ('instructorId' in body) {
      await prisma.courseInstructor.deleteMany({ where: { courseId: id } });
      if (body.instructorId) {
        await prisma.courseInstructor.create({
          data: { courseId: id, instructorId: body.instructorId, isPrimary: true },
        });
      }
    }

    return NextResponse.json({ course });
  } catch (e) {
    return authError(e) ?? NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
