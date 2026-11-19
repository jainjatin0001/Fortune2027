import type { NextConfig } from 'next';

const getRemotePatterns = () => {
  const patterns: Array<{ protocol: 'http' | 'https'; hostname: string }> = [
    { protocol: 'https', hostname: 'img.clerk.com' },
    { protocol: 'https', hostname: 'images.clerk.dev' },
  ];

  if (process.env.R2_PUBLIC_URL) {
    try {
      const url = new URL(process.env.R2_PUBLIC_URL);
      patterns.push({
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
      });
    } catch {
      // Ignore invalid URL
    }
  }

  return patterns;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: ['isomorphic-dompurify'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },
  async redirects() {
    return [
      // Progress metrics now live on the dashboard itself
      { source: '/dashboard/progress', destination: '/dashboard', permanent: false },
      // /subjects was in the old sitemap + nav but never existed; send crawlers somewhere useful
      { source: '/subjects', destination: '/courses', permanent: true },
      // Footer "Practice Tests" link: practice tests live in the dashboard (public preview for guests)
      { source: '/practice', destination: '/dashboard', permanent: false },
      // Course slug cleanup (typo + uppercase): see scripts/seo-rename-course-slugs.mjs.
      // Keep these forever so old links/backlinks keep their value.
      { source: '/courses/delta-sat-ecxellence', destination: '/courses/delta-sat-excellence', permanent: true },
      { source: '/courses/AP-Calculus-AB-2026', destination: '/courses/ap-calculus-ab', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
