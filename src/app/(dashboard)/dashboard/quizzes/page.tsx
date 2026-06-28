import { Trophy, Clock } from 'lucide-react';

export default function QuizzesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#fef3c7' }}
        >
          <Trophy className="h-8 w-8" style={{ color: '#d97706' }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-foreground)' }}>
          Quizzes — Coming Soon
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          We&apos;re building a comprehensive quiz system with hundreds of topic-wise questions, instant feedback, and performance tracking. Check back soon!
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: '#fef3c7', color: '#b45309' }}
        >
          <Clock className="h-4 w-4" />
          Launching Soon
        </div>
      </div>
    </div>
  );
}
