'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card-base p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
        >
          ✓
        </div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
          Message Sent!
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          {"We'll be in touch within 24 hours."}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-medium underline underline-offset-4 mt-2"
          style={{ color: 'var(--color-primary)' }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="card-base p-8">
      <h2 className="text-heading-4 mb-6 font-bold" style={{ color: 'var(--color-foreground)' }}>
        Send a Message
      </h2>

      {status === 'error' && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Full Name <span style={{ color: '#dc2626' }}>*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={status === 'loading'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Email Address <span style={{ color: '#dc2626' }}>*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            placeholder="How can we help?"
            value={form.subject}
            onChange={handleChange}
            disabled={status === 'loading'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Message <span style={{ color: '#dc2626' }}>*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us more..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          />
        </div>

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full text-white font-semibold"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
