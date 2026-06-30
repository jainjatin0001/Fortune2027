'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, XCircle, MinusCircle, Clock, Target, TrendingUp,
  ChevronDown, ChevronRight, Printer, ArrowLeft, Trophy, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportQuestion {
  questionId: string;
  statement: string;
  difficulty: string;
  subject: string;
  topic: string | null;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean | null;
  isSkipped: boolean;
  timeTaken: number | null;
  explanation: string | null;
  options: { id: string; content: string; isCorrect: boolean }[];
}

interface ReportSection {
  sectionId: string;
  name: string;
  shortName: string;
  sortOrder: number;
  timeLimit: number;
  timeTaken: number;
  earnedScore: number;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracy: number;
  questions: ReportQuestion[];
}

interface TopicAnalysis {
  topic: string | null;
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface MockTestReport {
  attemptId: string;
  mockTestId: string;
  title: string;
  passingScore: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalTimeTaken: number | null;
  totalScore: number;
  earnedScore: number;
  scaledScore: number | null;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  passed: boolean;
  sections: ReportSection[];
  topicAnalysis: TopicAnalysis[];
  insights: string[];
}

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function AccuracyBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-muted)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}

export function ReportView({ report }: { report: MockTestReport }) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const passColor = report.passed ? '#16a34a' : '#dc2626';
  const passBg = report.passed ? '#dcfce7' : '#fee2e2';

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Actions bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 print:hidden">
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Hero */}
      <div className="card-base p-6 text-center space-y-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ background: `${passColor}15` }}
        >
          <Trophy className="h-10 w-10" style={{ color: passColor }} />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--color-foreground)' }}>
            {report.title}
          </h1>
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: passBg, color: passColor }}
          >
            {report.passed ? 'PASSED' : 'NOT PASSED'} — {report.earnedScore}/{report.totalScore} points
          </span>
        </div>
        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Accuracy', value: `${report.accuracy}%`, icon: Target, color: '#7c3aed' },
            { label: 'Correct', value: String(report.correctCount), icon: CheckCircle, color: '#16a34a' },
            { label: 'Incorrect', value: String(report.incorrectCount), icon: XCircle, color: '#dc2626' },
            { label: 'Skipped', value: String(report.skippedCount), icon: MinusCircle, color: '#d97706' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: `${color}0d` }}>
              <Icon className="h-5 w-5 mx-auto mb-1" style={{ color }} />
              <div className="text-xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          Total time: {report.totalTimeTaken ? fmtTime(report.totalTimeTaken) : '—'} · Passing score: {report.passingScore}%
        </p>
      </div>

      {/* Insights */}
      {report.insights.length > 0 && (
        <div className="card-base p-5 space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
            Performance Insights
          </h2>
          <ul className="space-y-2">
            {report.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
                <span style={{ color: 'var(--color-foreground)' }}>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section breakdown */}
      <div className="space-y-3">
        <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Section Breakdown</h2>
        {report.sections.map((sec) => {
          const isOpen = expandedSection === sec.sectionId;
          return (
            <div key={sec.sectionId} className="card-base overflow-hidden">
              {/* Section header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--color-muted)] transition-colors"
                onClick={() => setExpandedSection(isOpen ? null : sec.sectionId)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>{sec.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                      {sec.shortName}
                    </span>
                  </div>
                  <AccuracyBar pct={sec.accuracy} color={sec.accuracy >= 70 ? '#16a34a' : sec.accuracy >= 50 ? '#d97706' : '#dc2626'} />
                </div>
                <div className="flex items-center gap-4 text-sm shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="font-bold" style={{ color: 'var(--color-foreground)' }}>{sec.earnedScore}/{sec.totalScore}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>score</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="font-bold" style={{ color: 'var(--color-foreground)' }}>{fmtTime(sec.timeTaken)}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>time</div>
                  </div>
                  <div className="flex gap-1.5 text-xs">
                    <span style={{ color: '#16a34a' }}>{sec.correctCount}✓</span>
                    <span style={{ color: '#dc2626' }}>{sec.incorrectCount}✗</span>
                    <span style={{ color: '#d97706' }}>{sec.skippedCount}—</span>
                  </div>
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                </div>
              </button>

              {/* Question list */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {sec.questions.map((q, qi) => {
                    const qKey = `${sec.sectionId}-${q.questionId}`;
                    const isQOpen = expandedQuestion === qKey;
                    const statusIcon = q.isSkipped
                      ? <MinusCircle className="h-4 w-4 shrink-0" style={{ color: '#d97706' }} />
                      : q.isCorrect
                        ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#16a34a' }} />
                        : <XCircle className="h-4 w-4 shrink-0" style={{ color: '#dc2626' }} />;

                    return (
                      <div key={q.questionId} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                        <button
                          className="w-full flex items-start gap-3 p-3 text-left hover:bg-[var(--color-muted)] transition-colors"
                          onClick={() => setExpandedQuestion(isQOpen ? null : qKey)}
                        >
                          <span className="text-xs font-bold w-6 shrink-0 pt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{qi + 1}</span>
                          {statusIcon}
                          <span className="flex-1 text-sm line-clamp-2 text-left" style={{ color: 'var(--color-foreground)' }}>{q.statement}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                              {q.timeTaken ? fmtTime(q.timeTaken) : '—'}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                              {q.difficulty}
                            </span>
                            {isQOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </div>
                        </button>

                        {/* Question detail */}
                        {isQOpen && (
                          <div className="px-4 pb-4 space-y-3" style={{ background: 'var(--color-muted)' }}>
                            <p className="text-sm font-medium pt-2" style={{ color: 'var(--color-foreground)' }}>{q.statement}</p>
                            <div className="space-y-1.5">
                              {q.options.map((opt) => {
                                const wasSelected = q.selectedOptionIds.includes(opt.id);
                                const isCorrectOpt = opt.isCorrect;
                                let bg = 'transparent';
                                let border = 'var(--color-border)';
                                if (isCorrectOpt) { bg = '#dcfce7'; border = '#16a34a'; }
                                else if (wasSelected && !isCorrectOpt) { bg = '#fee2e2'; border = '#dc2626'; }
                                return (
                                  <div
                                    key={opt.id}
                                    className="flex items-start gap-2 p-2.5 rounded-lg border text-sm"
                                    style={{ background: bg, borderColor: border }}
                                  >
                                    {isCorrectOpt
                                      ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                                      : wasSelected
                                        ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                                        : <span className="h-4 w-4 shrink-0" />}
                                    <span style={{ color: 'var(--color-foreground)' }}>{opt.content}</span>
                                  </div>
                                );
                              })}
                            </div>
                            {q.explanation && (
                              <div className="p-3 rounded-lg" style={{ background: '#eff6ff', borderLeft: '3px solid #3b82f6' }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#1d4ed8' }}>Explanation</p>
                                <p className="text-sm" style={{ color: '#1e40af' }}>{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Topic analysis */}
      {report.topicAnalysis.length > 0 && (
        <div className="card-base p-5 space-y-4">
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Topic Analysis</h2>
          <div className="space-y-3">
            {report.topicAnalysis.map((t) => (
              <div key={`${t.subject}-${t.topic}`} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--color-foreground)' }}>
                    {t.topic ?? t.subject}
                    <span className="ml-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>({t.subject})</span>
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{t.correct}/{t.total}</span>
                </div>
                <AccuracyBar pct={t.accuracy} color={t.accuracy >= 70 ? '#16a34a' : t.accuracy >= 50 ? '#d97706' : '#dc2626'} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time analysis */}
      <div className="card-base p-5 space-y-4">
        <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Time Analysis</h2>
        <div className="space-y-3">
          {report.sections.map((sec) => {
            const usedPct = Math.min(100, Math.round((sec.timeTaken / sec.timeLimit) * 100));
            return (
              <div key={sec.sectionId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--color-foreground)' }}>{sec.shortName}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    <Clock className="h-3 w-3" />
                    {fmtTime(sec.timeTaken)} / {fmtTime(sec.timeLimit)}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-muted)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${usedPct}%`,
                      background: usedPct >= 95 ? '#dc2626' : usedPct >= 80 ? '#d97706' : '#7c3aed',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {report.sections.some(s => s.timeTaken / s.timeLimit >= 0.95) && (
          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#fef3c7' }}>
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#d97706' }} />
            <p className="text-xs" style={{ color: '#92400e' }}>
              You ran close to the time limit in one or more sections. Practice pacing to leave time for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
