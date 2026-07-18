'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Atom, BookOpen, Brain, Calculator, Clock, Code2, FlaskConical, Filter, HelpCircle, Trophy } from 'lucide-react';

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  quizType: string;
  timeLimit: number | null;
  passingScore: number;
  isPublished: boolean;
  subject: { id: string; name: string; color: string | null } | null;
  _count: { questions: number };
};

type Subject = { id: string; name: string };

const quizIcons = [BookOpen, Brain, Calculator, FlaskConical, Code2, Atom];

function getQuizIcon(quizId: string) {
  const hash = [...quizId].reduce((value, character) => value + character.charCodeAt(0), 0);
  return quizIcons[hash % quizIcons.length];
}

function formatTime(minutes: number | null) {
  if (!minutes) return 'Untimed';
  return `${minutes} min`;
}

function plainText(value: string | null) {
  return value?.replace(/<[^>]*>/g, '').trim() || 'Test your knowledge and track your progress.';
}

export function QuizLibrary({ quizzes, subjects, showDrafts }: { quizzes: Quiz[]; subjects: Subject[]; showDrafts: boolean }) {
  const [subjectId, setSubjectId] = useState('all');
  const filteredQuizzes = useMemo(
    () => quizzes.filter((quiz) => subjectId === 'all' || quiz.subject?.id === subjectId),
    [quizzes, subjectId],
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
            <Trophy className="h-5 w-5" style={{ color: '#b45309' }} />
          </div>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Quizzes</h1>
        </div>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Choose a subject and put your knowledge to the test.
        </p>
      </div>

      <div className="card-base p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold shrink-0" style={{ color: 'var(--color-foreground)' }}>
          <Filter className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
          Filter by subject
        </div>
        <select
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
          className="h-10 w-full sm:w-64 rounded-lg border px-3 text-sm outline-none"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
          aria-label="Filter quizzes by subject"
        >
          <option value="all">All subjects ({quizzes.length})</option>
          {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
        </select>
        {showDrafts && <span className="text-xs sm:ml-auto" style={{ color: 'var(--color-muted-foreground)' }}>Draft quizzes are visible to staff only.</span>}
      </div>

      {filteredQuizzes.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => {
            const color = quiz.subject?.color || '#7c3aed';
            const QuizIcon = getQuizIcon(quiz.id);
            return (
              <Link key={quiz.id} href={`/dashboard/quizzes/${quiz.id}`} className="card-base p-5 flex flex-col gap-3 hover:opacity-80 transition-opacity group">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
                    <QuizIcon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {!quiz.isPublished && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#b45309' }}>Draft</span>}
                    <ArrowRight className="h-4 w-4 mt-1 group-hover:translate-x-0.5 transition-transform" style={{ color }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color }}>{quiz.subject?.name || 'General'}</p>
                  <h2 className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>{quiz.title}</h2>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-muted-foreground)' }}>{plainText(quiz.description)}</p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{quiz._count.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(quiz.timeLimit)}</span>
                </div>
                <div className="text-xs font-medium" style={{ color }}>Pass score: {quiz.passingScore}%</div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card-base p-10 text-center">
          <HelpCircle className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-muted-foreground)' }} />
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>No quizzes found</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>Try another subject or check back soon for new quizzes.</p>
        </div>
      )}
    </div>
  );
}
