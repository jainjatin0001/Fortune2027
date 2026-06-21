'use client';

import { useState } from 'react';
import {
  ChevronDown, ChevronRight, Play, FileText, BookOpen,
  HelpCircle, ListOrdered, CheckCircle, Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AssetType = 'VIDEO' | 'PDF' | 'ARTICLE' | 'QUIZ' | 'QUESTION_SET';

type SidebarAsset = {
  id: string;
  title: string;
  assetType: AssetType;
  videoDuration: number | null;
  isFree: boolean;
};

export type SidebarModule = {
  id: string;
  title: string;
  assets: SidebarAsset[];
};

interface AssetSidebarProps {
  courseTitle: string;
  courseId: string;
  modules: SidebarModule[];
  completedAssetIds: string[];
  activeAssetId: string | null;
  /** Called when the user picks an asset — parent handles navigation */
  onNavigate: (assetId: string) => void;
  color: string;
  progressPct: number;
  completedCount: number;
  totalCount: number;
}

const ASSET_LABEL: Record<AssetType, string> = {
  VIDEO: 'Video',
  PDF: 'PDF',
  ARTICLE: 'Article',
  QUIZ: 'Quiz',
  QUESTION_SET: 'Question Set',
};

function AssetIcon({ type, className, color }: { type: AssetType; className?: string; color?: string }) {
  const props = { className, ...(color ? { style: { color } } : {}) };
  switch (type) {
    case 'VIDEO': return <Play {...props} />;
    case 'PDF': return <FileText {...props} />;
    case 'ARTICLE': return <BookOpen {...props} />;
    case 'QUIZ': return <HelpCircle {...props} />;
    case 'QUESTION_SET': return <ListOrdered {...props} />;
  }
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AssetSidebar({
  courseTitle,
  courseId: _courseId,
  modules,
  completedAssetIds,
  activeAssetId,
  onNavigate,
  color,
  progressPct,
  completedCount,
  totalCount,
}: AssetSidebarProps) {
  const completedSet = new Set(completedAssetIds);

  const initialExpanded = () => {
    if (activeAssetId) {
      const found = modules.find(m => m.assets.some(a => a.id === activeAssetId));
      if (found) return new Set([found.id]);
    }
    return new Set(modules.slice(0, 1).map(m => m.id));
  };

  const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const rounded = Math.round(progressPct);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Progress header */}
      <div className="px-4 pt-3 pb-3 shrink-0">
        <p
          className="text-xs font-bold leading-snug mb-3 line-clamp-2"
          style={{ color: 'var(--color-foreground)' }}
          title={courseTitle}
        >
          {courseTitle}
        </p>
        {totalCount > 0 && (
          <>
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: 'var(--color-muted-foreground)' }}>
                {completedCount}/{totalCount} lessons
              </span>
              <span
                style={{
                  color: rounded >= 100 ? 'var(--color-success)' : color,
                  fontWeight: 700,
                }}
              >
                {rounded}%
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill transition-all duration-500"
                style={{
                  width: `${rounded}%`,
                  background: rounded >= 100 ? 'var(--color-success)' : color,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="shrink-0 border-t" style={{ borderColor: 'var(--color-border)' }} />

      {/* Module + asset list */}
      <nav className="flex-1 overflow-y-auto p-2 min-h-0" aria-label="Course content">
        {modules.map((mod, modIdx) => {
          // Skip modules with no assets
          if (mod.assets.length === 0) return null;

          const isOpen = expanded.has(mod.id);
          const modCompleted = mod.assets.filter(a => completedSet.has(a.id)).length;
          const allDone = modCompleted === mod.assets.length;

          return (
            <div key={mod.id} className="mb-0.5">
              <button
                onClick={() => toggle(mod.id)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors text-left"
              >
                <span style={{ color: allDone ? 'var(--color-success)' : 'var(--color-muted-foreground)' }}>
                  {isOpen
                    ? <ChevronDown className="h-3.5 w-3.5" />
                    : <ChevronRight className="h-3.5 w-3.5" />}
                </span>
                <span
                  className="flex-1 text-xs font-semibold truncate"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {modIdx + 1}. {mod.title}
                </span>
                <span
                  className="text-[10px] shrink-0 font-medium"
                  style={{ color: allDone ? 'var(--color-success)' : 'var(--color-muted-foreground)' }}
                >
                  {modCompleted}/{mod.assets.length}
                </span>
              </button>

              {isOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {mod.assets.map(asset => {
                    const isActive = asset.id === activeAssetId;
                    const isDone = completedSet.has(asset.id);

                    return (
                      <button
                        key={asset.id}
                        onClick={() => onNavigate(asset.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors',
                          isActive
                            ? 'bg-[var(--sidebar-item-active)]'
                            : 'hover:bg-[var(--color-muted)]',
                        )}
                      >
                        <span className="w-4 h-4 flex items-center justify-center shrink-0">
                          {isDone ? (
                            <CheckCircle className="h-3.5 w-3.5" style={{ color: 'var(--color-success)' }} />
                          ) : (
                            <Circle
                              className="h-3.5 w-3.5"
                              style={{ color: isActive ? color : 'var(--color-border)' }}
                            />
                          )}
                        </span>

                        <AssetIcon
                          type={asset.assetType}
                          className="h-3.5 w-3.5 shrink-0"
                          color={isActive ? color : 'var(--color-muted-foreground)'}
                        />

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-medium truncate"
                            style={{
                              color: isActive
                                ? 'var(--sidebar-item-active-text)'
                                : 'var(--color-foreground)',
                            }}
                          >
                            {asset.title}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                            {ASSET_LABEL[asset.assetType]}
                            {asset.videoDuration ? ` · ${formatDuration(asset.videoDuration)}` : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
