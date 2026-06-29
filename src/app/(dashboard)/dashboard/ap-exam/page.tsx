import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { getDbUser } from '@/lib/auth';
import { AP_SUBJECTS } from '@/../data/ap';

export const metadata: Metadata = { title: 'AP Exam Practice' };

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  return `${m}m`;
}

export default async function APExamPage() {
  const user = await getDbUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white font-black text-sm"
            style={{ background: '#b45309' }}
          >
            AP
          </span>
          <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>
            AP Exam Practice
          </h1>
        </div>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>
          Targeted quizzes for each AP subject. Each quiz covers the core concepts you need for exam day.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AP_SUBJECTS.map((subject) => (
          <Link
            key={subject.id}
            href={`/dashboard/ap-exam/${subject.id}`}
            className="card-base p-5 flex flex-col gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                style={{ background: subject.badge + '18', color: subject.badge }}
              >
                {subject.icon}
              </div>
              <ArrowRight
                className="h-4 w-4 mt-1 group-hover:translate-x-0.5 transition-transform"
                style={{ color: subject.badge }}
              />
            </div>

            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>
                {subject.title}
              </h3>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-muted-foreground)' }}>
                {subject.description}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-auto pt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <BookOpen className="h-3 w-3" />
                {subject.questions.length} questions
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="h-3 w-3" />
                {formatTime(subject.timeLimit)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {subject.topics.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: subject.badge + '12', color: subject.badge }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
