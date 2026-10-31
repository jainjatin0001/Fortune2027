'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, Clock, ChevronRight, ChevronLeft, Trophy, RotateCcw } from 'lucide-react';
import { cn, getDifficultyLabel, getDifficultyClass } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import type { DemoQuestion } from '@/types';
import { RichContent, usePreloadImages } from './RichContent';
import { demoAnswerKey, gradeAnswer, isTypedQuestion, type StudentAnswer } from '@/lib/grading';

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

type QuizState = 'idle' | 'active' | 'review' | 'complete';

export function QuizInterface({ questions, title = 'Practice Quiz', timeLimit, passingScore = 70, onComplete, className, quizId }: QuizInterfaceProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  // Unsubmitted input for the current question (multi-select picks, typed answer)
  const [draftOptionIds, setDraftOptionIds] = useState<string[]>([]);
  const [draftText, setDraftText] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalTime] = useState(timeLimit);
  const attemptId = useRef<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const pendingAnswerRequests = useRef<Promise<void>[]>([]);
  const hasCompleted = useRef(false);
  const isStarting = useRef(false);

  const current = questions[currentIndex];
  const questionType = current?.questionType ?? 'SINGLE_CORRECT';
  const isTyped = isTypedQuestion(questionType);
  const isMulti = questionType === 'MULTIPLE_CORRECT';
  const submitted = current ? answers[current.id] : undefined;
  const isAnswered = !!submitted;
  const correctOptionIds = current ? demoAnswerKey(current).correctOptionIds : [];
  const isCorrectFor = (q: DemoQuestion) => gradeAnswer(demoAnswerKey(q), answers[q.id]) === true;
  const isCorrect = current ? isCorrectFor(current) : false;
  const score = questions.filter(isCorrectFor).length;

  usePreloadImages(questions.flatMap((q) => [q.question, q.explanation, ...q.options.map((o) => o.content)]));

  const resetDraft = () => {
    setDraftOptionIds([]);
    setDraftText('');
  };

  const startQuiz = async () => {
    if (isStarting.current) return;
    isStarting.current = true;

    if (quizId) {
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId }),
        });
        const data = await response.json();
        if (!response.ok) {
          isStarting.current = false;
          return;
        }
        attemptId.current = data.attemptId;
      } catch {
        isStarting.current = false;
        return;
      }
    }

    startedAt.current = Date.now();
    hasCompleted.current = false;
    pendingAnswerRequests.current = [];
    setState('active');
    setTimeLeft(totalTime ?? null);
    setCurrentIndex(0);
    setAnswers({});
    resetDraft();
    setShowExplanation(false);
    isStarting.current = false;
  };

  const submitAnswer = (answer: StudentAnswer) => {
    if (!current || isAnswered) return;
    if (answer.selectedOptionIds.length === 0 && !answer.textAnswer) return;
    setAnswers((prev) => ({ ...prev, [current.id]: answer }));

    // Display option IDs are letters; the API needs the database option IDs
    const sourceOptionIds = answer.selectedOptionIds
      .map((id) => current.options.find((option) => option.id === id)?.sourceOptionId)
      .filter((id): id is string => !!id);
    const canPersist = isTyped || sourceOptionIds.length === answer.selectedOptionIds.length;
    if (attemptId.current && canPersist) {
      const request = fetch(`/api/quiz/${attemptId.current}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: current.id,
          selectedOptionIds: sourceOptionIds,
          textAnswer: answer.textAnswer,
        }),
      }).then(() => undefined).catch(() => undefined);
      pendingAnswerRequests.current.push(request);
    }
  };

  const selectOption = (optionId: string) => {
    if (isAnswered) return;
    if (isMulti) {
      setDraftOptionIds((ids) => ids.includes(optionId) ? ids.filter((id) => id !== optionId) : [...ids, optionId]);
      return;
    }
    submitAnswer({ selectedOptionIds: [optionId] });
  };

  const checkDraft = () => {
    if (isTyped) submitAnswer({ selectedOptionIds: [], textAnswer: draftText.trim() });
    else submitAnswer({ selectedOptionIds: draftOptionIds });
  };

  const completeAttempt = useCallback(() => {
    if (!attemptId.current || hasCompleted.current) return;
    hasCompleted.current = true;

    void Promise.all(pendingAnswerRequests.current).then(async () => {
      try {
        await fetch(`/api/quiz/${attemptId.current}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalTimeTaken: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0,
          }),
        });
      } catch {
        // The quiz UI remains usable if analytics persistence is temporarily unavailable.
      }
    });
  }, []);

  const finishQuiz = useCallback(() => {
    setState('complete');
    completeAttempt();
    onComplete?.(score, answers);
  }, [answers, completeAttempt, onComplete, score]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      resetDraft();
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  }, [currentIndex, questions, finishQuiz]);

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetDraft();
      setShowExplanation(false);
    }
  };

  useEffect(() => {
    if (state !== 'active' || timeLeft === null) return;
    if (timeLeft <= 0) { finishQuiz(); return; }
    const timer = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, timeLeft, finishQuiz]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = ((currentIndex) / questions.length) * 100;
  const finalScore = Math.round((score / questions.length) * 100);

  // Idle state
  if (state === 'idle') {
    return (
      <div className={cn('card-base p-8 text-center max-w-lg mx-auto', className)}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
        <p className="text-body mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          {questions.length} questions{totalTime ? ` · ~${Math.ceil(totalTime / 60)} minutes` : ''}
        </p>
        <Button
          onClick={startQuiz}
          className="text-white font-semibold px-8"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  // Complete state
  if (state === 'complete') {
    const passed = finalScore >= passingScore;
    return (
      <div className={cn('card-base p-8 text-center max-w-lg mx-auto', className)}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: passed ? 'var(--color-success-light)' : 'var(--color-danger-light)',
          }}
        >
          {passed ? (
            <Trophy className="h-10 w-10" style={{ color: 'var(--color-success)' }} />
          ) : (
            <XCircle className="h-10 w-10" style={{ color: 'var(--color-danger)' }} />
          )}
        </div>
        <h2 className="text-heading-2 mb-1" style={{ color: 'var(--color-foreground)' }}>
          {passed ? 'Great Work!' : 'Keep Practicing'}
        </h2>
        <p className="text-body mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          You scored {score} out of {questions.length} questions correctly.
        </p>
        <div
          className="text-5xl font-black mb-8"
          style={{ color: passed ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          {finalScore}%
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setState('review')}>
            Review Answers
          </Button>
          <Button
            onClick={startQuiz}
            className="text-white"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Active quiz
  return (
    <div className={cn('card-base overflow-hidden', className ?? 'max-w-2xl mx-auto')}>
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-background-alt)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getDifficultyClass(current.difficulty))}
          >
            {getDifficultyLabel(current.difficulty)}
          </span>
        </div>
        {timeLeft !== null && (
          <div
            className={cn(
              'flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full',
              timeLeft < 60
                ? 'text-[var(--color-danger)] bg-[var(--color-danger-light)]'
                : 'text-[var(--color-foreground)] bg-[var(--color-muted)]'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="px-6 pt-4">
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Question */}
      <div className="px-6 py-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
            {current.subject} · {current.topic}
          </span>
        </div>
        <RichContent
          html={current.question}
          className="text-base font-medium mb-6 leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--color-foreground)' }}
        />

        {/* Typed answer (NUMERIC / TEXT) */}
        {isTyped && (
          <div className="space-y-3">
            {isAnswered ? (
              <div
                className="flex items-center gap-2 p-3 rounded-xl border text-sm"
                style={{
                  borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                  background: isCorrect ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: 'var(--color-foreground)',
                }}
              >
                {isCorrect
                  ? <CheckCircle className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                  : <XCircle className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />}
                <span>
                  Your answer: <strong>{submitted?.textAnswer}</strong>
                  {!isCorrect && (current.acceptedAnswers?.length ?? 0) > 0 && (
                    <> · Correct answer: <strong>{current.acceptedAnswers!.join(', ')}</strong></>
                  )}
                </span>
              </div>
            ) : (
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); checkDraft(); }}
              >
                <Input
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder={questionType === 'NUMERIC' ? 'Enter a number or fraction, e.g. 3/17' : 'Type your answer'}
                  inputMode={questionType === 'NUMERIC' ? 'decimal' : 'text'}
                  autoComplete="off"
                  aria-label="Your answer"
                />
                <Button type="submit" disabled={!draftText.trim()}>Check</Button>
              </form>
            )}
          </div>
        )}

        {/* Options */}
        {!isTyped && (
        <div className="space-y-3">
          {isMulti && !isAnswered && (
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Select all that apply.</p>
          )}
          {current.options.map((option) => {
            const selectedIds = submitted?.selectedOptionIds ?? draftOptionIds;
            let optionState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
            if (isAnswered) {
              if (correctOptionIds.includes(option.id)) optionState = 'correct';
              else if (selectedIds.includes(option.id)) optionState = 'incorrect';
            } else if (selectedIds.includes(option.id)) {
              optionState = 'selected';
            }

            return (
              <button
                key={option.id}
                onClick={() => selectOption(option.id)}
                disabled={isAnswered}
                className={cn(
                  'question-option w-full text-left flex items-center gap-3',
                  optionState === 'selected' && 'selected',
                  optionState === 'correct' && 'correct',
                  optionState === 'incorrect' && 'incorrect',
                  isAnswered && optionState === 'default' && 'opacity-60 cursor-default'
                )}
              >
                <span
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                  style={{
                    borderColor: optionState === 'correct' ? 'var(--color-success)' :
                      optionState === 'incorrect' ? 'var(--color-danger)' :
                      optionState === 'selected' ? 'var(--color-accent)' :
                      'var(--color-border)',
                    color: optionState !== 'default' ? 'inherit' : 'var(--color-muted-foreground)',
                  }}
                >
                  {option.id.toUpperCase()}
                </span>
                <RichContent as="span" html={option.content} className="text-sm" style={{ color: 'var(--color-foreground)' }} />
                {optionState === 'correct' && <CheckCircle className="h-4 w-4 ml-auto shrink-0 text-[var(--color-success)]" />}
                {optionState === 'incorrect' && <XCircle className="h-4 w-4 ml-auto shrink-0 text-[var(--color-danger)]" />}
              </button>
            );
          })}
          {isMulti && !isAnswered && (
            <Button size="sm" onClick={checkDraft} disabled={draftOptionIds.length === 0}>
              Check answer
            </Button>
          )}
        </div>
        )}

        {/* Explanation */}
        {isAnswered && (
          <div className="mt-4">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            {showExplanation && (
                <RichContent
                  html={current.explanation}
                  className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: 'var(--color-info-light)',
                    color: 'var(--color-foreground)',
                    borderLeft: '3px solid var(--color-info)',
                  }}
                />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-background-alt)' }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <span
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
              )}
              style={{
                background: i === currentIndex
                  ? 'var(--color-accent)'
                  : answers[questions[i].id]
                  ? (isCorrectFor(questions[i]) ? 'var(--color-success)' : 'var(--color-danger)')
                  : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <Button
          size="sm"
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="text-white"
          style={{ background: isAnswered ? 'var(--gradient-primary)' : undefined }}
        >
          {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
