import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { htmlToText } from '@/components/admin/RichEditor/utils/htmlToText';

export const dynamic = 'force-dynamic';

function readTimeMin(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateShort(date: Date | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(date: Date | null) {
  if (!date) return '';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateShort(date);
}

const categoryMeta: Record<string, { badge: string; gradient: string; dot: string }> = {
  'SAT Prep':     { badge: 'badge-sat',    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', dot: '#7c3aed' },
  'ACT Prep':     { badge: 'badge-act',    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', dot: '#0891b2' },
  'AP Exams':     { badge: 'badge-ap',     gradient: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)', dot: '#b45309' },
  'Coding':       { badge: 'badge-coding', gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)', dot: '#059669' },
  'College Prep': { badge: 'badge-hs',     gradient: 'linear-gradient(135deg, #0f766e 0%, #06b6d4 100%)', dot: '#be185d' },
  'Study Tips':   { badge: 'badge-act',    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', dot: '#0891b2' },
};
const defaultMeta = { badge: 'badge-hs', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0891b2 100%)', dot: '#2563eb' };

function getCategoryMeta(name: string) {
  return categoryMeta[name] ?? defaultMeta;
}


function renderContent(content: string) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return paragraphs.map((para, i) => {
    const lines = para.split('\n').filter(Boolean);
    if (lines.length === 1 && lines[0].startsWith('# ')) {
      return <h2 key={i} className="text-heading-3 mt-10 mb-4" style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-secondary)' }}>{lines[0].replace(/^#+\s/, '')}</h2>;
    }
    if (lines.length === 1 && lines[0].startsWith('## ')) {
      return <h3 key={i} className="text-heading-4 mt-8 mb-3 font-bold" style={{ color: 'var(--color-foreground)' }}>{lines[0].replace(/^#+\s/, '')}</h3>;
    }
    return (
      <p key={i} className="text-body leading-relaxed mb-6" style={{ color: 'var(--color-foreground)', opacity: 0.88 }}>
        {lines.join(' ')}
      </p>
    );
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, coverImage: true },
  });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [post, featuredPosts] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true, slug: true, title: true, excerpt: true, content: true,
        coverImage: true, isFeatured: true, publishedAt: true, createdAt: true,
        tags: true,
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        id: true, slug: true, title: true, excerpt: true, content: true,
        coverImage: true, publishedAt: true, createdAt: true,
        author: { select: { firstName: true, lastName: true } },
        category: { select: { name: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      take: 6,
    }),
  ]);
    if (!post) notFound();
  if (!post) notFound();
  const catMeta = getCategoryMeta(post.category?.name ?? '');
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const postDate = post.publishedAt ?? post.createdAt;
  const readTime = readTimeMin(post.content);

  const sidebarPosts = featuredPosts.filter((p) => p.slug !== slug).slice(0, 5);

  return (
    <div style={{ background: 'var(--color-background)' }}>

      {/* Breadcrumb bar */}
      <div style={{ background: 'var(--color-background-alt)', borderBottom: '1px solid var(--color-card-border)' }}>
        <div className="container-app py-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            <Link href="/blog" className="flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]">
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            {post.category && (
              <>
                <span className="font-medium" style={{ color: 'var(--color-accent)' }}>{post.category.name}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </>
            )}
            <span className="truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="container-app py-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">

          {/* ── LEFT: Article ── */}
          <article>

            {/* Cover image */}
            <div className="w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/9', background: catMeta.gradient }}>
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: catMeta.gradient }}>
                  <BookOpen className="w-16 h-16 opacity-30 text-white" />
                </div>
              )}
            </div>

            {/* Category + meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${catMeta.badge}`}>
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
              <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {formatDate(postDate)}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-heading-1 mb-5 leading-tight"
              style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-secondary)' }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
                <div className="text-body-lg mb-6 font-medium" style={{ color: 'var(--color-muted-foreground)' }} dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            )}

            {/* Author row */}
            <div className="flex items-center gap-3 pb-8 mb-8" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: catMeta.gradient }}
              >
                {post.author.avatarUrl ? (
                  <img src={post.author.avatarUrl} alt={authorName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  authorName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  {authorName}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Published {timeAgo(postDate)}
                </div>
              </div>
            </div>

            {/* Body content */}
            <div
              className="max-w-none rich-content prose"
              style={{ fontFamily: 'var(--font-secondary)', lineHeight: 1.85 }}
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted-foreground)' }} />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:gap-3"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </div>
          </article>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="lg:sticky lg:top-24 space-y-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--color-background-alt)', border: '1px solid var(--color-card-border)' }}
            >
              {/* Sidebar header */}
              <div
                className="px-5 py-4"
                style={{ borderBottom: '2px solid var(--color-accent)' }}
              >
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Featured Articles
                </span>
              </div>

              {/* Article list */}
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {sidebarPosts.length === 0 && (
                  <div className="px-5 py-6 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                    No other articles yet.
                  </div>
                )}
                {sidebarPosts.map((sp, idx) => {
                  const spCat = getCategoryMeta(sp.category?.name ?? '');
                  const isFirst = idx === 0;
                  return (
                    <Link
                      key={sp.slug}
                      href={`/blog/${sp.slug}`}
                      className="flex gap-3 px-5 py-4 transition-colors hover:bg-[var(--color-card)] group"
                      style={{ borderColor: 'var(--color-card-border)' }}
                    >
                      {/* Dot indicator */}
                      <div className="flex-shrink-0 mt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: isFirst ? spCat.dot : 'var(--color-border-strong)' }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold leading-snug mb-1 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors"
                          style={{ color: 'var(--color-foreground)' }}
                        >
                          {sp.title}
                        </p>
                        {sp.excerpt && (
                          <p className="text-xs line-clamp-2 mb-2 leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
                            {htmlToText(sp.excerpt, 120)}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                          <span className="font-medium italic">
                            by {sp.author.firstName} {sp.author.lastName}
                          </span>
                          <span className="opacity-40">·</span>
                          <span>{timeAgo(sp.publishedAt ?? sp.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* View More */}
              <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                <Link
                  href="/blog"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:gap-2.5"
                  style={{
                    background: 'var(--color-card)',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-card-border)',
                  }}
                >
                  View More
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
