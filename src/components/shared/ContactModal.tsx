'use client';

import { useId, useState } from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/** Copy + email subject for each place the contact pop-up is used. */
const PRESETS = {
  /** Home pricing section and pay-as-you-go cards. */
  advisor: {
    title: 'Talk to an Advisor',
    description: 'Free consultation, no commitment.',
    subjectPrefix: 'Advisor Enquiry',
    success: 'Our advisors will contact you within 24 hours to help you choose the right plan.',
  },
  /** Pricing page "Get Started" for custom rates. */
  pricing: {
    title: 'Get Started',
    description: "Tell us about your needs and we'll get back to you with accurate pricing.",
    subjectPrefix: 'Rate/Pricing Query',
    success: 'Thanks for reaching out. Our team will contact you within 24 hours.',
  },
} as const;

type Preset = keyof typeof PRESETS;
type Status = 'idle' | 'loading' | 'success' | 'error';

type ContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills "Course / Subject", e.g. "SAT Prep". */
  defaultCourse?: string;
  preset?: Preset;
};

/**
 * Accessible contact pop-up that posts to /api/contact. Built on the shared
 * Radix Dialog: focus trap, Esc to close, labelled title/description, and
 * theme colours that work in dark mode. The form unmounts when closed, so it
 * starts fresh each time.
 */
export function ContactModal({ open, onOpenChange, defaultCourse = '', preset = 'advisor' }: ContactModalProps) {
  const copy = PRESETS[preset];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <ContactForm copy={copy} defaultCourse={defaultCourse} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ContactForm({
  copy,
  defaultCourse,
  onDone,
}: {
  copy: (typeof PRESETS)[Preset];
  defaultCourse: string;
  onDone: () => void;
}) {
  const id = useId();
  const [form, setForm] = useState({ name: '', email: '', course: defaultCourse, message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const loading = status === 'loading';

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `${copy.subjectPrefix} — ${form.course || 'General'}`,
          message: form.message || `Looking for guidance on: ${form.course || 'General'}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4" role="status">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--color-success-light, #dcfce7)' }}
        >
          <CheckCircle className="h-7 w-7" style={{ color: 'var(--color-success, #16a34a)' }} aria-hidden />
        </div>
        <DialogTitle className="text-xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
          We&apos;ll be in touch!
        </DialogTitle>
        <DialogDescription className="text-sm mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
          {copy.success}
        </DialogDescription>
        <Button className="w-full font-semibold text-white" style={{ background: 'var(--gradient-primary)' }} onClick={onDone}>
          Close
        </Button>
      </div>
    );
  }

  const field = (name: string) => `${id}-${name}`;

  return (
    <>
      <div className="flex items-center gap-3 mb-6 pr-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--color-primary-light)' }}
        >
          <MessageCircle className="h-5 w-5" style={{ color: 'var(--color-accent)' }} aria-hidden />
        </div>
        <div>
          <DialogTitle className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            {copy.description}
          </DialogDescription>
        </div>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mb-4 px-4 py-3 rounded-lg text-sm border"
          style={{ background: 'var(--color-danger-light, #fee2e2)', color: 'var(--color-danger, #dc2626)', borderColor: 'var(--color-danger, #dc2626)' }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={field('name')} className="text-xs font-semibold">
              Name <span aria-hidden style={{ color: 'var(--color-danger, #dc2626)' }}>*</span>
            </Label>
            <Input id={field('name')} required autoComplete="name" value={form.name} onChange={set('name')} disabled={loading} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={field('email')} className="text-xs font-semibold">
              Email <span aria-hidden style={{ color: 'var(--color-danger, #dc2626)' }}>*</span>
            </Label>
            <Input id={field('email')} type="email" required autoComplete="email" value={form.email} onChange={set('email')} disabled={loading} placeholder="you@example.com" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={field('course')} className="text-xs font-semibold">
            Course / Subject
          </Label>
          <Input id={field('course')} value={form.course} onChange={set('course')} disabled={loading} placeholder="e.g. SAT Prep, AP Calc BC, Coding" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={field('message')} className="text-xs font-semibold">
            Message
          </Label>
          <Textarea id={field('message')} rows={3} value={form.message} onChange={set('message')} disabled={loading} placeholder="Tell us about your goals and current level..." className="resize-none" />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-11 font-semibold text-sm text-white" style={{ background: 'var(--gradient-primary)' }}>
          {loading ? 'Sending…' : 'Send Message'}
        </Button>
      </form>
    </>
  );
}
