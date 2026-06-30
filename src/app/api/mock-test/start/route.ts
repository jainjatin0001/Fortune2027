import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser, unauthorized, badRequest, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { assetId } = body;
    if (!assetId) return badRequest('assetId is required');

    // Resolve the asset and its mock test
    const asset = await prisma.learningAsset.findUnique({
      where: { id: assetId, assetType: 'MOCK_TEST', isPublished: true },
      include: {
        mockTest: {
          include: {
            sections: {
              orderBy: { sortOrder: 'asc' },
              include: {
                questions: {
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    question: {
                      include: {
                        subject: { select: { name: true } },
                        topic: { select: { name: true } },
                        options: { orderBy: { sortOrder: 'asc' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        module: { select: { courseId: true } },
      },
    });

    if (!asset || !asset.mockTest) return notFound('Mock test not found');

    const mockTest = asset.mockTest;

    // Verify the student is enrolled in the course (skip for admin)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    let enrollmentId: string | null = null;

    if (!isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: asset.module.courseId,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
      }
      enrollmentId = enrollment.id;
    }

    // Create the attempt
    const attempt = await prisma.mockTestAttempt.create({
      data: {
        userId: user.id,
        mockTestId: mockTest.id,
        assetId,
        enrollmentId,
        status: 'IN_PROGRESS',
      },
    });

    // Return attempt + structured sections (questions without correctAnswerId for security)
    const sections = mockTest.sections.map(section => ({
      id: section.id,
      name: section.name,
      shortName: section.shortName,
      sortOrder: section.sortOrder,
      timeLimit: section.timeLimit,
      hasCalculator: section.hasCalculator,
      instructions: section.instructions,
      totalMarks: section.totalMarks,
      questions: section.questions.map(sq => ({
        id: sq.question.id,
        sectionQuestionId: sq.id,
        statement: sq.question.statement,
        difficulty: sq.question.difficulty,
        questionType: sq.question.questionType,
        points: sq.points,
        subject: sq.question.subject.name,
        topic: sq.question.topic?.name ?? null,
        tags: sq.question.tags,
        options: sq.question.options.map(o => ({
          id: o.id,
          content: o.content,
          // isCorrect intentionally omitted — sent only in report
        })),
      })),
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      mockTestId: mockTest.id,
      title: mockTest.title,
      instructions: mockTest.instructions,
      passingScore: mockTest.passingScore,
      sections,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
