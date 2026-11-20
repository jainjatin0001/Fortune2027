'use client';

import { useState } from 'react';
import { CheckCircle, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ModalStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * "Talk to an Advisor" pop-up that posts to /api/contact.
 * Shared by the home pricing section and the pay-as-you-go card on SAT tool pages.
 */
export function ContactModal({ onClose, defaultCourse = '' }: { onClose: () => void; defaultCourse?: string }) {
  const [form, setForm] = useState({ name: '', email: '', course: defaultCourse, message: '' });
  const [status, setStatus] = useState<ModalStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
          subject: `Advisor Enquiry — ${form.course || 'General'}`,
          message: form.message || `Looking for guidance on: ${form.course}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? 'Something went wrong.'); setStatus('error'); return; }
      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl p-8 relative" style={{ background: '#ffffff', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#64748b' }}
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#dcfce7' }}>
              <CheckCircle className="h-7 w-7" style={{ color: '#16a34a' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>We&apos;ll be in touch!</h3>
            <p className="text-sm mb-6" style={{ color: '#64748b' }}>
              Our advisors will contact you within 24 hours to help you choose the right plan.
            </p>
            <Button className="w-full font-semibold" onClick={onClose}
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#fff' }}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#eff6ff' }}>
                <MessageCircle className="h-5 w-5" style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>Talk to an Advisor</h3>
                <p className="text-xs" style={{ color: '#64748b' }}>Free consultation — no commitment</p>
              </div>
            </div>

            {status === 'error' && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>
                    Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={status === 'loading'}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>
                    Email <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={status === 'loading'}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  disabled={status === 'loading'}
                  placeholder="e.g. SAT Prep, AP Calc BC, Coding"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>
                  Message
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={status === 'loading'}
                  placeholder="Tell us about your goals and current level..."
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ borderColor: '#e2e8f0', background: '#f8fafc', color: '#0f172a' }}
                />
              </div>

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-11 font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#fff' }}
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
