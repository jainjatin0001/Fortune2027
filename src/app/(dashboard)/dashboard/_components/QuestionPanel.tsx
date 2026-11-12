'use client';

import { useState, useTransition } from 'react';
import type { QuestionType } from '@prisma/client';
import { CheckCircle2, ChevronDown, Users, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RichContent } from '@/components/shared/RichContent';
import type { StudentAnswer } from '@/lib/grading';
import { cn } from '@/lib/utils';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export interface PanelQuestion {
  statement: string;
  imageUrl: string | null;
  questionType: QuestionType;
  options: { id: string; content: string; imageUrl: string | null }[];
}

export interface PanelReveal {
  isCorrect: boolean;
  selectedOptionIds: string[];
  textAnswer: string | null;
  correctOptionIds: string[];
  acceptedAnswers: string[];
  explanation: string | null;
  /** Community stats — shown only when present (daily question) */
  totalAnswers?: number;
  correctPct?: number;
}

export type SubmitResult<R extends PanelReveal> = { ok: true; reveal: R } | { ok: false; error: string };

interface QuestionPanelProps<R extends PanelReveal> {
  title: string;
  description: string;
  question: PanelQuestion;
  reveal: R | null;
  submit: (answer: StudentAnswer) => Promise<SubmitResult<R>>;
  onAnswered: (reveal: R) => void;
  onClose: () => void;
  /** Footer text after answering */
  doneNote: string;
  /** Lets the student clear the result and answer again (practice mode) */
  onTryAgain?: () => void;
}

/** Dialog body for answering one question. Render inside <DialogContent>. */
export function QuestionPanel<R extends PanelReveal>({
  title, description, question, reveal, submit, onAnswered, onClose, doneNote, onTryAgain,
}: QuestionPanelProps<R>) {
  const isTyped = question.questionType === 'NUMERIC' || question.questionType === 'TEXT';
  const isMulti = question.questionType === 'MULTIPLE_CORRECT';

  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [pending, startTransition] = useTransition();

  const canSubmit = !reveal && !pending && (isTyped ? text.trim().length > 0 : selected.length > 0);
  const chosen = reveal ? reveal.selectedOptionIds : selected;

  const toggle = (id: string) =>
    setSelected(prev => (isMulti ? (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) : [id]));

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      const res = await submit(isTyped ? { selectedOptionIds: [], textAnswer: text } : { selectedOptionIds: selected });
      if (res.ok) {
        setShowExplanation(false);
        onAnswered(res.reveal);
      } else {
        setError(res.error);
      }
    });
  };

  const tryAgain = () => {
    setSelected([]);
    setText('');
    setError(null);
    setShowExplanation(false);
    onTryAgain?.();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <DialogBody className="space-y-5">
        <div className="text-[15px] leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
          <RichContent html={question.statement} />
          {question.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={question.imageUrl} alt="" className="mt-3 max-w-full rounded-lg" />
          )}
        </div>

        {isTyped ? (
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
              Your answer
              <Input
                value={reveal ? reveal.textAnswer ?? '' : text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder={question.questionType === 'NUMERIC' ? 'e.g. 3/4 or 0.75' : 'Type your answer'}
                disabled={!!reveal || pending}
                className="mt-1"
                style={reveal ? { borderColor: reveal.isCorrect ? 'var(--color-success)' : 'var(--color-danger)' } : undefined}
              />
            </label>
            {reveal && !reveal.isCorrect && reveal.acceptedAnswers.length > 0 && (
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Correct answer{reveal.acceptedAnswers.length > 1 ? 's' : ''}:{' '}
                <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{reveal.acceptedAnswers.join(', ')}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2" role={isMulti ? 'group' : 'radiogroup'} aria-label="Answer choices">
            {isMulti && !reveal && (
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Select all that apply.</p>
            )}
            {question.options.map((o, i) => {
              const isChosen = chosen.includes(o.id);
              const isKey = reveal?.correctOptionIds.includes(o.id) ?? false;
              const state = !reveal ? (isChosen ? 'selected' : 'idle') : isKey ? 'correct' : isChosen ? 'wrong' : 'idle';
              return (
                <button
                  key={o.id}
                  type="button"
                  role={isMulti ? 'checkbox' : 'radio'}
                  aria-checked={isChosen}
                  disabled={!!reveal || pending}
                  onClick={() => toggle(o.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-colors',
                    !reveal && 'hover:bg-(--color-muted)',
                  )}
                  style={{
                    borderColor:
                      state === 'correct' ? 'var(--color-success)'
                        : state === 'wrong' ? 'var(--color-danger)'
                          : state === 'selected' ? 'var(--color-accent)'
                            : 'var(--color-border)',
                    background:
                      state === 'correct' ? 'var(--color-success-light)'
                        : state === 'wrong' ? 'var(--color-danger-light)'
                          : undefined,
                    color: 'var(--color-foreground)',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: state === 'selected' ? 'var(--color-accent)' : 'var(--color-muted)',
                      color: state === 'selected' ? '#fff' : 'var(--color-muted-foreground)',
                    }}
                  >
                    {LETTERS[i] ?? i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <RichContent html={o.content} as="span" />
                    {o.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={o.imageUrl} alt="" className="mt-2 max-w-full rounded-md" />
                    )}
                  </span>
                  {state === 'correct' && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--color-success)' }} aria-label="Correct answer" />}
                  {state === 'wrong' && <XCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-danger)' }} aria-label="Your answer" />}
                </button>
              );
            })}
          </div>
        )}

        {reveal && (
          <div className="space-y-3" aria-live="polite">
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl p-3"
              style={{ background: reveal.isCorrect ? 'var(--color-success-light)' : 'var(--color-danger-light)' }}
            >
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
                {reveal.isCorrect
                  ? <><CheckCircle2 className="h-4 w-4" style={{ color: 'var(--color-success)' }} aria-hidden /> Correct — nice work!</>
                  : <><XCircle className="h-4 w-4" style={{ color: 'var(--color-danger)' }} aria-hidden /> Not quite this time</>}
              </p>
              {reveal.totalAnswers !== undefined && (
                <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {reveal.correctPct}% of {reveal.totalAnswers} student{reveal.totalAnswers === 1 ? '' : 's'} got it right
                </p>
              )}
            </div>
            {reveal.explanation && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowExplanation(s => !s)}
                  aria-expanded={showExplanation}
                  className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {showExplanation ? 'Hide' : 'Show'} explanation
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showExplanation && 'rotate-180')} aria-hidden />
                </button>
                {showExplanation && (
                  <div className="mt-2 text-sm rounded-xl p-4" style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
                    <RichContent html={reveal.explanation} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm" role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>}
      </DialogBody>

      <DialogFooter className="pt-4 border-t -mx-6 px-6 gap-2" style={{ borderColor: 'var(--color-border)' }}>
        {reveal ? (
          <>
            <p className="text-xs self-center sm:mr-auto" style={{ color: 'var(--color-muted-foreground)' }}>{doneNote}</p>
            {onTryAgain && !reveal.isCorrect && <Button variant="outline" onClick={tryAgain}>Try again</Button>}
            <Button variant="outline" onClick={onClose}>Close</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>Later</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>{pending ? 'Checking…' : 'Submit answer'}</Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}
