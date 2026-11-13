'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Trophy,
  RotateCcw,
  AlertTriangle,
  XCircle,
  Calculator,
  Bookmark,
  FileText,
  MapPin,
  Coffee,
  X,
  CheckCircle2,
  ListChecks,
  Flag,
  EyeOff,
  Eye,
  Rows3,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DemoQuestion } from '@/types';
import { RichContent, usePreloadImages } from './RichContent';
import { demoAnswerKey, gradeAnswer, isAnswered, isTypedQuestion, type StudentAnswer } from '@/lib/grading';
import { DesmosCalculator } from './DesmosCalculator';

export interface ExamSection {
  id?: string;
  name: string;
  shortName: string;
  questions: DemoQuestion[];
  timeLimit: number; // seconds
  hasCalculator?: boolean;
  /** Directions shown when the section opens (rich HTML) */
  instructions?: string | null;
  /** Seconds of optional break offered after this section; 0 / undefined = none */
  breakAfter?: number;
}

// Emitted by onAttemptComplete — carries per-section and per-question data
export interface ExamSectionResult {
  sectionId?: string;
  sectionName: string;
  timeTaken: number;
  questions: {
    questionId: string;
    selectedOptionIds: string[];
    textAnswer?: string;
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
  /** Test-level instructions shown on the overview screen (rich HTML) */
  instructions?: string | null;
  /** Called when the exam completes with full attempt data for persistence */
  onAttemptComplete?: (result: ExamAttemptResult) => void;
}

type ExamState = 'intro' | 'active' | 'between' | 'complete';
type View = 'question' | 'review';
type PaneFocus = 'both' | 'passage' | 'question';

// Test-day palette: the real digital exams are plain, high-contrast and light.
const INK = '#111827';
const MUTED = '#6b7280';
const LINE = '#d1d5db';
const SOFT = '#f3f4f6';
const NAVY = '#1e293b';
// ACT-style chrome: dark title/navigation bars around a plain test page
const ACT_BAR = '#1f3b5c';
const ACT_TOOLBAR = '#e9edf2';
const TIMER_FORCE_SHOW = 300; // the timer can't be hidden in the last 5 minutes

const formatTime = (secs: number) => {
  const safe = Math.max(0, secs);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60).toString().padStart(2, '0');
  const s = (safe % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const formatDuration = (secs: number) => {
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

const REFERENCE_FORMULAS: { title: string; lines: string[] }[] = [
  { title: 'Circle', lines: ['A = πr²', 'C = 2πr'] },
  { title: 'Rectangle', lines: ['A = ℓw'] },
  { title: 'Triangle', lines: ['A = ½bh'] },
  { title: 'Pythagorean theorem', lines: ['c² = a² + b²'] },
  { title: 'Special right triangles', lines: ['30°-60°-90°: x, x√3, 2x', '45°-45°-90°: s, s, s√2'] },
  { title: 'Rectangular solid', lines: ['V = ℓwh'] },
  { title: 'Cylinder', lines: ['V = πr²h'] },
  { title: 'Sphere', lines: ['V = (4/3)πr³'] },
  { title: 'Cone', lines: ['V = (1/3)πr²h'] },
  { title: 'Pyramid', lines: ['V = (1/3)ℓwh'] },
];

const REFERENCE_FACTS = [
  'The number of degrees of arc in a circle is 360.',
  'The number of radians of arc in a circle is 2π.',
  'The sum of the measures in degrees of the angles of a triangle is 180.',
];

export function ExamInterface({
  examName,
  examCode,
  subtitle,
  accentColor = '#4f46e5',
  sections,
  instructions,
  onAttemptComplete,
}: ExamInterfaceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ExamState>('intro');
  const [view, setView] = useState<View>('question');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [eliminated, setEliminated] = useState<Record<string, string[]>>({});
  const [eliminatorOn, setEliminatorOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breakLeft, setBreakLeft] = useState(0);
  const [timerHidden, setTimerHidden] = useState(false);
  const [showFiveMinute, setShowFiveMinute] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [paneFocus, setPaneFocus] = useState<PaneFocus>('both');
  // ACT tools: answer masking hides choices until revealed; the line reader dims all but a reading band
  const [maskingOn, setMaskingOn] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, string[]>>({});
  const [lineReaderOn, setLineReaderOn] = useState(false);
  const [lineY, setLineY] = useState<number | null>(null);
  const desmosApiKey = process.env.NEXT_PUBLIC_DESMOS_API_KEY;

  // Time tracking — refs only (don't affect render)
  const questionStartRef = useRef<number>(0);
  const sectionStartRef = useRef<number>(0);
  const questionTimesRef = useRef<Record<string, number>>({});
  const sectionTimesRef = useRef<Record<number, number>>({});

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];
  const sectionQuestionCount = currentSection?.questions.length ?? 0;
  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const totalTime = sections.reduce((acc, s) => acc + s.timeLimit, 0);
  const hasCalculatorTool = !!currentSection?.hasCalculator && !!desmosApiKey;
  const hasReferenceTool = !!currentSection?.hasCalculator && examCode === 'SAT';
  const isACT = examCode === 'ACT';
  // ACT letters alternate by question: odd numbers use A–D(E), even numbers F–J(K)
  const optionLetter = (index: number) =>
    (isACT && (questionIdx + 1) % 2 === 0 ? 'FGHJK' : 'ABCDE')[index] ?? String(index + 1);

  usePreloadImages(
    sections.flatMap((s) => s.questions.flatMap((q) => [q.question, q.passage ?? '', ...q.options.map((o) => o.content)])),
  );

  // Adds the time spent on the visible question to its running total
  // and restarts the clock for whatever is shown next
  const flushQuestionTime = useCallback(() => {
    const now = Date.now();
    if (view === 'question' && currentQuestion) {
      const elapsed = Math.round((now - questionStartRef.current) / 1000);
      questionTimesRef.current[currentQuestion.id] = (questionTimesRef.current[currentQuestion.id] ?? 0) + elapsed;
    }
    questionStartRef.current = now;
  }, [view, currentQuestion]);

  const openSection = useCallback((idx: number) => {
    const now = Date.now();
    sectionStartRef.current = now;
    questionStartRef.current = now;
    setSectionIdx(idx);
    setQuestionIdx(0);
    setView('question');
    setPaneFocus('both');
    setTimeLeft(sections[idx].timeLimit);
    setShowFiveMinute(false);
    setShowNavigator(false);
    setShowCalculator(false);
    setShowReference(false);
    setShowDirections(!!sections[idx].instructions);
    setState('active');
  }, [sections]);

  const finishSection = useCallback(() => {
    flushQuestionTime();
    sectionTimesRef.current[sectionIdx] = Math.round((Date.now() - sectionStartRef.current) / 1000);
    setShowConfirm(false);
    setShowNavigator(false);

    if (sectionIdx + 1 < sections.length) {
      setBreakLeft(sections[sectionIdx].breakAfter ?? 0);
      setState('between');
      return;
    }

    // Final section done — build result and notify parent
    if (onAttemptComplete) {
      const result: ExamAttemptResult = {
        // Time actually spent inside sections; breaks and transition screens don't count
        totalTimeTaken: sections.reduce((acc, _s, si) => acc + (sectionTimesRef.current[si] ?? 0), 0),
        sections: sections.map((section, si) => ({
          sectionId: section.id,
          sectionName: section.name,
          timeTaken: sectionTimesRef.current[si] ?? 0,
          questions: section.questions.map(q => ({
            questionId: q.id,
            selectedOptionIds: answers[q.id]?.selectedOptionIds ?? [],
            textAnswer: answers[q.id]?.textAnswer?.trim() || undefined,
            isSkipped: !isAnswered(answers[q.id]),
            timeTaken: questionTimesRef.current[q.id] ?? 0,
          })),
        })),
      };
      onAttemptComplete(result);
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setState('complete');
  }, [flushQuestionTime, sectionIdx, sections, answers, onAttemptComplete]);

  // Section countdown — submits the section automatically at zero
  useEffect(() => {
    if (state !== 'active') return;
    if (timeLeft <= 0) {
      finishSection();
      return;
    }
    if (timeLeft === TIMER_FORCE_SHOW && currentSection.timeLimit > TIMER_FORCE_SHOW) setShowFiveMinute(true);
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [state, timeLeft, finishSection, currentSection]);

  // Break countdown — testing resumes on its own when the break runs out
  const breakOffered = state === 'between' && (sections[sectionIdx]?.breakAfter ?? 0) > 0;
  useEffect(() => {
    if (!breakOffered) return;
    const t = setTimeout(() => (breakLeft <= 1 ? openSection(sectionIdx + 1) : setBreakLeft((n) => n - 1)), 1000);
    return () => clearTimeout(t);
  }, [breakOffered, breakLeft, openSection, sectionIdx]);

  useEffect(() => {
    if (!showFiveMinute) return;
    const t = setTimeout(() => setShowFiveMinute(false), 6000);
    return () => clearTimeout(t);
  }, [showFiveMinute]);

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

  const startExam = () => {
    questionTimesRef.current = {};
    sectionTimesRef.current = {};
    setAnswers({});
    setFlagged(new Set());
    setEliminated({});
    setEliminatorOn(false);
    setMaskingOn(false);
    setRevealed({});
    setLineReaderOn(false);
    setTimerHidden(false);
    openSection(0);
  };

  const resetExam = () => {
    questionTimesRef.current = {};
    sectionTimesRef.current = {};
    setState('intro');
    setSectionIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setFlagged(new Set());
    setEliminated({});
  };

  const goToQuestion = (qi: number) => {
    flushQuestionTime();
    setQuestionIdx(qi);
    setView('question');
    setShowNavigator(false);
  };

  const openReview = () => {
    flushQuestionTime();
    setView('review');
    setShowNavigator(false);
  };

  const selectAnswer = (optionId: string) => {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const isMulti = currentQuestion.questionType === 'MULTIPLE_CORRECT';
    setAnswers((prev) => {
      const selected = prev[qid]?.selectedOptionIds ?? [];
      const next = !isMulti
        ? [optionId]
        : selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId];
      return { ...prev, [qid]: { selectedOptionIds: next } };
    });
    // Choosing a struck-out option brings it back
    setEliminated((prev) => ({ ...prev, [qid]: (prev[qid] ?? []).filter((id) => id !== optionId) }));
  };

  const toggleEliminate = (optionId: string) => {
    if (!currentQuestion) return;
    const qid = currentQuestion.id;
    const struck = eliminated[qid] ?? [];
    if (struck.includes(optionId)) {
      setEliminated((prev) => ({ ...prev, [qid]: struck.filter((id) => id !== optionId) }));
      return;
    }
    setEliminated((prev) => ({ ...prev, [qid]: [...struck, optionId] }));
    // Striking out the chosen answer clears it
    setAnswers((prev) => {
      const selected = prev[qid]?.selectedOptionIds ?? [];
      if (!selected.includes(optionId)) return prev;
      return { ...prev, [qid]: { selectedOptionIds: selected.filter((id) => id !== optionId) } };
    });
  };

  const setTextAnswer = (text: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { selectedOptionIds: [], textAnswer: text } }));
  };

  const toggleFlag = (qid: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  const isLastQuestion = questionIdx >= sectionQuestionCount - 1;
  const isLastSection = sectionIdx === sections.length - 1;
  const answeredInSection = currentSection?.questions.filter((q) => isAnswered(answers[q.id])).length ?? 0;
  const unansweredInSection = sectionQuestionCount - answeredInSection;
  const flaggedInSection = currentSection?.questions.filter((q) => flagged.has(q.id)).length ?? 0;
  const timerVisible = !timerHidden || timeLeft <= TIMER_FORCE_SHOW;

  const sectionResults = sections.map((section) => ({
    name: section.name,
    correct: section.questions.filter((q) => gradeAnswer(demoAnswerKey(q), answers[q.id]) === true).length,
    total: section.questions.length,
  }));
  const totalCorrect = sectionResults.reduce((acc, r) => acc + r.correct, 0);
  const finalPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (state === 'intro') {
    const tools = [
      'Section timer (can be hidden)',
      'Mark questions for review',
      'Answer eliminator',
      'Question navigator & review page',
      ...(sections.some((s) => s.hasCalculator) && desmosApiKey ? ['Graphing calculator (Math)'] : []),
      ...(sections.some((s) => s.hasCalculator) && examCode === 'SAT' ? ['Math reference sheet'] : []),
    ];
    return (
      <div className="rounded-2xl overflow-hidden border" style={{ background: 'white', borderColor: LINE }}>
        <div className="h-1.5" style={{ background: accentColor }} />
        <div className="px-6 md:px-10 py-7 border-b flex items-center gap-4" style={{ borderColor: SOFT }}>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black shrink-0 text-white"
            style={{ background: accentColor }}
          >
            {examCode}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold truncate" style={{ color: INK }}>{examName}</h2>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>
              {subtitle ?? `${sections.length} sections · ${totalQuestions} questions · ${formatDuration(totalTime)}`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-0">
          {/* Sections */}
          <div className="lg:col-span-3 p-6 md:p-8 lg:border-r" style={{ borderColor: SOFT }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Test structure</h3>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: LINE }}>
              {sections.map((s, i) => (
                <div key={s.id ?? s.name}>
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderTop: i > 0 ? `1px solid ${SOFT}` : undefined }}
                  >
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: SOFT, color: INK }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: INK }}>{s.name}</div>
                      <div className="text-xs flex items-center gap-2" style={{ color: MUTED }}>
                        {s.questions.length} questions
                        {s.hasCalculator && (
                          <span className="inline-flex items-center gap-1"><Calculator className="h-3 w-3" /> Calculator</span>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium tabular-nums shrink-0" style={{ color: INK }}>
                      <Clock className="h-3.5 w-3.5" style={{ color: MUTED }} />
                      {formatDuration(s.timeLimit)}
                    </span>
                  </div>
                  {(s.breakAfter ?? 0) > 0 && i < sections.length - 1 && (
                    <div
                      className="flex items-center gap-2 px-4 py-2 text-xs"
                      style={{ background: '#f9fafb', color: MUTED, borderTop: `1px dashed ${LINE}` }}
                    >
                      <Coffee className="h-3.5 w-3.5" /> Optional {formatDuration(s.breakAfter ?? 0)} break
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Before you begin */}
          <div className="lg:col-span-2 p-6 md:p-8 flex flex-col gap-5" style={{ background: '#fafafa' }}>
            {instructions ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Instructions</h3>
                <RichContent html={instructions} className="text-sm leading-relaxed" style={{ color: INK }} />
              </div>
            ) : null}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Before you begin</h3>
              <ul className="space-y-1.5 text-sm" style={{ color: INK }}>
                <li>• Each section is timed separately and submits itself when time runs out.</li>
                <li>• You can move freely within a section, but can&apos;t return to a section once it&apos;s submitted.</li>
                <li>• Unanswered questions are marked wrong — there&apos;s no penalty for guessing.</li>
                <li>• Find a quiet place and allow {formatDuration(totalTime)} without interruptions.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Tools during the test</h3>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-md border" style={{ borderColor: LINE, color: INK, background: 'white' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Button
              onClick={startExam}
              size="lg"
              disabled={totalQuestions === 0}
              className="w-full font-bold text-white mt-auto"
              style={{ background: accentColor, border: 'none' }}
            >
              {totalQuestions === 0 ? 'No questions yet' : 'Begin Test'}
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

  // Question grid shared by the navigator pop-up and the review page
  const questionGrid = (size: 'sm' | 'lg') => (
    <div className={cn('grid gap-2', size === 'sm' ? 'grid-cols-8 sm:grid-cols-10' : 'grid-cols-6 sm:grid-cols-9 md:grid-cols-10')}>
      {currentSection.questions.map((q, qi) => {
        const answered = isAnswered(answers[q.id]);
        const isCurrent = view === 'question' && qi === questionIdx;
        return (
          <button
            key={q.id}
            onClick={() => goToQuestion(qi)}
            aria-label={`Question ${qi + 1}${answered ? ', answered' : ', unanswered'}${flagged.has(q.id) ? ', marked for review' : ''}`}
            className={cn('relative rounded-md font-semibold tabular-nums transition-colors', size === 'sm' ? 'h-9 text-sm' : 'h-11 text-base')}
            style={{
              background: answered ? NAVY : 'white',
              color: answered ? 'white' : NAVY,
              border: answered ? `1px solid ${NAVY}` : `1.5px dashed ${MUTED}`,
            }}
          >
            {qi + 1}
            {isCurrent && (
              <MapPin className="absolute -top-3 left-1/2 -translate-x-1/2 h-3.5 w-3.5" style={{ color: INK, fill: 'white' }} />
            )}
            {flagged.has(q.id) && (
              <Bookmark className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5" style={{ color: '#dc2626', fill: '#dc2626' }} />
            )}
          </button>
        );
      })}
    </div>
  );

  const gridLegend = (
    <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: INK }}>
      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Current</span>
      <span className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-sm" style={{ border: `1.5px dashed ${MUTED}` }} /> Unanswered
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-sm" style={{ background: NAVY }} /> Answered
      </span>
      <span className="flex items-center gap-1.5">
        <Bookmark className="h-3.5 w-3.5" style={{ color: '#dc2626', fill: '#dc2626' }} /> For Review
      </span>
    </div>
  );

  // ─── ACTIVE EXAM + BETWEEN-SECTION SCREENS (one overlay so fullscreen survives) ───
  const nextSection = sections[sectionIdx + 1];
  const isFlaggedCurrent = !!currentQuestion && flagged.has(currentQuestion.id);
  const hasPassage = !!currentQuestion?.passage;
  const struckOut = currentQuestion ? eliminated[currentQuestion.id] ?? [] : [];

  // Question navigator pop-up, anchored above the footer's centre control
  const navigatorPopup = (
    <>
            {showNavigator && view === 'question' && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowNavigator(false)} />
                <div
                  className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-30 w-[min(92vw,560px)] rounded-xl border bg-white shadow-2xl p-5"
                  style={{ borderColor: LINE, color: INK }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-sm truncate" style={{ color: INK }}>Section {sectionIdx + 1}: {currentSection.name} Questions</span>
                    <button onClick={() => setShowNavigator(false)} aria-label="Close navigator" className="p-1 rounded hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="pb-4 mb-4" style={{ borderBottom: `1px solid ${SOFT}` }}>{gridLegend}</div>
                  {questionGrid('sm')}
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={openReview}
                      className="px-4 py-1.5 rounded-full border text-sm font-semibold"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Go to Review Page
                    </button>
                  </div>
                </div>
              </>
            )}
    </>
  );

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex flex-col" style={{ background: 'white', color: INK }}>
      {state === 'between' ? (
        breakOffered ? (
          // ── Break ──
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ background: NAVY, color: 'white' }}>
            <Coffee className="h-10 w-10 mb-4 opacity-80" />
            <p className="text-sm uppercase tracking-widest opacity-70 mb-2">Remaining break time</p>
            <div className="text-6xl md:text-7xl font-bold tabular-nums mb-6">{formatTime(breakLeft)}</div>
            <p className="max-w-md text-sm opacity-80 mb-8">
              You can take a short break. Keep this window open — testing resumes automatically when the timer ends.
              {nextSection && <> Next up: <strong>{nextSection.name}</strong>.</>}
            </p>
            <Button
              size="lg"
              onClick={() => openSection(sectionIdx + 1)}
              className="font-bold px-8"
              style={{ background: 'white', color: NAVY, border: 'none' }}
            >
              Resume Testing
            </Button>
          </div>
        ) : (
          // ── Section transition ──
          <div className="flex-1 flex items-center justify-center p-6" style={{ background: '#f9fafb' }}>
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: LINE }}>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3" style={{ color: '#16a34a' }} />
              <h2 className="text-xl font-bold mb-1">{currentSection.name} submitted</h2>
              <p className="text-sm mb-6" style={{ color: MUTED }}>
                You answered {answeredInSection} of {sectionQuestionCount} questions.
              </p>
              {nextSection && (
                <div className="rounded-xl border p-4 mb-6 text-left" style={{ borderColor: LINE }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Up next</p>
                  <p className="font-semibold">{nextSection.name}</p>
                  <p className="text-xs mt-1 flex items-center gap-3" style={{ color: MUTED }}>
                    <span>{nextSection.questions.length} questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(nextSection.timeLimit)}</span>
                    {nextSection.hasCalculator && <span className="flex items-center gap-1"><Calculator className="h-3 w-3" />Calculator</span>}
                  </p>
                </div>
              )}
              <Button
                size="lg"
                onClick={() => openSection(sectionIdx + 1)}
                className="w-full font-bold text-white"
                style={{ background: accentColor, border: 'none' }}
              >
                Start Next Section
              </Button>
              <p className="text-xs mt-3" style={{ color: MUTED }}>The timer starts when you continue.</p>
            </div>
          </div>
        )
      ) : (
        <>
          {/* ── Header ── */}
          {isACT ? (
            <header className="shrink-0">
              <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-12 text-white" style={{ background: ACT_BAR }}>
                <div className="min-w-0 text-sm font-semibold truncate">
                  {examName}<span className="font-normal opacity-75"> · {currentSection.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {timerVisible ? (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-md text-base font-bold tabular-nums"
                      style={{ background: timeLeft <= TIMER_FORCE_SHOW ? '#b91c1c' : 'rgba(255,255,255,0.12)' }}
                    >
                      <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <Clock className="h-5 w-5" aria-label="Timer hidden" />
                  )}
                  {timeLeft > TIMER_FORCE_SHOW && (
                    <button
                      onClick={() => setTimerHidden((v) => !v)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-white/40 hover:bg-white/10"
                    >
                      {timerHidden ? 'Show' : 'Hide'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 md:px-4 h-12 overflow-x-auto" style={{ background: ACT_TOOLBAR, borderBottom: `1px solid ${LINE}` }}>
                {view === 'question' && currentQuestion && (
                  <ActTool label="Flag" active={isFlaggedCurrent} onClick={() => toggleFlag(currentQuestion.id)} icon={<Flag className="h-4 w-4" />} />
                )}
                {view === 'question' && currentQuestion && !isTypedQuestion(currentQuestion.questionType) && (
                  <>
                    <ActTool label="Answer Eliminator" active={eliminatorOn} onClick={() => setEliminatorOn((v) => !v)} icon={<span className="text-[11px] font-bold line-through">ABC</span>} />
                    <ActTool
                      label="Answer Masking"
                      active={maskingOn}
                      onClick={() => { setMaskingOn((v) => !v); setRevealed({}); }}
                      icon={<EyeOff className="h-4 w-4" />}
                    />
                  </>
                )}
                <ActTool
                  label="Line Reader"
                  active={lineReaderOn}
                  onClick={() => { setLineReaderOn((v) => !v); setLineY(null); }}
                  icon={<Rows3 className="h-4 w-4" />}
                />
                {hasCalculatorTool && (
                  <ActTool label="Calculator" active={showCalculator} onClick={() => setShowCalculator((v) => !v)} icon={<Calculator className="h-4 w-4" />} />
                )}
                <ActTool label="Directions" active={showDirections} onClick={() => setShowDirections((v) => !v)} icon={<Info className="h-4 w-4" />} />
                <div className="ml-auto">
                  <ActTool
                    label={isBrowserFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                    onClick={toggleBrowserFullscreen}
                    icon={isBrowserFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  />
                </div>
              </div>
            </header>
          ) : (
            <>
          <header
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-6 h-16 shrink-0"
            style={{ borderBottom: `2px dashed ${LINE}` }}
          >
            <div className="min-w-0">
              <div className="text-sm md:text-base font-semibold truncate">
                Section {sectionIdx + 1}: {currentSection.name}
              </div>
              <button
                onClick={() => setShowDirections((v) => !v)}
                className="text-xs font-semibold flex items-center gap-0.5 hover:underline"
                style={{ color: INK }}
              >
                Directions {showDirections ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex flex-col items-center">
              {timerVisible ? (
                <span
                  className={cn('text-xl md:text-2xl font-bold tabular-nums leading-none', timeLeft <= TIMER_FORCE_SHOW && 'text-red-600')}
                  aria-live="off"
                >
                  {formatTime(timeLeft)}
                </span>
              ) : (
                <Clock className="h-6 w-6" aria-label="Timer hidden" />
              )}
              {timeLeft > TIMER_FORCE_SHOW && (
                <button
                  onClick={() => setTimerHidden((v) => !v)}
                  className="mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                  style={{ borderColor: INK }}
                >
                  {timerHidden ? 'Show' : 'Hide'}
                </button>
              )}
            </div>

            <div className="flex items-center justify-end gap-1 md:gap-2">
              {hasCalculatorTool && (
                <ToolButton
                  label="Calculator"
                  active={showCalculator}
                  onClick={() => setShowCalculator((v) => !v)}
                  icon={<Calculator className="h-5 w-5" />}
                />
              )}
              {hasReferenceTool && (
                <ToolButton
                  label="Reference"
                  active={showReference}
                  onClick={() => setShowReference((v) => !v)}
                  icon={<FileText className="h-5 w-5" />}
                />
              )}
              <ToolButton
                label={isBrowserFullscreen ? 'Exit full' : 'Full screen'}
                onClick={toggleBrowserFullscreen}
                icon={isBrowserFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              />
            </div>
          </header>

            </>
          )}

          {/* Directions drop-down */}
          {showDirections && (
            <div className={cn('absolute left-0 right-0 z-30 flex justify-center px-4', isACT ? 'top-24' : 'top-16')} onClick={() => setShowDirections(false)}>
              <div
                className="w-full max-w-3xl mt-2 rounded-xl border bg-white shadow-2xl p-6 max-h-[60vh] overflow-y-auto"
                style={{ borderColor: LINE }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-bold mb-3">{currentSection.name}</h3>
                {currentSection.instructions ? (
                  <RichContent html={currentSection.instructions} className="text-sm leading-relaxed" style={{ color: INK }} />
                ) : (
                  <p className="text-sm leading-relaxed">
                    This section has {sectionQuestionCount} questions and {formatDuration(currentSection.timeLimit)} on the clock.
                    Choose the best answer for each question. You can mark questions for review and come back to them before you submit the section.
                  </p>
                )}
                <div className="flex justify-end mt-5">
                  <Button onClick={() => setShowDirections(false)} className="text-white font-semibold" style={{ background: accentColor, border: 'none' }}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Five-minute warning */}
          {showFiveMinute && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-white" style={{ background: '#b91c1c' }}>
              5 minutes remaining in this section
            </div>
          )}

          {/* ── Body ── */}
          {view === 'review' ? (
            <main className="flex-1 overflow-y-auto" style={{ background: '#f9fafb' }}>
              <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{isACT ? 'Review Your Answers' : 'Check Your Work'}</h2>
                <p className="text-sm mb-1" style={{ color: MUTED }}>
                  On test day you won&apos;t be able to move on to the next section until time expires — here you can submit when you&apos;re ready.
                </p>
                <p className="text-sm mb-8" style={{ color: MUTED }}>
                  Select any question to go back to it.
                </p>
                <div className="rounded-2xl border bg-white p-6 text-left shadow-sm" style={{ borderColor: LINE }}>
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-5" style={{ borderBottom: `1px solid ${SOFT}` }}>
                    <span className="font-bold">{currentSection.name}</span>
                    <span className="text-xs" style={{ color: MUTED }}>
                      {answeredInSection}/{sectionQuestionCount} answered · {flaggedInSection} for review
                    </span>
                  </div>
                  <div className="mb-6">{gridLegend}</div>
                  {questionGrid('lg')}
                </div>
              </div>
            </main>
          ) : (
            <main
              className={cn('flex-1 min-h-0 grid', hasPassage && paneFocus === 'both' ? 'md:grid-cols-2' : 'grid-cols-1')}
              onMouseMove={lineReaderOn ? (e) => setLineY(e.clientY) : undefined}
            >
              {/* Passage pane */}
              {hasPassage && paneFocus !== 'question' && (
                <section className="relative min-h-0 overflow-y-auto px-6 md:px-10 py-8 md:border-r-4" style={{ borderColor: SOFT }}>
                  <button
                    onClick={() => setPaneFocus(paneFocus === 'passage' ? 'both' : 'passage')}
                    className="hidden md:flex absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                    title={paneFocus === 'passage' ? 'Restore' : 'Expand passage'}
                  >
                    {paneFocus === 'passage' ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                  </button>
                  <RichContent
                    html={currentQuestion.passage ?? ''}
                    className={cn('text-[15px] leading-7 whitespace-pre-wrap', paneFocus === 'passage' && 'max-w-3xl mx-auto')}
                    style={{ color: INK }}
                  />
                </section>
              )}

              {/* Question pane */}
              {(!hasPassage || paneFocus !== 'passage') && currentQuestion && (
                <section className="relative min-h-0 overflow-y-auto px-6 md:px-10 py-6">
                  {hasPassage && (
                    <button
                      onClick={() => setPaneFocus(paneFocus === 'question' ? 'both' : 'question')}
                      className="hidden md:flex absolute top-2 left-2 p-1 rounded hover:bg-gray-100"
                      title={paneFocus === 'question' ? 'Restore' : 'Expand question'}
                    >
                      {paneFocus === 'question' ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                    </button>
                  )}
                  <div className={cn('mx-auto', hasPassage && paneFocus === 'both' ? 'max-w-2xl' : 'max-w-3xl')}>
                    {/* Question bar */}
                    {isACT ? (
                      <div className="flex items-center gap-3 mb-5 pb-2" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <span className="text-base font-bold">Question {questionIdx + 1}</span>
                        {isFlaggedCurrent && (
                          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#fef3c7', color: '#92400e' }}>
                            <Flag className="h-3.5 w-3.5" /> Flagged
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                    <div className="flex items-center gap-3 mb-5 rounded-sm" style={{ background: SOFT, borderBottom: `2px dashed ${LINE}` }}>
                      <span className="w-9 h-9 flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: INK }}>
                        {questionIdx + 1}
                      </span>
                      <button
                        onClick={() => toggleFlag(currentQuestion.id)}
                        className="flex items-center gap-1.5 text-sm font-medium py-1.5"
                        aria-pressed={isFlaggedCurrent}
                      >
                        <Bookmark
                          className="h-4 w-4"
                          style={isFlaggedCurrent ? { color: '#dc2626', fill: '#dc2626' } : undefined}
                        />
                        <span className={cn(isFlaggedCurrent && 'font-semibold')}>Mark for Review</span>
                      </button>
                      {!isTypedQuestion(currentQuestion.questionType) && (
                        <button
                          onClick={() => setEliminatorOn((v) => !v)}
                          className="ml-auto mr-2 text-xs font-bold px-2 py-1 rounded border line-through"
                          style={{
                            background: eliminatorOn ? NAVY : 'white',
                            color: eliminatorOn ? 'white' : INK,
                            borderColor: eliminatorOn ? NAVY : LINE,
                          }}
                          title="Answer eliminator — strike out choices you've ruled out"
                          aria-pressed={eliminatorOn}
                        >
                          ABC
                        </button>
                      )}
                    </div>

                      </>
                    )}

                    <RichContent
                      html={currentQuestion.question}
                      className="text-[15px] leading-7 whitespace-pre-wrap mb-6"
                      style={{ color: INK }}
                    />

                    {isTypedQuestion(currentQuestion.questionType) ? (
                      <div className="max-w-xs pb-6 space-y-2">
                        <input
                          id="exam-typed-answer"
                          key={currentQuestion.id}
                          aria-label="Your answer"
                          value={answers[currentQuestion.id]?.textAnswer ?? ''}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          inputMode={currentQuestion.questionType === 'NUMERIC' ? 'decimal' : 'text'}
                          autoComplete="off"
                          className="w-full px-4 py-3 rounded-lg border-2 text-lg font-medium outline-none focus:ring-2"
                          style={{ borderColor: INK, color: INK, background: 'white' }}
                        />
                        <p className="text-sm" style={{ color: MUTED }}>
                          Answer Preview: <strong style={{ color: INK }}>{answers[currentQuestion.id]?.textAnswer?.trim() || '—'}</strong>
                        </p>
                        {currentQuestion.questionType === 'NUMERIC' && (
                          <p className="text-xs" style={{ color: MUTED }}>
                            Enter a whole number, decimal, or fraction (e.g. 3/17). Negative answers start with a minus sign.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 pb-6">
                        {currentQuestion.questionType === 'MULTIPLE_CORRECT' && (
                          <p className="text-xs" style={{ color: MUTED }}>Select all that apply.</p>
                        )}
                        {currentQuestion.options.map((option, oi) => {
                          const letter = optionLetter(oi);
                          const masked = isACT && maskingOn && !(revealed[currentQuestion.id] ?? []).includes(option.id);
                          if (masked) {
                            return (
                              <button
                                key={option.id}
                                onClick={() => setRevealed((prev) => ({ ...prev, [currentQuestion.id]: [...(prev[currentQuestion.id] ?? []), option.id] }))}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium"
                                style={{ border: `1.5px dashed ${MUTED}`, background: SOFT, color: MUTED }}
                              >
                                <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold shrink-0" style={{ border: `1.5px solid ${MUTED}` }}>{letter}</span>
                                <Eye className="h-4 w-4" /> Reveal answer choice
                              </button>
                            );
                          }
                          const selected = answers[currentQuestion.id]?.selectedOptionIds.includes(option.id) ?? false;
                          const struck = struckOut.includes(option.id);
                          return (
                            <div key={option.id} className="flex items-center gap-2">
                              <button
                                onClick={() => selectAnswer(option.id)}
                                aria-pressed={selected}
                                className="flex-1 text-left flex items-center gap-4 px-4 py-3 rounded-lg transition-shadow hover:shadow-sm"
                                style={{
                                  border: selected ? `2.5px solid ${NAVY}` : `1.5px solid ${INK}`,
                                  opacity: struck ? 0.45 : 1,
                                }}
                              >
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                  style={{
                                    border: `1.5px solid ${selected ? NAVY : INK}`,
                                    background: selected ? NAVY : 'white',
                                    color: selected ? 'white' : INK,
                                  }}
                                >
                                  {letter}
                                </span>
                                <RichContent
                                  as="span"
                                  html={option.content}
                                  className={cn('text-[15px] leading-relaxed', struck && 'line-through')}
                                  style={{ color: INK }}
                                />
                              </button>
                              {eliminatorOn && (
                                <button
                                  onClick={() => toggleEliminate(option.id)}
                                  className="w-12 shrink-0 text-xs font-bold underline-offset-2"
                                  style={{ color: INK }}
                                  aria-label={struck ? `Undo strike-out of choice ${letter}` : `Strike out choice ${letter}`}
                                >
                                  {struck ? (
                                    <span className="underline">Undo</span>
                                  ) : (
                                    <span className="relative inline-flex w-6 h-6 rounded-full border items-center justify-center" style={{ borderColor: INK }}>
                                      {letter}
                                      <span className="absolute -left-0.75 -right-0.75 top-1/2 h-[1.5px]" style={{ background: INK }} />
                                    </span>
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </main>
          )}

          {/* ── Footer ── */}
          {isACT ? (
            <footer className="relative flex items-center justify-between gap-2 px-3 md:px-6 h-14 shrink-0 text-white" style={{ background: ACT_BAR }}>
              <button
                onClick={() => (view === 'review' ? goToQuestion(Math.max(0, sectionQuestionCount - 1)) : goToQuestion(questionIdx - 1))}
                disabled={view === 'question' && questionIdx === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold border border-white/40 hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (view === 'review' ? goToQuestion(questionIdx) : setShowNavigator((v) => !v))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold border border-white/40 hover:bg-white/10"
                  aria-expanded={showNavigator}
                >
                  Nav {view === 'question' && <span className="tabular-nums opacity-80">· {questionIdx + 1}/{sectionQuestionCount}</span>}
                  {showNavigator ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                {view === 'question' && (
                  <button onClick={openReview} className="px-3 py-1.5 rounded-md text-sm font-semibold border border-white/40 hover:bg-white/10">
                    Review
                  </button>
                )}
              </div>
              {view === 'review' ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-1.5 rounded-md text-sm font-bold"
                  style={{ background: 'white', color: ACT_BAR }}
                >
                  {isLastSection ? 'End Test' : 'End Section'}
                </button>
              ) : (
                <button
                  onClick={() => (isLastQuestion ? openReview() : goToQuestion(questionIdx + 1))}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-md text-sm font-bold"
                  style={{ background: 'white', color: ACT_BAR }}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {navigatorPopup}
            </footer>
          ) : (
            <>
          <footer
            className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-6 h-16 shrink-0"
            style={{ borderTop: `2px dashed ${LINE}`, background: '#fafafa' }}
          >
            <div className="text-xs md:text-sm font-medium truncate" style={{ color: MUTED }}>
              {examName}
            </div>

            <div className="relative">
              {view === 'question' ? (
                <button
                  onClick={() => setShowNavigator((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: INK }}
                  aria-expanded={showNavigator}
                >
                  Question {questionIdx + 1} of {sectionQuestionCount}
                  {showNavigator ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <ListChecks className="h-4 w-4" /> Review
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              {(view === 'review' || questionIdx > 0) && (
                <Button
                  onClick={() => (view === 'review' ? goToQuestion(Math.max(0, sectionQuestionCount - 1)) : goToQuestion(questionIdx - 1))}
                  className="rounded-full px-5 font-semibold text-white"
                  style={{ background: accentColor, border: 'none' }}
                >
                  Back
                </Button>
              )}
              {view === 'review' ? (
                <Button
                  onClick={() => setShowConfirm(true)}
                  className="rounded-full px-5 font-semibold text-white"
                  style={{ background: accentColor, border: 'none' }}
                >
                  {isLastSection ? 'Submit Test' : 'Next Section'}
                </Button>
              ) : (
                <Button
                  onClick={() => (isLastQuestion ? openReview() : goToQuestion(questionIdx + 1))}
                  className="rounded-full px-5 font-semibold text-white"
                  style={{ background: accentColor, border: 'none' }}
                >
                  Next
                </Button>
              )}
            </div>

            {navigatorPopup}
          </footer>

            </>
          )}

          {/* Line reader — dims everything but a reading band that follows the pointer */}
          {isACT && lineReaderOn && view === 'question' && lineY !== null && (
            <>
              <div className="fixed left-0 right-0 top-0 z-10 pointer-events-none" style={{ height: Math.max(0, lineY - 30), background: 'rgba(15,23,42,0.45)' }} />
              <div className="fixed left-0 right-0 bottom-0 z-10 pointer-events-none" style={{ top: lineY + 30, background: 'rgba(15,23,42,0.45)' }} />
            </>
          )}

          {/* Confirm submit */}
          {showConfirm && (
            <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)' }}>
              <div className="p-8 rounded-2xl max-w-sm w-full mx-4 text-center shadow-xl border bg-white" style={{ borderColor: LINE }}>
                <AlertTriangle className="h-11 w-11 mx-auto mb-4" style={{ color: '#f59e0b' }} />
                <h3 className="text-xl font-bold mb-2">
                  Submit {isLastSection ? 'Test' : 'Section'}?
                </h3>
                {unansweredInSection > 0 ? (
                  <p className="text-sm mb-6" style={{ color: '#b45309' }}>
                    {unansweredInSection} question{unansweredInSection > 1 ? 's' : ''} unanswered
                    {flaggedInSection > 0 && ` · ${flaggedInSection} marked for review`}. You can&apos;t return to this section.
                  </p>
                ) : (
                  <p className="text-sm mb-6" style={{ color: MUTED }}>
                    All questions answered. You can&apos;t return once submitted.
                  </p>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1" style={{ borderColor: LINE, color: MUTED }}>
                    Keep Working
                  </Button>
                  <Button onClick={finishSection} className="flex-1 font-semibold text-white" style={{ background: accentColor, border: 'none' }}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Reference sheet */}
          {showReference && (
            <div
              className="absolute top-20 right-4 z-30 w-[min(92vw,420px)] max-h-[75vh] overflow-y-auto rounded-xl border bg-white shadow-2xl"
              style={{ borderColor: LINE }}
            >
              <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white" style={{ borderBottom: `1px solid ${SOFT}` }}>
                <span className="font-bold text-sm">Reference Sheet</span>
                <button onClick={() => setShowReference(false)} aria-label="Close reference sheet" className="p-1 rounded hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {REFERENCE_FORMULAS.map((f) => (
                  <div key={f.title} className="rounded-lg border p-2.5" style={{ borderColor: SOFT }}>
                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: MUTED }}>{f.title}</div>
                    {f.lines.map((l) => <div key={l} className="text-sm font-medium">{l}</div>)}
                  </div>
                ))}
              </div>
              <ul className="px-4 pb-4 space-y-1 text-xs" style={{ color: INK }}>
                {REFERENCE_FACTS.map((f) => <li key={f}>• {f}</li>)}
              </ul>
            </div>
          )}

          {showCalculator && hasCalculatorTool && desmosApiKey && (
            <DesmosCalculator apiKey={desmosApiKey} onClose={() => setShowCalculator(false)} />
          )}
        </>
      )}
    </div>
  );
}

function ToolButton({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-pressed={active}
      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors hover:bg-gray-100"
      style={{ color: INK, background: active ? SOFT : undefined }}
    >
      {icon}
      <span className="hidden md:block text-[11px] font-medium">{label}</span>
    </button>
  );
}

function ActTool({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-pressed={active}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
      style={{
        color: active ? 'white' : INK,
        background: active ? ACT_BAR : 'transparent',
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
