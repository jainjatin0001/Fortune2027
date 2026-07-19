'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Trophy,
  RotateCcw,
  Flag,
  AlertTriangle,
  XCircle,
  Calculator,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { sanitizeHtml } from '@/components/admin/RichEditor';
import type { DemoQuestion } from '@/types';
import { DesmosCalculator } from './DesmosCalculator';

export interface ExamSection {
  id?: string;
  name: string;
  shortName: string;
  questions: DemoQuestion[];
  timeLimit: number; // seconds
  hasCalculator?: boolean;
}

// Emitted by onAttemptComplete — carries per-section and per-question data
export interface ExamSectionResult {
  sectionId?: string;
  sectionName: string;
  timeTaken: number;
  questions: {
    questionId: string;
    selectedOptionIds: string[];
    isSkipped: boolean;
    timeTaken: number;
  }[];
}

export interface ExamAttemptResult {
  totalTimeTaken: number;
  sections: ExamSectionResult[];
}

interface ExamInterfaceProps {
  examName: string;
  examCode: string;
  subtitle?: string;
  accentColor?: string;
  sections: ExamSection[];
  /** Called when the exam completes with full attempt data for persistence */
  onAttemptComplete?: (result: ExamAttemptResult) => void;
}

type ExamState = 'intro' | 'active' | 'complete';

export function ExamInterface({
  examName,
  examCode,
  subtitle,
  accentColor = '#4f46e5',
  sections,
  onAttemptComplete,
}: ExamInterfaceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ExamState>('intro');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const desmosApiKey = process.env.NEXT_PUBLIC_DESMOS_API_KEY;

  // Time tracking — refs only (don't affect render)
  const questionStartRef = useRef<number>(0);
  const sectionStartRef = useRef<number>(0);
  const examStartRef = useRef<number>(0);
  const questionTimesRef = useRef<Record<string, number>>({});
  const sectionTimesRef = useRef<Record<number, number>>({});

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];
  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const totalTime = sections.reduce((acc, s) => acc + s.timeLimit, 0);
  const globalQNum =
    sections.slice(0, sectionIdx).reduce((acc, s) => acc + s.questions.length, 0) + questionIdx + 1;

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const advanceSection = useCallback(() => {
    // Flush the time for the current question into the ref
    if (currentQuestion) {
      const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
      questionTimesRef.current[currentQuestion.id] =
        (questionTimesRef.current[currentQuestion.id] ?? 0) + elapsed;
    }
    // Record total time for the section being submitted
    const secTime = Math.round((Date.now() - sectionStartRef.current) / 1000);
    sectionTimesRef.current[sectionIdx] = secTime;

    if (sectionIdx + 1 < sections.length) {
      const next = sectionIdx + 1;
      setSectionIdx(next);
      setQuestionIdx(0);
      setTimeLeft(sections[next].timeLimit);
      sectionStartRef.current = Date.now();
      questionStartRef.current = Date.now();
    } else {
      // Final section done — build result and notify parent
      const totalTimeTaken = Math.round((Date.now() - examStartRef.current) / 1000);
      if (onAttemptComplete) {
        const result: ExamAttemptResult = {
          totalTimeTaken,
          sections: sections.map((section, si) => ({
            sectionId: section.id,
            sectionName: section.name,
            timeTaken: sectionTimesRef.current[si] ?? 0,
            questions: section.questions.map(q => ({
              questionId: q.id,
              selectedOptionIds: answers[q.id] ? [answers[q.id]] : [],
              isSkipped: !answers[q.id],
              timeTaken: questionTimesRef.current[q.id] ?? 0,
            })),
          })),
        };
        onAttemptComplete(result);
      }
      setState('complete');
    }
    setShowConfirm(false);
  }, [sectionIdx, sections, currentQuestion, answers, onAttemptComplete]);

  useEffect(() => {
    if (state !== 'active') return;
    if (timeLeft <= 0) {
      advanceSection();
      return;
    }
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [state, timeLeft, advanceSection]);

  useEffect(() => {
    const handler = () => setIsBrowserFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleBrowserFullscreen = useCallback(() => {
    if (!overlayRef.current) return;
    if (!document.fullscreenElement) {
      overlayRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }, []);

  const flushQuestionTime = () => {
    if (!currentQuestion) return;
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    questionTimesRef.current[currentQuestion.id] =
      (questionTimesRef.current[currentQuestion.id] ?? 0) + elapsed;
    questionStartRef.current = Date.now();
  };

  const startExam = () => {
    const now = Date.now();
    examStartRef.current = now;
    sectionStartRef.current = now;
    questionStartRef.current = now;
    questionTimesRef.current = {};
    sectionTimesRef.current = {};
    setState('active');
    setSectionIdx(0);
    setQuestionIdx(0);
    setTimeLeft(sections[0].timeLimit);
    setAnswers({});
    setFlagged(new Set());
  };

  const resetExam = () => {
    questionTimesRef.current = {};
    sectionTimesRef.current = {};
    setState('intro');
    setSectionIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setFlagged(new Set());
  };

  const selectAnswer = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(currentQuestion.id) ? next.delete(currentQuestion.id) : next.add(currentQuestion.id);
      return next;
    });
  };

  const goNext = () => {
    if (questionIdx + 1 < currentSection.questions.length) {
      flushQuestionTime();
      setQuestionIdx((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (questionIdx > 0) {
      flushQuestionTime();
      setQuestionIdx((i) => i - 1);
    }
  };

  const isLastQuestion = questionIdx === currentSection?.questions.length - 1;
  const isLastSection = sectionIdx === sections.length - 1;
  const isTimeCritical = timeLeft > 0 && timeLeft < 60;
  const answeredInSection = currentSection?.questions.filter((q) => answers[q.id]).length ?? 0;
  const unansweredInSection = (currentSection?.questions.length ?? 0) - answeredInSection;

  const sectionResults = sections.map((section) => ({
    name: section.name,
    correct: section.questions.filter((q) => answers[q.id] === q.correctAnswerId).length,
    total: section.questions.length,
  }));
  const totalCorrect = sectionResults.reduce((acc, r) => acc + r.correct, 0);
  const finalPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (state === 'intro') {
    return (
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
      >
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black mb-6 shrink-0 text-white"
            style={{ background: accentColor }}
          >
            {examCode}
          </div>
          <h2 className="text-3xl font-black text-center mb-1" style={{ color: '#0f172a' }}>
            {examName}
          </h2>
          {subtitle && (
            <p className="text-sm text-center mb-6" style={{ color: '#64748b' }}>
              {subtitle}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
            {[
              { label: 'Questions', value: String(totalQuestions) },
              { label: 'Sections', value: String(sections.length) },
              { label: 'Total Time', value: formatTime(totalTime) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="text-center p-3 rounded-xl border"
                style={{ background: 'white', borderColor: '#e2e8f0' }}
              >
                <div className="text-xl font-bold" style={{ color: accentColor }}>
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-2 mb-6">
            {sections.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ background: 'white', borderColor: '#e2e8f0' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: accentColor + '18', color: accentColor }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      {s.name}
                    </div>
                    <div className="text-xs" style={{ color: '#94a3b8' }}>
                      {s.questions.length} questions
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#94a3b8' }}>
                  <Clock className="h-3 w-3" />
                  {formatTime(s.timeLimit)}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-2">
            <p className="text-xs text-center mb-4" style={{ color: '#94a3b8' }}>
              Each section is timed separately. Once you move to the next section you cannot go back.
            </p>
            <Button
              onClick={startExam}
              size="lg"
              className="w-full font-bold text-white"
              style={{ background: accentColor, border: 'none' }}
            >
              Begin Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETE ─────────────────────────────────────────────────────────────
  if (state === 'complete') {
    const passed = finalPercent >= 70;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: '#f8fafc' }}
      >
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: passed ? '#dcfce7' : '#fee2e2' }}
            >
              {passed ? (
                <Trophy className="h-12 w-12" style={{ color: '#16a34a' }} />
              ) : (
                <XCircle className="h-12 w-12" style={{ color: '#dc2626' }} />
              )}
            </div>
            <h2 className="text-4xl font-black mb-2" style={{ color: '#0f172a' }}>
              {passed ? 'Great Work!' : 'Keep Practicing!'}
            </h2>
            <p style={{ color: '#64748b' }}>
              {totalCorrect} of {totalQuestions} correct
            </p>
            <div
              className="text-6xl font-black mt-4"
              style={{ color: passed ? '#16a34a' : '#dc2626' }}
            >
              {finalPercent}%
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {sectionResults.map((r) => {
              const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
              return (
                <div
                  key={r.name}
                  className="p-4 rounded-xl border"
                  style={{ background: 'white', borderColor: '#e2e8f0' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                      {r.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: pct >= 70 ? '#16a34a' : '#dc2626' }}
                    >
                      {r.correct}/{r.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#f1f5f9' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 70 ? '#16a34a' : '#dc2626',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={resetExam}
            size="lg"
            className="w-full font-bold text-white"
            style={{ background: accentColor, border: 'none' }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Exam
          </Button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE EXAM ─────────────────────────────────────────────────────────
  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: '#f8fafc' }}
      >
        {/* Confirm submit modal */}
        {showConfirm && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: 'rgba(15,23,42,0.35)' }}
          >
            <div
              className="p-8 rounded-2xl max-w-sm w-full mx-4 text-center shadow-xl border"
              style={{ background: 'white', borderColor: '#e2e8f0' }}
            >
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" style={{ color: '#f59e0b' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>
                Submit {isLastSection ? 'Exam' : 'Section'}?
              </h3>
              {unansweredInSection > 0 ? (
                <p className="text-sm mb-6" style={{ color: '#b45309' }}>
                  {unansweredInSection} question{unansweredInSection > 1 ? 's' : ''} unanswered.
                  You cannot return to this section.
                </p>
              ) : (
                <p className="text-sm mb-6" style={{ color: '#64748b' }}>
                  All questions answered. You cannot return once submitted.
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                  style={{ borderColor: '#e2e8f0', color: '#64748b' }}
                >
                  Keep Working
                </Button>
                <Button
                  onClick={advanceSection}
                  className="flex-1 font-semibold text-white"
                  style={{ background: accentColor, border: 'none' }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 border-b"
          style={{ background: 'white', borderColor: '#e2e8f0' }}
        >
          <div className="flex items-center gap-3">
            <span className="font-black text-base" style={{ color: accentColor }}>
              {examCode}
            </span>
            <span className="text-xs" style={{ color: '#e2e8f0' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#64748b' }}>
              Section {sectionIdx + 1} of {sections.length}: {currentSection.name}
            </span>
          </div>

          {/* Timer */}
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-base tabular-nums',
              isTimeCritical && 'animate-pulse'
            )}
            style={{
              background: isTimeCritical ? '#fef2f2' : '#f1f5f9',
              color: isTimeCritical ? '#dc2626' : '#0f172a',
            }}
          >
            <Clock className="h-4 w-4 shrink-0" />
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#94a3b8' }}>
              Q {globalQNum} / {totalQuestions}
            </span>
            {currentSection?.hasCalculator && desmosApiKey && (
              <button
                onClick={() => setShowCalculator((v) => !v)}
                className="p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                style={{
                  background: showCalculator ? accentColor : '#f1f5f9',
                  color: showCalculator ? 'white' : '#64748b',
                }}
                title="Calculator"
              >
                <Calculator className="h-4 w-4" />
                Calc
              </button>
            )}
            <button
              onClick={toggleBrowserFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              style={{ color: '#94a3b8' }}
              title={isBrowserFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isBrowserFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — question palette */}
          <div
            className="w-48 shrink-0 border-r p-4 overflow-y-auto"
            style={{ background: '#fafafa', borderColor: '#e2e8f0' }}
          >
            {sections.map((section, si) => (
              <div key={section.name} className="mb-5">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#94a3b8' }}
                >
                  {section.shortName}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {section.questions.map((q, qi) => {
                    const isActive = si === sectionIdx && qi === questionIdx;
                    const isAnsweredQ = !!answers[q.id];
                    const isFlaggedQ = flagged.has(q.id);
                    const isPastSection = si < sectionIdx;
                    const globalNum =
                      sections.slice(0, si).reduce((acc, s) => acc + s.questions.length, 0) +
                      qi +
                      1;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          if (isPastSection) return;
                          flushQuestionTime();
                          setSectionIdx(si);
                          setQuestionIdx(qi);
                        }}
                        disabled={isPastSection}
                        className="w-9 h-9 rounded-lg text-xs font-bold transition-colors"
                        style={{
                          background: isActive
                            ? accentColor
                            : isFlaggedQ
                            ? '#fef9c3'
                            : isAnsweredQ
                            ? accentColor + '18'
                            : '#f1f5f9',
                          color: isActive
                            ? 'white'
                            : isFlaggedQ
                            ? '#b45309'
                            : isAnsweredQ
                            ? accentColor
                            : '#64748b',
                          outline: isActive ? `2px solid ${accentColor}` : undefined,
                          opacity: isPastSection ? 0.4 : 1,
                          cursor: isPastSection ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {globalNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-4 space-y-1.5 text-xs" style={{ color: '#94a3b8' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: accentColor + '18' }} />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: '#fef9c3', border: '1px solid #fde68a' }} />
                Flagged
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: '#f1f5f9' }} />
                Unanswered
              </div>
            </div>
          </div>

          {/* Main question area */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'white' }}>
            {/* Question meta */}
            <div className="px-8 pt-5 pb-2 shrink-0 border-b" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: accentColor + '18', color: accentColor }}
                >
                  {currentQuestion?.subject}
                </span>
                <span className="text-xs" style={{ color: '#94a3b8' }}>
                  {currentQuestion?.topic}
                </span>
                <span className="text-xs ml-auto font-medium" style={{ color: '#94a3b8' }}>
                  {currentQuestion?.difficulty}
                </span>
              </div>
            </div>

            {/* Scrollable question + options */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div
                className="text-base leading-relaxed whitespace-pre-wrap mb-8"
                style={{ color: '#0f172a' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentQuestion?.question ?? '') }}
              />

              <div className="space-y-3 max-w-2xl pb-4">
                {currentQuestion?.options.map((option) => {
                  const selected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectAnswer(option.id)}
                      className="w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all hover:border-slate-300"
                      style={{
                        background: selected ? accentColor + '0e' : 'white',
                        borderColor: selected ? accentColor : '#e2e8f0',
                      }}
                    >
                      <span
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                        style={{
                          borderColor: selected ? accentColor : '#cbd5e1',
                          color: selected ? accentColor : '#64748b',
                          background: selected ? accentColor + '0e' : '#f8fafc',
                        }}
                      >
                        {option.id.toUpperCase()}
                      </span>
                      <span
                        className="text-sm leading-relaxed pt-1"
                        style={{ color: '#0f172a' }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.content ?? '') }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer nav */}
            <div
              className="px-8 py-4 border-t flex items-center justify-between shrink-0"
              style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
            >
              <Button
                variant="ghost"
                onClick={goPrev}
                disabled={questionIdx === 0}
                style={{ color: '#64748b' }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <button
                onClick={toggleFlag}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: flagged.has(currentQuestion?.id ?? '') ? '#fef9c3' : '#f1f5f9',
                  color: flagged.has(currentQuestion?.id ?? '') ? '#b45309' : '#64748b',
                }}
              >
                <Flag className="h-4 w-4" />
                {flagged.has(currentQuestion?.id ?? '') ? 'Flagged' : 'Flag for Review'}
              </button>

              {isLastQuestion ? (
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="font-semibold text-white"
                  style={{ background: accentColor, border: 'none' }}
                >
                  {isLastSection ? 'Submit Exam' : 'Submit Section'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={goNext}
                  className="font-medium"
                  style={{ background: '#f1f5f9', color: '#0f172a', border: 'none' }}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {showCalculator && currentSection?.hasCalculator && desmosApiKey && (
          <DesmosCalculator apiKey={desmosApiKey} onClose={() => setShowCalculator(false)} />
        )}
      </div>
    </>
  );
}
