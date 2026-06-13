import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'SAT strategies, ACT tips, AP study guides, coding tutorials, and college admissions advice from the EduReach team.',
};

const posts = [
  { slug: 'how-to-score-1500-sat', title: 'How to Score 1500+ on the SAT: A Complete 12-Week Study Plan', excerpt: 'A step-by-step study plan that has helped thousands of students break the 1500 barrier on the Digital SAT.', category: 'SAT Prep', readTime: 8, date: 'Jun 1, 2026', featured: true },
  { slug: 'act-vs-sat-which-test', title: 'ACT vs SAT: Which Test Should You Take in 2026?', excerpt: 'A data-driven comparison to help you choose the test where you\'ll score highest based on your strengths.', category: 'Test Strategy', readTime: 6, date: 'May 28, 2026', featured: true },
  { slug: 'top-10-ap-exams-college-credit', title: 'Top 10 AP Exams That Give You the Most College Credit', excerpt: 'Not all AP exams are equal when it comes to college credit acceptance. Here\'s where to focus your energy.', category: 'AP Exams', readTime: 5, date: 'May 20, 2026', featured: false },
  { slug: 'python-for-high-school-students', title: 'Why Every High School Student Should Learn Python in 2026', excerpt: 'Python has become the most in-demand programming language. Here\'s how to start learning it in high school.', category: 'Coding', readTime: 4, date: 'May 15, 2026', featured: false },
  { slug: 'sat-math-hardest-topics', title: 'The 5 Hardest SAT Math Topics (And How to Master Them)', excerpt: 'Data analysis, advanced algebra, and circle geometry trip up even strong math students. Here\'s how to fix that.', category: 'SAT Prep', readTime: 7, date: 'May 10, 2026', featured: false },
  { slug: 'ap-exam-week-survival-guide', title: 'AP Exam Week Survival Guide: Study Schedule, Sleep, and Strategy', excerpt: 'The week before AP exams requires a completely different approach than the months before. Plan it right.', category: 'AP Exams', readTime: 5, date: 'May 5, 2026', featured: false },
];

const categoryColors: Record<string, string> = {
  'SAT Prep': 'badge-sat',
  'ACT Prep': 'badge-act',
  'AP Exams': 'badge-ap',
  'Coding': 'badge-coding',
  'Test Strategy': '',
};

export default function BlogPage() {
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

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
        {/* Featured */}
        <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Featured Articles</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-base p-6 group block">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[post.category] ?? 'badge-hs'}`}>{post.category}</span>
                <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{post.date}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
                {post.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-muted-foreground)' }}>{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime} min read</span>
                <span className="flex items-center gap-1 ml-auto text-[var(--color-accent)] font-medium group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* All posts */}
        <h2 className="text-heading-4 mb-6" style={{ color: 'var(--color-foreground)' }}>Recent Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-base p-5 group block">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[post.category] ?? 'badge-hs'}`}>{post.category}</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2" style={{ color: 'var(--color-foreground)' }}>
                {post.title}
              </h3>
              <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="h-3 w-3" />{post.readTime} min
                <span className="ml-auto">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
