import { prisma } from '@/lib/prisma';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';
import { toPlainText } from '@/lib/seo';

export const alt = 'Delta Tutors course';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course
    .findUnique({
      where: { slug, isPublished: true },
      select: { title: true, shortDesc: true, program: { select: { name: true } } },
    })
    .catch(() => null);

  return renderOgImage({
    eyebrow: course?.program.name ? `${course.program.name} · Online course` : 'Online course',
    title: course?.title ?? 'Delta Tutors Courses',
    subtitle: toPlainText(course?.shortDesc, 110) || undefined,
  });
}
