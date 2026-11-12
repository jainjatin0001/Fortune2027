'use client';

import { useState } from 'react';
import { RotateCcw, ThumbsUp, XCircle } from 'lucide-react';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MistakeQuestion } from '@/lib/progress/queries';
import { retryMistake, type PracticeReveal } from '../actions';
import { EmptyState, SectionCard } from './SectionCard';
import { difficultyLabel } from '@/lib/progress/format';
import { QuestionPanel } from './QuestionPanel';

const PREVIEW_COUNT = 3;

const plainText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function MistakeRow({ item, onRetry }: { item: MistakeQuestion; onRetry: () => void }) {
  return (
    <li className="py-3 flex items-start gap-3">
      <XCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-danger)' }} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
          {item.subjectName} · {difficultyLabel(item.difficulty)} · {shortDate(item.answeredAt)}
        </p>
        <p className="text-sm line-clamp-2 mt-0.5" style={{ color: 'var(--color-foreground)' }}>{plainText(item.statement) || 'View question'}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 inline-flex items-center gap-1 rounded-lg border px-2.5 h-8 text-xs font-semibold hover:bg-(--color-muted)"
        style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-foreground)' }}
      >
        <RotateCcw className="h-3 w-3" aria-hidden /> Retry
      </button>
    </li>
  );
}

export function MistakesCard({ total, items }: { total: number; items: MistakeQuestion[] }) {
  const [listOpen, setListOpen] = useState(false);
  const [active, setActive] = useState<MistakeQuestion | null>(null);
  const [reveal, setReveal] = useState<PracticeReveal | null>(null);

  const retry = (item: MistakeQuestion) => {
    setReveal(null);
    setActive(item);
  };

  return (
    <SectionCard
      title={total > 0 ? `Mistakes to review (${total})` : 'Mistakes to review'}
      description="Questions you got wrong — retries are practice only"
    >
      {items.length === 0 ? (
        <EmptyState icon={ThumbsUp} title="Nothing to review" body="Questions you answer incorrectly in quizzes and mock tests will appear here." />
      ) : (
        <div className="flex flex-col h-full">
          <ul className="divide-y -mt-3" style={{ borderColor: 'var(--color-border)' }}>
            {items.slice(0, PREVIEW_COUNT).map(item => (
              <MistakeRow key={item.questionId} item={item} onRetry={() => retry(item)} />
            ))}
          </ul>
          {items.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setListOpen(true)}
              className="mt-auto pt-2 text-sm font-semibold self-start hover:underline"
              style={{ color: 'var(--color-accent)' }}
            >
              Review all{total > items.length ? ` (latest ${items.length})` : ''} →
            </button>
          )}
        </div>
      )}

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mistakes to review</DialogTitle>
            <DialogDescription>
              {total > items.length ? `Your ${items.length} most recent of ${total}` : `${total} question${total === 1 ? '' : 's'}`} · answer one correctly in a quiz or mock test to clear it
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {items.map(item => (
                <MistakeRow key={item.questionId} item={item} onRetry={() => { setListOpen(false); retry(item); }} />
              ))}
            </ul>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={!!active} onOpenChange={(o) => { if (!o) setActive(null); }}>
        <DialogContent className="max-w-2xl">
          {active && (
            <QuestionPanel
              key={active.questionId}
              title="Retry question"
              description={`${active.subjectName} · ${difficultyLabel(active.difficulty)} · Practice — doesn’t affect your stats`}
              question={active}
              reveal={reveal}
              submit={(answer) => retryMistake(active.questionId, answer)}
              onAnswered={setReveal}
              onTryAgain={() => setReveal(null)}
              onClose={() => setActive(null)}
              doneNote="Practice only — your scores are unchanged."
            />
          )}
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
