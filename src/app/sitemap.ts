import type { MetadataRoute } from 'next';
import { APP_URL } from '@/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '', '/courses', '/sat-prep', '/act-prep', '/ap-prep', '/coding',
    '/subjects', '/blog', '/about', '/contact', '/pricing',
  ];

  return staticRoutes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.includes('prep') ? 0.9 : 0.7,
  }));
}
