'use client';

import { useState } from 'react';
import { ArrowRight, BookOpenText, CheckCircle2, Sigma, XCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { DailyQuestionCardData, DailyQuestionReveal } from '@/lib/progress/daily-question';
import { answerDailyQuestion } from '../actions';
import { difficultyLabel } from '@/lib/progress/format';
import { QuestionPanel } from './QuestionPanel';

/** Compact dashboard tile; the question itself opens in a dialog. */
export function DailyQuestionCard({ data }: { data: DailyQuestionCardData }) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState<DailyQuestionReveal | null>(data.reveal);
  const TrackIcon = /math/i.test(data.trackName) ? Sigma : BookOpenText;

  const status = !reveal
    ? { label: 'Not attempted', color: 'var(--color-muted-foreground)', icon: null }
    : reveal.isCorrect
      ? { label: 'Solved correctly', color: 'var(--color-success)', icon: CheckCircle2 }
      : { label: 'Answered incorrectly', color: 'var(--color-danger)', icon: XCircle };
  const StatusIcon = status.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card-base p-5 h-full w-full text-left flex flex-col gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
        aria-haspopup="dialog"
        aria-label={`${data.trackName} question of the day — ${status.label}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'color-mix(in srgb, var(--chart-series) 12%, transparent)', color: 'var(--chart-series)' }}
          >
            <TrackIcon className="h-5 w-5" aria-hidden />
          </div>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
          >
            {difficultyLabel(data.question.difficulty)}
          </span>
        </div>

        {/* Fills the card's free height so the three lines sit evenly spaced, not bunched at the top */}
        <div className="min-w-0 flex-1 flex flex-col justify-center gap-2 py-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>
            Question of the Day
          </p>
          <p className="text-xl font-bold leading-tight" style={{ color: 'var(--color-foreground)' }}>{data.trackName}</p>
          <p className="text-sm truncate" style={{ color: 'var(--color-muted-foreground)' }}>{data.question.subjectName}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: status.color }}>
            {StatusIcon && <StatusIcon className="h-3.5 w-3.5" aria-hidden />}
            {status.label}
          </span>
          <span
            className="text-xs font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--color-accent)' }}
          >
            {reveal ? 'Review' : 'Solve now'} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <QuestionPanel
            title={`${data.trackName} · Question of the Day`}
            description={`${data.question.subjectName} · ${difficultyLabel(data.question.difficulty)} · One attempt`}
            question={data.question}
            reveal={reveal}
            submit={(answer) => answerDailyQuestion(data.dailyQuestionId, answer)}
            onAnswered={setReveal}
            onClose={() => setOpen(false)}
            doneNote="A new question unlocks tomorrow."
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
