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
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
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
