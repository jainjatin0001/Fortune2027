import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { absoluteUrl } from '@/lib/seo';

// Rebuild hourly so newly published courses/posts appear without a redeploy.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/sat-prep', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/act-prep', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/ap-prep', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/coding', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/courses', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([
    prisma.course
      .findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
      .catch(() => []),
    prisma.blogPost
      .findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
      .catch(() => []),
  ]);

  const newest = (dates: Date[]) =>
    dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
  const latestCourse = newest(courses.map((c) => c.updatedAt));
  const latestPost = newest(posts.map((p) => p.updatedAt));

  const staticEntries: Entry[] = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    // Only listing pages get a real lastModified; a fake "now" on every
    // request teaches Google to ignore the field.
    ...(path === '/courses' && latestCourse ? { lastModified: latestCourse } : {}),
    ...(path === '/blog' && latestPost ? { lastModified: latestPost } : {}),
    changeFrequency,
    priority,
  }));

  const courseEntries: Entry[] = courses.map((c) => ({
    url: absoluteUrl(`/courses/${c.slug}`),
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const postEntries: Entry[] = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...courseEntries, ...postEntries];
}
