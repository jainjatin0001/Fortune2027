import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { sanitizeHtml } from '@/components/admin/RichEditor/utils/sanitize';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'SAT strategies, ACT tips, AP study guides, coding tutorials, and college admissions advice from the Delta Tutors team.',
};

function readTimeMin(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categoryMeta: Record<string, { badge: string; gradient: string; lightBg: string }> = {
  'SAT Prep':     { badge: 'badge-sat',    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', lightBg: '#dbeafe' },
  'ACT Prep':     { badge: 'badge-act',    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', lightBg: '#d1fae5' },
  'AP Exams':     { badge: 'badge-ap',     gradient: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)', lightBg: '#ffedd5' },
  'Coding':       { badge: 'badge-coding', gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)', lightBg: '#ede9fe' },
  'College Prep': { badge: 'badge-hs',     gradient: 'linear-gradient(135deg, #0f766e 0%, #06b6d4 100%)', lightBg: '#cffafe' },
  'Study Tips':   { badge: 'badge-act',    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', lightBg: '#d1fae5' },
};
const defaultMeta = { badge: 'badge-hs', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0891b2 100%)', lightBg: '#dbeafe' };

function getCategoryMeta(name: string) {
  return categoryMeta[name] ?? defaultMeta;
}


type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string } | null;
};

function PostThumb({ post, className }: { post: Post; className?: string }) {
  const meta = getCategoryMeta(post.category?.name ?? '');
  if (post.coverImage) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: meta.gradient }}>
      <BookOpen className="w-5 h-5 opacity-40 text-white" />
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = '' } = await searchParams;

  const [posts, allCategories] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { slug: category } } : {}),
      },
      select: {
        id: true, slug: true, title: true, excerpt: true, content: true,
        coverImage: true, isFeatured: true, publishedAt: true, createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
  ]);

  const featuredPosts = posts.filter((p) => p.isFeatured).slice(0, 3);
  const regularPosts  = posts.filter((p) => !p.isFeatured);
  const heroPost      = featuredPosts[0] ?? null;
  const sideFeatures  = featuredPosts.slice(1, 3);

  return (
    <div style={{ background: 'var(--color-background)' }}>
      {/* Hero */}
      <div className="section-padding-sm" style={{ background: 'var(--color-background-alt)', borderBottom: '1px solid var(--color-card-border)' }}>
        <div className="container-app text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <BookOpen className="w-3.5 h-3.5" />
            <strong style={{ color: '#17356D' }}>Delta Tutors</strong> Blog
          </div>
          <h1 className="text-heading-1 mb-3" style={{ color: 'var(--color-foreground)' }}>
            Insights. Strategies. Success.
          </h1>
          <p className="text-body max-w-xl mx-auto mb-8" style={{ color: 'var(--color-muted-foreground)' }}>
            Expert guidance on SAT, ACT, AP, and college admissions<br className="hidden sm:block" /> to help students achieve their academic goals.
          </p>

          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/blog"
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={category === ''
                ? { background: 'var(--color-accent)', color: '#fff' }
                : { background: 'var(--color-card)', color: 'var(--color-foreground)', border: '1px solid var(--color-card-border)' }
              }
            >
              All Topics
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={category === cat.slug
                  ? { background: 'var(--color-accent)', color: '#fff' }
                  : { background: 'var(--color-card)', color: 'var(--color-foreground)', border: '1px solid var(--color-card-border)' }
                }
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-app py-14">

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-heading-3" style={{ color: 'var(--color-foreground)' }}>Featured Articles</h2>
                <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'var(--color-accent)' }} />
              </div>
              <Link href="/blog" className="flex items-center gap-0.5 text-sm font-semibold hover:gap-1 transition-all"
                style={{ color: 'var(--color-accent)' }}>
                View all featured <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid lg:grid-cols-[3fr_2fr] gap-5">
              {/* Large hero featured card */}
              {heroPost && (() => {
                const heroCat = getCategoryMeta(heroPost.category?.name ?? '');
                return (
                  <Link href={`/blog/${heroPost.slug}`} className="group relative block rounded-2xl overflow-hidden min-h-[420px]">
                    {heroPost.coverImage ? (
                      <img
                        src={heroPost.coverImage}
                        alt={heroPost.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0" style={{ background: heroCat.gradient }} />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }} />
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-white"
                          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>
                          {heroPost.category?.name ?? 'Article'}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
                          {formatDate(heroPost.publishedAt ?? heroPost.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                        {heroPost.title}
                      </h3>
                      {heroPost.excerpt && (
                        <div className="text-sm line-clamp-2 mb-5 rich-content" style={{ color: 'rgba(255,255,255,0.78)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(heroPost.excerpt) }} />
                      )}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          <Clock className="w-3.5 h-3.5" />{readTimeMin(heroPost.content)} min read
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Side featured cards */}
              {sideFeatures.length > 0 && (
                <div className="flex flex-col gap-5 h-full">
                  {sideFeatures.map((post) => {
                    const meta = getCategoryMeta(post.category?.name ?? '');
                    return (
                      <Link key={post.slug} href={`/blog/${post.slug}`}
                        className="group relative flex flex-1 rounded-2xl overflow-hidden min-h-[180px]">
                        {/* Background image or gradient */}
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0" style={{ background: meta.gradient }} />
                        )}
                        {/* Dark overlay */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />
                        {/* Content */}
                        <div className="relative flex flex-col justify-end p-5 w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-white"
                              style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>
                              {post.category?.name ?? 'Article'}
                            </span>
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
                              {formatDate(post.publishedAt ?? post.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 text-white">
                            {post.title}
                          </h3>
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            <Clock className="w-3.5 h-3.5" />{readTimeMin(post.content)} min read
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {regularPosts.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-heading-3" style={{ color: 'var(--color-foreground)' }}>Recent Posts</h2>
                <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'var(--color-accent)' }} />
              </div>
              <Link href="/blog" className="flex items-center gap-0.5 text-sm font-semibold hover:gap-1 transition-all"
                style={{ color: 'var(--color-accent)' }}>
                View all posts <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {regularPosts.map((post) => {
                const meta = getCategoryMeta(post.category?.name ?? '');
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex gap-3 items-stretch rounded-2xl p-4 transition-all hover:shadow-sm"
                    style={{ background: 'var(--color-card)', border: '1px solid var(--color-card-border)' }}>
                    <PostThumb post={post} className="w-16 min-h-[56px] rounded-xl flex-shrink-0 self-stretch" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.badge}`}>
                          {post.category?.name ?? 'Article'}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors"
                        style={{ color: 'var(--color-foreground)' }}>
                        {post.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                        <Clock className="w-3 h-3" />{readTimeMin(post.content)} min read
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--color-primary-light)' }}>
              <BookOpen className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>No posts found.</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              {category ? 'No posts in this category yet.' : 'Check back soon — our team is working on great content.'}
            </p>
            {category && (
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                style={{ color: 'var(--color-accent)' }}>
                View all posts <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
