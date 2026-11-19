import { prisma } from '@/lib/prisma';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Delta Tutors blog post';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost
    .findUnique({
      where: { slug, isPublished: true },
      select: { title: true, category: { select: { name: true } } },
    })
    .catch(() => null);

  return renderOgImage({
    eyebrow: post?.category?.name ? `Blog · ${post.category.name}` : 'Delta Tutors Blog',
    title: post?.title ?? 'SAT, ACT, AP & coding guides',
  });
}
