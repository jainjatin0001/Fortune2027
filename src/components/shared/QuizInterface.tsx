'use client';

import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react';
import { Check, X, Clock, ChevronRight, ChevronLeft, Trophy, RotateCcw, ListChecks, Target, Sparkles, ArrowRight, Loader2, AlertCircle, Flag, Mail, MessageSquareText } from 'lucide-react';
import { cn, getDifficultyLabel, getDifficultyClass } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DemoQuestion, QuestionType } from '@/types';
import { RichContent, usePreloadImages } from './RichContent';
import { demoAnswerKey, gradeAnswer, isAnswered as hasAnswer, isTypedQuestion, type StudentAnswer } from '@/lib/grading';

interface QuizInterfaceProps {
  questions: DemoQuestion[];
  title?: string;
  timeLimit?: number; // seconds; omit for an untimed quiz
  passingScore?: number; // percentage, default 70
  onComplete?: (score: number, answers: Record<string, StudentAnswer>) => void;
  className?: string;
  /** Enables QuizAttempt persistence for quizzes loaded from the quiz library. */
  quizId?: string;
}

type QuizState = 'idle' | 'active' | 'complete';

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const;
const DIFFICULTY_COLORS: Record<(typeof DIFFICULTY_ORDER)[number], string> = {
  EASY: 'var(--color-success)',
  MEDIUM: 'var(--color-warning)',
  HARD: 'var(--color-danger)',
  EXPERT: 'var(--color-sat)',
};

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SINGLE_CORRECT: 'Single choice',
  MULTIPLE_CORRECT: 'Multiple choice',
  NUMERIC: 'Numeric answer',
  TEXT: 'Short answer',
};

const LOW_TIME_SECONDS = 5 * 60;
const FEEDBACK_EMAIL = 'info.deltatutors@gmail.com';

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function QuizInterface({ questions, title = 'Practice Quiz', timeLimit, passingScore = 70, onComplete, className, quizId }: QuizInterfaceProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [totalTime] = useState(timeLimit);
  const attemptId = useRef<string | null>(null);
  const startedAt = useRef<number | null>(null);
  // One request chain per question so a later answer is never overwritten by an earlier one
  const saveChains = useRef<Record<string, Promise<void>>>({});
  const lastSaved = useRef<Record<string, string>>({});
  const hasCompleted = useRef(false);
  const isStarting = useRef(false);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const current = questions[currentIndex];
  const questionType = current?.questionType ?? 'SINGLE_CORRECT';
  const isTyped = isTypedQuestion(questionType);
  const isMulti = questionType === 'MULTIPLE_CORRECT';
  const currentAnswer = current ? answers[current.id] : undefined;
  const isCorrectFor = (q: DemoQuestion) => gradeAnswer(demoAnswerKey(q), answers[q.id]) === true;
  const score = questions.filter(isCorrectFor).length;
  const answeredCount = questions.filter((q) => hasAnswer(answers[q.id])).length;
  const remainingCount = questions.length - answeredCount;
  const flagCount = questions.filter((q) => flagged[q.id]).length;

  usePreloadImages(questions.flatMap((q) => [q.question, q.explanation, ...q.options.map((o) => o.content)]));

  const startQuiz = async () => {
    if (isStarting.current) return;
    isStarting.current = true;
    setStartError(null);

    if (quizId) {
      setIsStartingQuiz(true);
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId }),
          signal: AbortSignal.timeout(15000),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            response.status === 401 ? 'Your session has expired. Please sign in again.'
              : response.status === 404 ? 'This quiz is no longer available.'
                : data.error ?? 'Something went wrong.',
          );
        }
        attemptId.current = data.attemptId;
      } catch (error) {
        setStartError(
          error instanceof DOMException && error.name === 'TimeoutError'
            ? 'The server is taking too long to respond. Please try again.'
            : error instanceof Error && error.message !== 'Failed to fetch'
              ? error.message
              : 'Could not reach the server. Check your connection and try again.',
        );
        setIsStartingQuiz(false);
        isStarting.current = false;
        return;
      }
      setIsStartingQuiz(false);
    }

    startedAt.current = Date.now();
    hasCompleted.current = false;
    saveChains.current = {};
    lastSaved.current = {};
    setState('active');
    setTimeLeft(totalTime ?? null);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setConfirmOpen(false);
    isStarting.current = false;
  };

  const persistAnswer = useCallback((question: DemoQuestion, answer: StudentAnswer | undefined) => {
    if (!attemptId.current || !answer || !hasAnswer(answer)) return;
    const key = JSON.stringify(answer);
    if (lastSaved.current[question.id] === key) return;

    // Display option IDs are letters; the API needs the database option IDs
    const sourceOptionIds = answer.selectedOptionIds
      .map((id) => question.options.find((option) => option.id === id)?.sourceOptionId)
      .filter((id): id is string => !!id);
    const canPersist = isTypedQuestion(question.questionType) || sourceOptionIds.length === answer.selectedOptionIds.length;
    if (!canPersist) return;

    lastSaved.current[question.id] = key;
    const id = attemptId.current;
    saveChains.current[question.id] = (saveChains.current[question.id] ?? Promise.resolve())
      .then(() => fetch(`/api/quiz/${id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          selectedOptionIds: sourceOptionIds,
          textAnswer: answer.textAnswer?.trim(),
        }),
      }))
      .then(() => undefined)
      .catch(() => undefined);
  }, []);

  const setAnswer = (answer: StudentAnswer) => {
    if (!current) return;
    setAnswers((prev) => {
      const next = { ...prev };
      if (hasAnswer(answer)) next[current.id] = answer;
      else delete next[current.id];
      return next;
    });
  };

  const selectOption = (optionId: string) => {
    if (!current) return;
    let selectedOptionIds = [optionId];
    if (isMulti) {
      const ids = currentAnswer?.selectedOptionIds ?? [];
      selectedOptionIds = ids.includes(optionId) ? ids.filter((id) => id !== optionId) : [...ids, optionId];
    }
    const answer = { selectedOptionIds };
    setAnswer(answer);
    persistAnswer(current, answer);
  };

  const goTo = (index: number) => {
    if (current) persistAnswer(current, currentAnswer);
    setCurrentIndex(index);
  };

  const openConfirm = () => {
    if (current) persistAnswer(current, currentAnswer);
    setConfirmOpen(true);
  };

  const completeAttempt = useCallback((secondsTaken: number) => {
    if (!attemptId.current || hasCompleted.current) return;
    hasCompleted.current = true;
    const id = attemptId.current;

    void Promise.all(Object.values(saveChains.current)).then(async () => {
      try {
        await fetch(`/api/quiz/${id}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalTimeTaken: secondsTaken }),
        });
      } catch {
        // The quiz UI remains usable if analytics persistence is temporarily unavailable.
      }
    });
  }, []);

  const finishQuiz = useCallback(() => {
    if (current) persistAnswer(current, answers[current.id]);
    const secondsTaken = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
    setTimeTaken(secondsTaken);
    setConfirmOpen(false);
    setState('complete');
    completeAttempt(secondsTaken);
    onComplete?.(score, answers);
  }, [answers, completeAttempt, current, onComplete, persistAnswer, score]);

  useEffect(() => {
    if (state !== 'active' || timeLeft === null) return;
    if (timeLeft <= 0) { finishQuiz(); return; }
    const timer = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, timeLeft, finishQuiz]);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmOpen]);

  // Idle state
  if (state === 'idle') {
    const subjects = [...new Set(questions.map((q) => q.subject).filter(Boolean))];
    const difficultyMix = DIFFICULTY_ORDER
      .map((level) => ({ level, count: questions.filter((q) => q.difficulty === level).length }))
      .filter(({ count }) => count > 0);
    const stats = [
      { icon: ListChecks, label: 'Questions', value: questions.length },
      { icon: Clock, label: 'Time limit', value: totalTime ? `${Math.ceil(totalTime / 60)} min` : 'Untimed' },
      { icon: Target, label: 'To pass', value: `${passingScore}%` },
    ];

    return (
      <div className={cn('card-base overflow-hidden max-w-2xl mx-auto animate-scale-in', className)}>
        {/* Hero */}
        <div className="relative px-6 pt-10 pb-8 sm:px-10 text-center text-white overflow-hidden" style={{ background: 'var(--gradient-primary)' }}>
          <div aria-hidden className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <Sparkles aria-hidden className="absolute top-6 left-8 h-5 w-5 text-white/40 animate-pulse-slow" />
          <Sparkles aria-hidden className="absolute bottom-8 right-10 h-4 w-4 text-white/30 animate-pulse-slow" />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur flex items-center justify-center mx-auto mb-5 animate-float">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">Ready when you are</p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h2>
            {subjects.length > 0 && (
              <p className="mt-2 text-sm text-white/75">{subjects.slice(0, 3).join(' · ')}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-7 sm:px-10 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className="rounded-xl border p-3 sm:p-4 text-center opacity-0 animate-fade-in"
                style={{ borderColor: 'var(--color-border)', animationDelay: `${100 + i * 80}ms` }}
              >
                <Icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: 'var(--color-accent)' }} />
                <div className="text-lg sm:text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Difficulty mix */}
          {difficultyMix.length > 0 && (
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '360ms' }}>
              <div className="flex h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-muted)' }}>
                {difficultyMix.map(({ level, count }) => (
                  <div key={level} style={{ width: `${(count / questions.length) * 100}%`, background: DIFFICULTY_COLORS[level] }} />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2.5">
                {difficultyMix.map(({ level, count }) => (
                  <span key={level} className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: DIFFICULTY_COLORS[level] }} />
                    {count} {getDifficultyLabel(level)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center opacity-0 animate-fade-in" style={{ animationDelay: '440ms' }}>
            <Button
              onClick={startQuiz}
              disabled={isStartingQuiz}
              size="lg"
              className="group text-white font-semibold px-10 h-12 text-base shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-90 disabled:hover:scale-100"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {isStartingQuiz ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Preparing your quiz…
                </>
              ) : (
                <>
                  {startError ? 'Try Again' : "Let's Go"}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            {startError ? (
              <p role="alert" className="mt-4 inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2" style={{ color: 'var(--color-danger)', background: 'var(--color-danger-light)' }}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                {startError}
              </p>
            ) : (
              <p className="mt-4 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Change answers anytime · Flag questions to revisit · Explanations after you submit
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results + answer review
  if (state === 'complete') {
    const finalScore = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const passed = finalScore >= passingScore;
    const resultColor = passed ? 'var(--color-success)' : 'var(--color-danger)';
    const minutes = Math.floor(timeTaken / 60);

    return (
      <div className={cn('max-w-3xl mx-auto space-y-5 animate-fade-in', className)}>
        <div className="card-base p-6 sm:p-8 flex flex-wrap items-center gap-8">
          <div
            className="w-36 h-36 rounded-full shrink-0 flex items-center justify-center mx-auto sm:mx-0"
            style={{ background: `conic-gradient(${resultColor} ${finalScore}%, var(--color-muted) 0)` }}
          >
            <div className="w-29 h-29 rounded-full flex flex-col items-center justify-center" style={{ background: 'var(--color-card)' }}>
              <span className="text-4xl font-bold leading-none" style={{ color: 'var(--color-foreground)' }}>{finalScore}%</span>
              <span className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{score} of {questions.length}</span>
            </div>
          </div>
          <div className="flex-1 basis-64 space-y-2">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ color: resultColor, background: passed ? 'var(--color-success-light)' : 'var(--color-danger-light)' }}
            >
              {passed ? 'Passed' : 'Not passed'}
            </span>
            <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--color-foreground)' }}>
              {passed ? 'Great work — you nailed it!' : 'Almost there — review and try again.'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Passing score is {passingScore}%. Time taken: {minutes > 0 ? `${minutes} min ` : ''}{timeTaken % 60} s.
              Review the explanations below before moving on.
            </p>
            <div className="pt-2">
              <Button
                onClick={startQuiz}
                disabled={isStartingQuiz}
                className="text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {isStartingQuiz
                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  : <RotateCcw className="h-4 w-4 mr-2" />}
                Retake Quiz
              </Button>
              {startError && (
                <p role="alert" className="mt-3 text-sm" style={{ color: 'var(--color-danger)' }}>{startError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card-base p-5 flex flex-wrap sm:flex-nowrap items-center gap-4">
          <span
            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-accent)' }}
          >
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0 basis-56">
            <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>Have a doubt or feedback?</p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              If you have any doubt or objection about a question or its explanation, or any feedback or suggestion, do write to us at{' '}
              <a href={`mailto:${FEEDBACK_EMAIL}`} className="font-medium hover:underline break-all" style={{ color: 'var(--color-accent)' }}>
                {FEEDBACK_EMAIL}
              </a>
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(`Quiz feedback: ${title}`)}`}>
              <Mail className="h-4 w-4 mr-2" />
              Write to us
            </a>
          </Button>
        </div>

        <h3 className="text-lg font-semibold pt-2" style={{ color: 'var(--color-foreground)' }}>Answer review</h3>
        <ol className="space-y-3">
          {questions.map((q, i) => {
            const answer = answers[q.id];
            const correct = isCorrectFor(q);
            const typed = isTypedQuestion(q.questionType);
            const correctIds = demoAnswerKey(q).correctOptionIds;
            const pickedOptions = q.options.filter((o) => answer?.selectedOptionIds.includes(o.id));
            const correctOptions = q.options.filter((o) => correctIds.includes(o.id));

            return (
              <li key={q.id} className="card-base p-5 flex gap-4 items-start">
                <span
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white"
                  style={{ background: correct ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  {correct
                    ? <Check className="h-4 w-4" strokeWidth={3} aria-label="Correct" />
                    : <X className="h-4 w-4" strokeWidth={3} aria-label="Incorrect" />}
                </span>
                <div className="flex-1 min-w-0 space-y-2 text-sm">
                  <div className="flex gap-1.5 font-medium" style={{ color: 'var(--color-foreground)' }}>
                    <span>{i + 1}.</span>
                    <RichContent html={q.question} className="whitespace-pre-wrap min-w-0" />
                  </div>
                  <div style={{ color: 'var(--color-muted-foreground)' }}>
                    Your answer:{' '}
                    {!hasAnswer(answer) ? (
                      <strong style={{ color: 'var(--color-danger)' }}>Not answered</strong>
                    ) : typed ? (
                      <strong style={{ color: resultColorFor(correct) }}>{answer!.textAnswer}</strong>
                    ) : (
                      <OptionList options={pickedOptions} color={resultColorFor(correct)} />
                    )}
                  </div>
                  {!correct && (
                    <div style={{ color: 'var(--color-muted-foreground)' }}>
                      Correct answer:{' '}
                      {typed
                        ? <strong style={{ color: 'var(--color-success)' }}>{q.acceptedAnswers?.join(', ')}</strong>
                        : <OptionList options={correctOptions} color="var(--color-success)" />}
                    </div>
                  )}
                  {q.explanation && (
                    <RichContent
                      html={q.explanation}
                      className="rounded-lg px-3 py-2.5 leading-relaxed"
                      style={{ background: 'var(--color-background-alt)', color: 'var(--color-foreground)' }}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  // Active quiz
  const isLast = currentIndex === questions.length - 1;
  const isFlagged = !!flagged[current.id];
  const lowTime = timeLeft !== null && timeLeft < LOW_TIME_SECONDS;
  const subtitle = [current.subject, current.topic].filter(Boolean).join(' · ');

  return (
    <div className={cn('max-w-6xl mx-auto space-y-5', className)}>
      {/* Top bar */}
      <div className="card-base px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {subtitle && <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{subtitle}</div>}
          <h2 className="font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
        </div>
        {timeLeft !== null && (
          <div
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border text-sm font-medium"
            style={lowTime
              ? { color: 'var(--color-warning)', background: 'var(--color-warning-light)', borderColor: 'var(--color-warning)' }
              : { color: 'var(--color-foreground)', background: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono tabular-nums">{formatTime(timeLeft)}</span>
            <span className="text-xs">left</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        {/* Question column */}
        <section className="flex-[999_1_520px] min-w-0 space-y-4" aria-labelledby="quiz-question">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {answeredCount} answered · {remainingCount} remaining
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--color-muted)' }}
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={answeredCount}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%`, background: 'var(--gradient-primary)' }}
              />
            </div>
          </div>

          <article key={current.id} className="card-base p-5 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', getDifficultyClass(current.difficulty))}>
                  {getDifficultyLabel(current.difficulty)}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}
                >
                  {current.points} {current.points === 1 ? 'point' : 'points'} · {QUESTION_TYPE_LABELS[questionType]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFlagged((prev) => ({ ...prev, [current.id]: !isFlagged }))}
                aria-pressed={isFlagged}
                className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border text-sm font-medium transition-colors"
                style={isFlagged
                  ? { color: 'var(--color-warning)', background: 'var(--color-warning-light)', borderColor: 'var(--color-warning)' }
                  : { color: 'var(--color-muted-foreground)', background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
              >
                <Flag className="h-4 w-4" fill={isFlagged ? 'currentColor' : 'none'} />
                {isFlagged ? 'Flagged' : 'Flag for review'}
              </button>
            </div>

            <div id="quiz-question">
              <RichContent
                html={current.question}
                className="text-lg font-medium leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--color-foreground)' }}
              />
            </div>

            {isTyped ? (
              <div className="space-y-2">
                <label htmlFor="quiz-typed-answer" className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Your answer
                </label>
                <Input
                  id="quiz-typed-answer"
                  value={currentAnswer?.textAnswer ?? ''}
                  onChange={(e) => setAnswer({ selectedOptionIds: [], textAnswer: e.target.value })}
                  onBlur={() => persistAnswer(current, currentAnswer)}
                  placeholder={questionType === 'NUMERIC' ? 'Enter a number or fraction, e.g. 3/17' : 'Type your answer'}
                  inputMode={questionType === 'NUMERIC' ? 'decimal' : 'text'}
                  autoComplete="off"
                  className="h-12 text-base"
                />
              </div>
            ) : (
              <fieldset className="space-y-2.5">
                <legend className="text-sm mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                  {isMulti ? 'Select all that apply' : 'Select one answer'}
                </legend>
                {current.options.map((option) => {
                  const selected = currentAnswer?.selectedOptionIds.includes(option.id) ?? false;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      aria-pressed={selected}
                      className={cn('question-option w-full text-left flex items-center gap-3.5 min-h-14', selected && 'selected')}
                      style={selected ? { boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent)' } : undefined}
                    >
                      <span
                        className={cn('w-8 h-8 shrink-0 flex items-center justify-center text-sm font-semibold transition-colors', isMulti ? 'rounded-md' : 'rounded-lg')}
                        style={selected
                          ? { background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }
                          : { background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
                      >
                        {option.id.toUpperCase()}
                      </span>
                      <RichContent as="span" html={option.content} className="flex-1 text-[15px]" style={{ color: 'var(--color-foreground)' }} />
                      {selected && <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} style={{ color: 'var(--color-accent)' }} />}
                    </button>
                  );
                })}
              </fieldset>
            )}
          </article>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" className="h-11" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="hidden sm:inline text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              {quizId ? 'Answers save automatically' : 'You can change answers until you submit'}
            </span>
            <Button
              className="h-11 text-white"
              style={{ background: 'var(--gradient-primary)' }}
              onClick={isLast ? openConfirm : () => goTo(currentIndex + 1)}
            >
              {isLast ? 'Review & submit' : hasAnswer(currentAnswer) ? 'Next question' : 'Skip'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </section>

        {/* Navigator */}
        <aside className="flex-[1_1_260px] min-w-0 space-y-4" aria-label="Question navigator">
          <div className="card-base p-5 space-y-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--color-foreground)' }}>Questions</h3>
              <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{answeredCount}/{questions.length}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 -m-1">
              {questions.map((q, i) => {
                const isCurrent = i === currentIndex;
                const answered = hasAnswer(answers[q.id]);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Question ${i + 1}${answered ? ', answered' : ', not answered'}${flagged[q.id] ? ', flagged' : ''}`}
                    className="relative h-10 rounded-lg text-sm font-semibold border-[1.5px] transition-colors"
                    style={isCurrent
                      ? { background: 'var(--color-accent)', borderColor: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }
                      : answered
                        ? { background: 'var(--color-primary-light)', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }
                        : { background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}
                  >
                    {i + 1}
                    {flagged[q.id] && (
                      <span
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                        style={{ background: 'var(--color-warning)', borderColor: 'var(--color-card)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2 text-xs pt-4 border-t" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}>
              <LegendItem swatch={{ background: 'var(--color-accent)' }} label="Current" />
              <LegendItem swatch={{ background: 'var(--color-primary-light)', border: '1.5px solid var(--color-accent)' }} label="Answered" />
              <LegendItem swatch={{ border: '1.5px solid var(--color-border)' }} label="Not answered" />
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 m-0.5 rounded-full" style={{ background: 'var(--color-warning)' }} />
                Flagged for review ({flagCount})
              </div>
            </div>
            <Button
              className="w-full h-11 text-white font-semibold"
              style={{ background: 'var(--gradient-primary)' }}
              onClick={openConfirm}
            >
              Submit quiz
            </Button>
          </div>

          <div className="card-base px-5 py-4 space-y-2.5 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            <div className="flex justify-between">
              <span>Passing score</span>
              <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{passingScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Time limit</span>
              <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                {totalTime ? `${Math.ceil(totalTime / 60)} min` : 'Untimed'}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit confirmation */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh] bg-black/45 animate-fade-in"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-confirm-title"
            className="w-full max-w-md rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl animate-scale-in"
            style={{ background: 'var(--color-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="quiz-confirm-title" className="text-xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Submit your answers?
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              You can&apos;t change your answers after submitting.
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <SummaryTile value={answeredCount} label="Answered" />
              <SummaryTile value={remainingCount} label="Unanswered" warn={remainingCount > 0} />
              <SummaryTile value={flagCount} label="Flagged" warn={flagCount > 0} />
            </div>
            <div className="flex flex-wrap justify-end gap-2.5 pt-1">
              <Button variant="outline" className="h-11" onClick={() => setConfirmOpen(false)} autoFocus>
                Keep reviewing
              </Button>
              <Button className="h-11 text-white font-semibold" style={{ background: 'var(--gradient-primary)' }} onClick={finishQuiz}>
                Submit quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const resultColorFor = (correct: boolean) => (correct ? 'var(--color-success)' : 'var(--color-danger)');

function OptionList({ options, color }: { options: DemoQuestion['options']; color: string }) {
  return (
    <span className="inline-flex flex-wrap gap-x-3 gap-y-1 align-top">
      {options.map((option) => (
        <strong key={option.id} className="inline-flex gap-1" style={{ color }}>
          {option.id.toUpperCase()}.
          <RichContent as="span" html={option.content} />
        </strong>
      ))}
    </span>
  );
}

function LegendItem({ swatch, label }: { swatch: CSSProperties; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-3.5 h-3.5 rounded box-border" style={swatch} />
      {label}
    </div>
  );
}

function SummaryTile({ value, label, warn = false }: { value: number; label: string; warn?: boolean }) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col"
      style={warn
        ? { background: 'var(--color-warning-light)', color: 'var(--color-warning)' }
        : { background: 'var(--color-background-alt)', color: 'var(--color-muted-foreground)' }}
    >
      <span className="text-2xl font-semibold" style={warn ? undefined : { color: 'var(--color-foreground)' }}>{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
