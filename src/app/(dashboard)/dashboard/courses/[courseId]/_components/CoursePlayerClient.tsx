'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen, ChevronLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetSidebar, type SidebarModule } from './AssetSidebar';
import { AssetViewer, type AssetData } from './AssetViewer';

export interface CoursePlayerClientProps {
  courseId: string;
  courseTitle: string;
  allAssets: AssetData[];
  sidebarModules: SidebarModule[];
  /** Asset ID to activate on first render (from URL ?asset= param, resolved server-side) */
  initialActiveAssetId: string | null;
  completedAssetIds: string[];
  enrollmentId: string | null;
  color: string;
  /** Server-computed initial progress % */
  initialProgressPct: number;
  totalCount: number;
}

export function CoursePlayerClient({
  courseId,
  courseTitle,
  allAssets,
  sidebarModules,
  initialActiveAssetId,
  completedAssetIds,
  enrollmentId,
  color,
  initialProgressPct,
  totalCount,
}: CoursePlayerClientProps) {
  // ── State ────────────────────────────────────────────────────

  const [activeAssetId, setActiveAssetId] = useState<string | null>(() => {
    if (initialActiveAssetId) return initialActiveAssetId;
    // Default to first incomplete asset, or the very first asset
    return (
      allAssets.find(a => !completedAssetIds.includes(a.id))?.id ??
      allAssets[0]?.id ??
      null
    );
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Optimistic local completion list — avoids a server re-fetch on mark complete
  const [localCompleted, setLocalCompleted] = useState(completedAssetIds);

  // ── Derived values ───────────────────────────────────────────

  const activeAsset = activeAssetId
    ? (allAssets.find(a => a.id === activeAssetId) ?? null)
    : null;

  const currentIdx = activeAsset
    ? allAssets.findIndex(a => a.id === activeAsset.id)
    : -1;

  const nextAssetId =
    currentIdx >= 0 && currentIdx + 1 < allAssets.length
      ? allAssets[currentIdx + 1].id
      : null;

  const completedCount = localCompleted.length;

  const progressPct =
    totalCount > 0
      ? (completedCount / totalCount) * 100
      : initialProgressPct;

  const isActiveCompleted = activeAsset
    ? localCompleted.includes(activeAsset.id)
    : false;

  // ── Handlers ─────────────────────────────────────────────────

  /**
   * Switch to a different asset instantly — no server round-trip.
   * URL is synced via history API so links remain shareable on refresh,
   * but Next.js won't re-render the server component.
   */
  const navigateTo = (assetId: string) => {
    setActiveAssetId(assetId);
    window.history.replaceState(
      null,
      '',
      `/dashboard/courses/${courseId}?asset=${assetId}`,
    );
  };

  /** Optimistically mark an asset complete before the DB write resolves */
  const handleComplete = (assetId: string) => {
    setLocalCompleted(prev =>
      prev.includes(assetId) ? prev : [...prev, assetId],
    );
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <div
      className="-m-6 flex overflow-hidden"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* ── Course content sidebar ─────────────────────────────── */}
      {sidebarOpen && (
        <aside
          className="hidden lg:flex flex-col shrink-0"
          style={{
            width: 288,
            background: 'var(--color-card)',
            borderRight: '1px solid var(--color-border)',
          }}
        >
          {/* Sidebar header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 border-b shrink-0"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              Course Content
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-[var(--color-muted)] transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse course sidebar"
            >
              <PanelLeftClose
                className="h-3.5 w-3.5"
                style={{ color: 'var(--color-muted-foreground)' }}
              />
            </button>
          </div>

          <AssetSidebar
            courseTitle={courseTitle}
            courseId={courseId}
            modules={sidebarModules}
            completedAssetIds={localCompleted}
            activeAssetId={activeAssetId}
            onNavigate={navigateTo}
            color={color}
            progressPct={progressPct}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </aside>
      )}

      {/* ── Collapsed sidebar re-open strip (docked to dashboard sidebar) ── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex flex-col items-center justify-start pt-3 w-7 shrink-0 border-r hover:bg-[var(--color-muted)] transition-colors"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
          title="Expand sidebar"
          aria-label="Expand course sidebar"
        >
          <PanelLeftOpen
            className="h-4 w-4"
            style={{ color: 'var(--color-muted-foreground)' }}
          />
        </button>
      )}

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar: breadcrumb + mini progress */}
        <div
          className="flex items-center gap-2 px-4 h-10 border-b shrink-0"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Mobile back */}
          <Link href="/dashboard/courses" className="lg:hidden -ml-1">
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1 text-xs min-w-0 flex-1 overflow-hidden"
            aria-label="Course breadcrumb"
          >
            <Link
              href="/dashboard/courses"
              className="hover:underline shrink-0 hidden sm:block"
              style={{ color: 'var(--color-accent)' }}
            >
              My Courses
            </Link>
            <span
              className="shrink-0 hidden sm:block"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              /
            </span>
            <span
              className="truncate shrink-0 max-w-[140px] sm:max-w-[200px]"
              style={{ color: 'var(--color-muted-foreground)' }}
              title={courseTitle}
            >
              {courseTitle}
            </span>
            {activeAsset && (
              <>
                <span style={{ color: 'var(--color-muted-foreground)' }}>/</span>
                <span
                  className="truncate font-medium"
                  style={{ color: 'var(--color-foreground)' }}
                  title={activeAsset.title}
                >
                  {activeAsset.title}
                </span>
              </>
            )}
          </nav>

          {/* Mini progress pill */}
          {totalCount > 0 && (
            <div
              className="hidden sm:flex items-center gap-2 shrink-0 pl-3 border-l"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="w-16 progress-track"
                role="progressbar"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-fill transition-all duration-500"
                  style={{
                    width: `${Math.round(progressPct)}%`,
                    background: progressPct >= 100 ? 'var(--color-success)' : color,
                  }}
                />
              </div>
              <span
                className="text-xs font-bold tabular-nums"
                style={{
                  color: progressPct >= 100 ? 'var(--color-success)' : color,
                  minWidth: '2.5rem',
                }}
              >
                {Math.round(progressPct)}%
              </span>
            </div>
          )}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            {activeAsset ? (
              /**
               * key={activeAsset.id} remounts AssetViewer on asset change —
               * guarantees fresh local state (completed, quiz answers) without
               * manual resets inside the component.
               */
              <AssetViewer
                key={activeAsset.id}
                asset={activeAsset}
                enrollmentId={enrollmentId}
                isCompleted={isActiveCompleted}
                nextAssetId={nextAssetId}
                courseId={courseId}
                color={color}
                onComplete={handleComplete}
                onNavigate={navigateTo}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center h-80 rounded-2xl border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <BookOpen
                  className="h-10 w-10 mb-3"
                  style={{ color: 'var(--color-muted-foreground)' }}
                />
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  No lessons available for this course yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
