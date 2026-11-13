import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser, unauthorized, badRequest, notFound } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { examKindOf } from '@/lib/mock-test/exam-kind';
import { splitPassage } from '@/lib/mock-test/passage';

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { assetId, mockTestId } = body;
    if (!assetId && !mockTestId) return badRequest('assetId or mockTestId is required');

    const mockTestInclude = {
      program: { select: { slug: true, name: true } },
      sections: {
        orderBy: { sortOrder: 'asc' as const },
        include: {
          questions: {
            orderBy: { sortOrder: 'asc' as const },
            include: {
              question: {
                include: {
                  subject: { select: { name: true } },
                  topic: { select: { name: true } },
                  options: { orderBy: { sortOrder: 'asc' as const } },
                },
              },
            },
          },
        },
      },
    };

    let mockTest;
    let enrollmentId: string | null = null;

    if (assetId) {
      // Course flow: resolve the asset and its mock test
      const asset = await prisma.learningAsset.findUnique({
        where: { id: assetId, assetType: 'MOCK_TEST', isPublished: true },
        include: {
          mockTest: { include: mockTestInclude },
          module: { select: { courseId: true } },
        },
      });

      if (!asset || !asset.mockTest) return notFound('Mock test not found');
      mockTest = asset.mockTest;

      // Verify the student is enrolled in the course (skip for admin)
      const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

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
    } else {
      // Free practice flow: published demo tests are open to every signed-in student
      mockTest = await prisma.mockTest.findUnique({
        where: { id: mockTestId, isPublished: true, isDemo: true },
        include: mockTestInclude,
      });
      if (!mockTest) return notFound('Mock test not found');
    }

    // Create the attempt. The player can't resume, so any earlier unfinished
    // attempt at this test is closed rather than left IN_PROGRESS forever.
    const [, attempt] = await prisma.$transaction([
      prisma.mockTestAttempt.updateMany({
        where: { userId: user.id, mockTestId: mockTest.id, status: 'IN_PROGRESS' },
        data: { status: 'ABANDONED' },
      }),
      prisma.mockTestAttempt.create({
        data: {
          userId: user.id,
          mockTestId: mockTest.id,
          assetId: assetId ?? null,
          enrollmentId,
          status: 'IN_PROGRESS',
        },
      }),
    ]);

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
      breakAfter: section.breakAfter,
      questions: section.questions.map(sq => {
        // Reading-style sections (no calculator) show the passage beside the question, like the
        // real digital tests. An admin-entered passage wins; otherwise split the stored text.
        const split = !sq.question.passage && !section.hasCalculator ? splitPassage(sq.question.statement) : null;
        return {
          id: sq.question.id,
          sectionQuestionId: sq.id,
          statement: split ? split.stem : sq.question.statement,
          passage: split ? split.passage : sq.question.passage,
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
        };
      }),
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      mockTestId: mockTest.id,
      title: mockTest.title,
      examKind: examKindOf(mockTest.program),
      instructions: mockTest.instructions,
      passingScore: mockTest.passingScore,
      sections,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
