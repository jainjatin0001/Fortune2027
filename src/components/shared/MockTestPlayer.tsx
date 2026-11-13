'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, FileText, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamInterface, type ExamSection, type ExamAttemptResult } from './ExamInterface';
import type { DemoQuestion, QuestionType } from '@/types';

interface MockTestPlayerProps {
  /** Course flow — the learning asset that wraps the test (enrollment is checked) */
  assetId?: string;
  /** Free practice flow — a published demo test, no enrollment needed */
  mockTestId?: string;
  enrollmentId?: string | null;
  color?: string;
  onComplete?: () => void;
}

type PlayerState = 'loading' | 'error' | 'ready' | 'submitting' | 'saveFailed' | 'done';

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface SectionData {
  id: string;
  name: string;
  shortName: string;
  sortOrder: number;
  timeLimit: number;
  hasCalculator: boolean;
  instructions: string | null;
  totalMarks: number;
  breakAfter: number;
  questions: {
    id: string;
    statement: string;
    passage: string | null;
    difficulty: string;
    questionType: QuestionType;
    points: number;
    subject: string;
    topic: string | null;
    tags: string[];
    options: { id: string; content: string }[];
  }[];
}

function adaptSection(section: SectionData): ExamSection {
  return {
    id: section.id,
    name: section.name,
    shortName: section.shortName,
    timeLimit: section.timeLimit,
    hasCalculator: section.hasCalculator,
    instructions: section.instructions,
    breakAfter: section.breakAfter,
    questions: section.questions.map(q => {
      const options = q.options.map((o, i) => ({
        id: LETTERS[i] ?? String(i),
        content: o.content,
        _originalId: o.id,
      }));
      return {
        id: q.id,
        subject: q.subject,
        topic: q.topic ?? '',
        category: 'SAT_PREP' as const,
        difficulty: q.difficulty as DemoQuestion['difficulty'],
        question: q.statement,
        passage: q.passage,
        questionType: q.questionType,
        options: options.map(o => ({ id: o.id, content: o.content })),
        correctAnswerId: '',
        explanation: '',
        points: q.points,
        tags: q.tags,
      };
    }),
  };
}

export function MockTestPlayer({
  assetId,
  mockTestId,
  enrollmentId: _enrollmentId,
  color = '#7c3aed',
  onComplete,
}: MockTestPlayerProps) {
  const router = useRouter();
  const [playerState, setPlayerState] = useState<PlayerState>('loading');
  const [error, setError] = useState('');

  const [attemptId, setAttemptId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [testInstructions, setTestInstructions] = useState<string | null>(null);
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [rawSections, setRawSections] = useState<SectionData[]>([]);

  const [pendingResult, setPendingResult] = useState<ExamAttemptResult | null>(null);
  // One start request per test. Effects can run twice for the same mount (React dev
  // mode, fast remounts); a second request would supersede the first attempt on the
  // server and the student's answers would be saved against an abandoned attempt.
  const startRef = useRef<{ key: string; promise: Promise<Response> } | null>(null);

  // Start the attempt on mount
  useEffect(() => {
    let cancelled = false;
    const key = assetId ? `asset:${assetId}` : `test:${mockTestId}`;
    if (startRef.current?.key !== key) {
      startRef.current = {
        key,
        promise: fetch('/api/mock-test/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assetId ? { assetId } : { mockTestId }),
        }),
      };
    }
    const request = startRef.current.promise;
    async function start() {
      try {
        // clone(): every effect run reads the shared response independently
        const res = (await request).clone();
        if (cancelled) return;
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? 'Failed to start exam');
        }
        const data = await res.json();
        if (cancelled) return;
        setAttemptId(data.attemptId);
        setExamTitle(data.title);
        // Exam kind from the program when known, else a short code from the title (first word, max 4 chars)
        setExamCode(data.examKind ?? data.title.split(' ')[0]?.slice(0, 4).toUpperCase() ?? 'EXAM');
        setTestInstructions(data.instructions ?? null);
        setRawSections(data.sections);
        setSections(data.sections.map(adaptSection));
        setPlayerState('ready');
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load exam');
          setPlayerState('error');
        }
      }
    }
    start();
    return () => { cancelled = true; };
  }, [assetId, mockTestId]);

  const handleAttemptComplete = async (result: ExamAttemptResult) => {
    setPendingResult(result);
    setPlayerState('submitting');
    try {
      // Re-map letter option IDs back to real UUIDs for server storage
      const mappedSections = result.sections.map(sr => {
        const raw = rawSections.find(rs => rs.id === sr.sectionId);
        return {
          sectionId: sr.sectionId,
          timeTaken: sr.timeTaken,
          questions: sr.questions.map(qa => {
            if (!raw || qa.selectedOptionIds.length === 0) return qa;
            const rawQ = raw.questions.find(rq => rq.id === qa.questionId);
            if (!rawQ) return qa;
            const selectedUuids = qa.selectedOptionIds.map(letterId => {
              const idx = LETTERS.indexOf(letterId);
              return idx >= 0 ? (rawQ.options[idx]?.id ?? letterId) : letterId;
            });
            return { ...qa, selectedOptionIds: selectedUuids };
          }),
        };
      });

      const res = await fetch(`/api/mock-test/${attemptId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalTimeTaken: result.totalTimeTaken,
          sections: mappedSections,
        }),
      });
      // 409 = already saved (e.g. a retried request that had succeeded) — the report exists
      if (!res.ok && res.status !== 409) throw new Error('Failed to save results');
      setPlayerState('done');
      onComplete?.();
    } catch {
      // Keep the answers in memory so the student can retry instead of losing the test
      setPlayerState('saveFailed');
    }
  };

  if (playerState === 'saveFailed') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
        <AlertCircle className="h-10 w-10" style={{ color: '#dc2626' }} />
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--color-foreground)' }}>We couldn&apos;t save your answers</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            Check your connection and try again — your answers are still here.
          </p>
        </div>
        <Button
          className="font-bold text-white gap-2"
          style={{ background: color, border: 'none' }}
          onClick={() => pendingResult && handleAttemptComplete(pendingResult)}
        >
          <RotateCcw className="h-4 w-4" /> Retry saving
        </Button>
      </div>
    );
  }

  if (playerState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
          Loading exam…
        </p>
      </div>
    );
  }

  if (playerState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="h-10 w-10" style={{ color: '#dc2626' }} />
        <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>{error}</p>
      </div>
    );
  }

  if (playerState === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
          Saving your results…
        </p>
      </div>
    );
  }

  if (playerState === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
          <Trophy className="h-10 w-10" style={{ color }} />
        </div>
        <div>
          <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--color-foreground)' }}>
            Exam Submitted!
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            Your answers have been saved. View your full performance report below.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="font-bold text-white gap-2"
            style={{ background: color, border: 'none' }}
            // Free tests replace the exam page so "Back" from the report returns to the test list
            // instead of re-opening (and re-starting) the exam
            onClick={() => {
              const href = `/dashboard/mock-test/${attemptId}/report`;
              if (mockTestId) router.replace(href); else router.push(href);
            }}
          >
            <FileText className="h-4 w-4" />
            View Full Report
          </Button>
        </div>
      </div>
    );
  }

  // playerState === 'ready' — show the exam
  return (
    <ExamInterface
      examName={examTitle}
      examCode={examCode}
      accentColor={color}
      instructions={testInstructions}
      sections={sections}
      onAttemptComplete={handleAttemptComplete}
    />
  );
}
