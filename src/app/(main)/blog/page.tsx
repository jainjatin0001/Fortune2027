import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'SAT strategies, ACT tips, AP study guides, coding tutorials, and college admissions advice from the EduReach team.',
};

// Revalidate every 5 minutes so the page stays fresh without being fully dynamic
export const revalidate = 300;

function readTimeMin(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categoryBadge: Record<string, string> = {
  'SAT Prep': 'badge-sat',
  'ACT Prep': 'badge-act',
  'AP Exams': 'badge-ap',
  'Coding': 'badge-coding',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: { select: { name: true } } },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 12,
  });

  const featuredPosts = posts.filter((p) => p.isFeatured);
  const regularPosts = posts.filter((p) => !p.isFeatured);

  return (
    <div style={{ background: 'var(--color-background)' }}>
      <div className="section-padding-sm" style={{ background: 'var(--color-background-alt)' }}>
        <div className="container-app">
          <h1 className="text-heading-1 mb-3" style={{ color: 'var(--color-foreground)' }}>EduReach Blog</h1>
          <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
            SAT strategies, ACT tips, AP guides, and coding tutorials from our expert team.
          </p>
        </div>
      </div>

      <div className="container-app py-12">
        {featuredPosts.length > 0 && (
          <>
            <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {featuredPosts.map((post) => {
                const categoryName = post.category?.name ?? '';
                const badge = categoryBadge[categoryName] ?? 'badge-hs';
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="card-base p-6 group block">
                    <div className="flex items-center gap-2 mb-3">
                      {categoryName && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge}`}>{categoryName}</span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                      {post.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-muted-foreground)' }}>{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{readTimeMin(post.content)} min read
                      </span>
                      <span className="flex items-center gap-1 ml-auto text-[var(--color-accent)] font-medium group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {regularPosts.length > 0 && (
          <>
            <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => {
                const categoryName = post.category?.name ?? '';
                const badge = categoryBadge[categoryName] ?? 'badge-hs';
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="card-base p-5 group block">
                    {categoryName && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge}`}>{categoryName}</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2" style={{ color: 'var(--color-foreground)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      <Clock className="h-3 w-3" />{readTimeMin(post.content)} min
                      <span className="ml-auto">{formatDate(post.publishedAt ?? post.createdAt)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {posts.length === 0 && (
          <div className="text-center py-24" style={{ color: 'var(--color-muted-foreground)' }}>
            <p className="text-lg font-medium">No posts published yet.</p>
            <p className="text-sm mt-1">Check back soon — our team is working on great content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
