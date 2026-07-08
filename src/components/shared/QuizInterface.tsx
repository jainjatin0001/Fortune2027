'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, ChevronRight, ChevronLeft, Trophy, RotateCcw } from 'lucide-react';
import { cn, getDifficultyLabel, getDifficultyClass } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DemoQuestion } from '@/types';
import { sanitizeHtml } from '@/components/admin/RichEditor';

interface QuizInterfaceProps {
  questions: DemoQuestion[];
  title?: string;
  timeLimit?: number; // seconds; defaults to 90s per question
  passingScore?: number; // percentage, default 70
  onComplete?: (score: number, answers: Record<string, string>) => void;
}

type QuizState = 'idle' | 'active' | 'review' | 'complete';

export function QuizInterface({ questions, title = 'Practice Quiz', timeLimit, passingScore = 70, onComplete }: QuizInterfaceProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalTime] = useState(timeLimit ?? questions.length * 90);

  const current = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === current?.correctAnswerId;
  const score = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === id)?.correctAnswerId === ans
  ).length;

  const startQuiz = () => {
    setState('active');
    setTimeLeft(totalTime);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const selectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  };

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(answers[questions[currentIndex + 1]?.id] ?? null);
      setShowExplanation(false);
    } else {
      setState('complete');
      onComplete?.(score, answers);
    }
  }, [currentIndex, questions, answers, score, onComplete]);

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedOption(answers[questions[currentIndex - 1]?.id] ?? null);
      setShowExplanation(false);
    }
  };

  useEffect(() => {
    if (state !== 'active' || timeLeft === null) return;
    if (timeLeft <= 0) { setState('complete'); return; }
    const timer = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, timeLeft]);

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
      <div className="card-base p-8 text-center max-w-lg mx-auto">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-heading-3 mb-2" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
        <p className="text-body mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          {questions.length} questions · ~{Math.ceil(totalTime / 60)} minutes
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
      <div className="card-base p-8 text-center max-w-lg mx-auto">
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
    <div className="card-base overflow-hidden max-w-2xl mx-auto">
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
        <div
          className="text-base font-medium mb-6 leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--color-foreground)' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.question ?? '') }}
        />

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((option) => {
            let optionState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
            if (isAnswered) {
              if (option.id === current.correctAnswerId) optionState = 'correct';
              else if (option.id === selectedOption && !isCorrect) optionState = 'incorrect';
            } else if (option.id === selectedOption) {
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
                <span className="text-sm" style={{ color: 'var(--color-foreground)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.content ?? '') }} />
                {optionState === 'correct' && <CheckCircle className="h-4 w-4 ml-auto shrink-0 text-[var(--color-success)]" />}
                {optionState === 'incorrect' && <XCircle className="h-4 w-4 ml-auto shrink-0 text-[var(--color-danger)]" />}
              </button>
            );
          })}
        </div>

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
                <div
                  className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: 'var(--color-info-light)',
                    color: 'var(--color-foreground)',
                    borderLeft: '3px solid var(--color-info)',
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.explanation ?? '') }}
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
                  ? (answers[questions[i].id] === questions[i].correctAnswerId ? 'var(--color-success)' : 'var(--color-danger)')
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
