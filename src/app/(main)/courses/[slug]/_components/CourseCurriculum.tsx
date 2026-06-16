'use client';

import { useState } from 'react';
import { Play, FileText, HelpCircle, BookOpen, ChevronDown, Lock } from 'lucide-react';

type Asset = {
  id: string;
  title: string;
  assetType: string;
  isFree: boolean;
  videoDuration: number | null;
};

type CurriculumModule = {
  id: string;
  title: string;
  assets: Asset[];
};

function formatDur(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function AssetTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'VIDEO': return <Play className="h-3.5 w-3.5 fill-current" />;
    case 'PDF': return <FileText className="h-3.5 w-3.5" />;
    case 'QUIZ':
    case 'QUESTION_SET': return <HelpCircle className="h-3.5 w-3.5" />;
    default: return <BookOpen className="h-3.5 w-3.5" />;
  }
}

export function CourseCurriculum({ modules }: { modules: CurriculumModule[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(modules.slice(0, 1).map((m) => m.id))
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setOpenIds(new Set(modules.map((m) => m.id)));
  }

  function collapseAll() {
    setOpenIds(new Set());
  }

  const allOpen = openIds.size === modules.length;

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {modules.map((mod, idx) => {
          const isOpen = openIds.has(mod.id);
          const totalDur = mod.assets
            .filter((a) => a.assetType === 'VIDEO' && a.videoDuration)
            .reduce((s, a) => s + (a.videoDuration ?? 0), 0);

          return (
            <div
              key={mod.id}
              className={idx > 0 ? 'border-t' : ''}
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Module header */}
              <button
                onClick={() => toggle(mod.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
                style={{
                  background: isOpen ? 'var(--color-muted)' : 'var(--color-card)',
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--color-muted-foreground)' }}
                  />
                  <span
                    className="font-semibold text-sm leading-snug"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {mod.title}
                  </span>
                </div>
                <div
                  className="text-xs shrink-0 ml-4 text-right tabular-nums"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {mod.assets.length} {mod.assets.length === 1 ? 'lesson' : 'lessons'}
                  {totalDur > 0 && ` · ${formatDur(totalDur)}`}
                </div>
              </button>

              {/* Asset list */}
              {isOpen && (
                <div
                  className="border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {mod.assets.map((asset, ai) => (
                    <div
                      key={asset.id}
                      className={`flex items-center justify-between px-5 py-3 transition-colors hover:bg-[var(--color-muted)] ${ai > 0 ? 'border-t' : ''}`}
                      style={{
                        borderColor: 'var(--color-border)',
                        background: 'var(--color-card)',
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span style={{ color: 'var(--color-accent)' }}>
                          <AssetTypeIcon type={asset.assetType} />
                        </span>
                        <span
                          className="text-sm truncate"
                          style={{ color: 'var(--color-foreground)' }}
                        >
                          {asset.title}
                        </span>
                        {asset.isFree && (
                          <span
                            className="shrink-0 text-xs px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                            }}
                          >
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {asset.assetType === 'VIDEO' && asset.videoDuration && (
                          <span
                            className="text-xs tabular-nums"
                            style={{ color: 'var(--color-muted-foreground)' }}
                          >
                            {formatDur(asset.videoDuration)}
                          </span>
                        )}
                        {!asset.isFree && (
                          <Lock
                            className="h-3.5 w-3.5"
                            style={{ color: 'var(--color-muted-foreground)' }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
