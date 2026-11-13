import { Mail, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FEEDBACK_EMAIL = 'info.deltatutors@gmail.com';

/** "Have a doubt or feedback?" card shown after quizzes and mock tests */
export function FeedbackCard({ subject, className = '' }: { subject: string; className?: string }) {
  return (
    <div className={`card-base p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 ${className}`}>
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
      <Button asChild variant="outline" className="shrink-0 print:hidden">
        <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}`}>
          <Mail className="h-4 w-4 mr-2" />
          Write to us
        </a>
      </Button>
    </div>
  );
}
