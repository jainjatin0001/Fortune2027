import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BookOpen, Play, Video, FileText, HelpCircle,
  ArrowRight, ShieldCheck, Users, CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'My Courses' };

const PROGRAM_COLOR: Record<string, string> = {
  sat: '#7c3aed',
  'sat-prep': '#7c3aed',
  act: '#0891b2',
  'act-prep': '#0891b2',
  ap: '#b45309',
  'ap-exam': '#b45309',
  coding: '#059669',
  'high-school': '#be185d',
};

function getProgramColor(slug?: string | null) {
  if (!slug) return 'var(--color-primary)';
  return PROGRAM_COLOR[slug] ?? PROGRAM_COLOR[slug.split('-')[0]] ?? 'var(--color-primary)';
}

type AssetRow = { assetType: string };
type ModuleRow = { assets: AssetRow[] };

function countAssets(modules: ModuleRow[]) {
  const all = modules.flatMap(m => m.assets);
  return {
    videos: all.filter(a => a.assetType === 'VIDEO').length,
    pdfs: all.filter(a => a.assetType === 'PDF').length,
    articles: all.filter(a => a.assetType === 'ARTICLE').length,
    quizzes: all.filter(a => a.assetType === 'QUIZ' || a.assetType === 'QUESTION_SET').length,
    total: all.length,
  };
}

type Counts = ReturnType<typeof countAssets>;

// ─── Sub-components ────────────────────────────────────────────

function Thumbnail({
  url,
  title,
  color,
}: {
  url: string | null;
  title: string;
  color: string;
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={title} className="w-full h-full object-cover" />
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}25, ${color}55)` }}
    >
      <BookOpen className="h-9 w-9 opacity-60" style={{ color }} />
    </div>
  );
}

function ContentPills({ counts }: { counts: Counts }) {
  const items = [
    counts.videos > 0 && { Icon: Video, text: `${counts.videos} video${counts.videos !== 1 ? 's' : ''}` },
    counts.pdfs > 0 && { Icon: FileText, text: `${counts.pdfs} PDF${counts.pdfs !== 1 ? 's' : ''}` },
    counts.articles > 0 && { Icon: BookOpen, text: `${counts.articles} article${counts.articles !== 1 ? 's' : ''}` },
    counts.quizzes > 0 && { Icon: HelpCircle, text: `${counts.quizzes} quiz${counts.quizzes !== 1 ? 'zes' : ''}` },
  ].filter(Boolean) as { Icon: React.ComponentType<{ className?: string }>; text: string }[];

  if (items.length === 0) {
    return (
      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
        {counts.total} lesson{counts.total !== 1 ? 's' : ''}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(({ Icon, text }) => (
        <span
          key={text}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
          style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
        >
          <Icon className="h-3 w-3" />
          {text}
        </span>
      ))}
    </div>
  );
}

// ─── User course card ──────────────────────────────────────────

type UserCardProps = {
  id: string;
  title: string;
  programName?: string | null;
  thumbnailUrl: string | null;
  color: string;
  counts: Counts;
  progressPct: number;
  completedAssets: number;
  totalAssets: number;
};

function UserCourseCard({
  id, title, programName, thumbnailUrl, color,
  counts, progressPct, completedAssets, totalAssets,
}: UserCardProps) {
  const pct = Math.round(progressPct);
  const total = totalAssets || counts.total;
  return (
    <div className="card-base overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="h-36 overflow-hidden relative shrink-0">
        <Thumbnail url={thumbnailUrl} title={title} color={color} />
        {pct > 0 && (
          <div
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow"
            style={{ background: pct >= 100 ? 'var(--color-success)' : color }}
          >
            {pct >= 100 ? '✓ Done' : `${pct}%`}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {programName && (
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
            {programName}
          </span>
        )}
        <h3
          className="font-bold text-sm leading-snug line-clamp-2"
          style={{ color: 'var(--color-foreground)' }}
        >
          {title}
        </h3>

        <ContentPills counts={counts} />

        {/* Progress */}
        <div className="mt-auto pt-1">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: 'var(--color-muted-foreground)' }}>
              {completedAssets}/{total} lessons
            </span>
            <span style={{ color: pct >= 100 ? 'var(--color-success)' : color, fontWeight: 700 }}>
              {pct}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill transition-all"
              style={{
                width: `${pct}%`,
                background: pct >= 100 ? 'var(--color-success)' : color,
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link href={`/dashboard/courses/${id}`} className="block mt-1">
          <Button
            size="sm"
            className="w-full text-white text-xs h-8"
            style={{ background: color }}
          >
            {pct === 0 && <><Play className="h-3.5 w-3.5 mr-1.5" />Start Learning</>}
            {pct > 0 && pct < 100 && <><Play className="h-3.5 w-3.5 mr-1.5" />Continue</>}
            {pct >= 100 && <><CheckCircle className="h-3.5 w-3.5 mr-1.5" />Review Course</>}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Admin course card ─────────────────────────────────────────

type AdminCardProps = {
  id: string;
  title: string;
  programName?: string | null;
  thumbnailUrl: string | null;
  color: string;
  counts: Counts;
  enrollmentCount: number;
};

function AdminCourseCard({
  id, title, programName, thumbnailUrl, color, counts, enrollmentCount,
}: AdminCardProps) {
  return (
    <div className="card-base overflow-hidden flex flex-col group">
      <div className="h-36 overflow-hidden relative shrink-0">
        <Thumbnail url={thumbnailUrl} title={title} color={color} />
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(0,0,0,.55)', color: '#fff' }}
        >
          Admin
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {programName && (
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
            {programName}
          </span>
        )}
        <h3
          className="font-bold text-sm leading-snug line-clamp-2"
          style={{ color: 'var(--color-foreground)' }}
        >
          {title}
        </h3>
        <ContentPills counts={counts} />
        <div
          className="flex items-center gap-1.5 text-xs mt-auto"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          <Users className="h-3.5 w-3.5" />
          {enrollmentCount} enrolled
        </div>
        <Link href={`/dashboard/courses/${id}`}>
          <Button size="sm" className="w-full text-xs h-8" variant="outline">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            View Course
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default async function MyCoursesPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

  // ── Admin: all published courses ─────────────────────────────
  if (isAdmin) {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        program: { select: { name: true, slug: true } },
        modules: {
          where: { isPublished: true },
          include: { assets: { where: { isPublished: true }, select: { id: true, assetType: true } } },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
              All Courses
            </h1>
            <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              {courses.length} published course{courses.length !== 1 ? 's' : ''} — admin view
            </p>
          </div>
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
            style={{
              background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
              color: 'var(--color-danger)',
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Super Admin
          </span>
        </div>

        {courses.length === 0 ? (
          <div
            className="card-base p-12 text-center"
          >
            <BookOpen
              className="h-10 w-10 mx-auto mb-3"
              style={{ color: 'var(--color-muted-foreground)' }}
            />
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              No published courses yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => (
              <AdminCourseCard
                key={c.id}
                id={c.id}
                title={c.title}
                programName={c.program?.name}
                thumbnailUrl={c.thumbnailUrl}
                color={getProgramColor(c.program?.slug)}
                counts={countAssets(c.modules)}
                enrollmentCount={c._count.enrollments}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Regular user: enrolled courses only ──────────────────────
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
    include: {
      course: {
        include: {
          program: { select: { name: true, slug: true } },
          modules: {
            where: { isPublished: true },
            include: {
              assets: { where: { isPublished: true }, select: { id: true, assetType: true } },
            },
          },
        },
      },
      courseProgress: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
            My Courses
          </h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            {enrollments.length > 0
              ? `${enrollments.length} active enrollment${enrollments.length !== 1 ? 's' : ''}`
              : 'Purchase a course to start your learning journey'}
          </p>
        </div>
        {enrollments.length > 0 && (
          <Link href="/courses">
            <Button variant="outline" size="sm">
              Browse More
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--color-muted)' }}
          >
            <BookOpen className="h-8 w-8" style={{ color: 'var(--color-muted-foreground)' }} />
          </div>
          <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>
            No courses yet
          </h2>
          <p
            className="text-body mb-6 max-w-sm mx-auto"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            Purchase a course to unlock your personalised learning journey with videos,
            PDFs, quizzes, and more.
          </p>
          <Link href="/courses">
            <Button className="text-white" style={{ background: 'var(--gradient-primary)' }}>
              Explore Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map(e => (
            <UserCourseCard
              key={e.id}
              id={e.course.id}
              title={e.course.title}
              programName={e.course.program?.name}
              thumbnailUrl={e.course.thumbnailUrl}
              color={getProgramColor(e.course.program?.slug)}
              counts={countAssets(e.course.modules)}
              progressPct={Number(e.courseProgress?.completionPct ?? 0)}
              completedAssets={e.courseProgress?.completedAssets ?? 0}
              totalAssets={e.courseProgress?.totalAssets ?? countAssets(e.course.modules).total}
            />
          ))}
        </div>
      )}
    </div>
  );
}
