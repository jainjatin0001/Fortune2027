'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Square, CheckSquare, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS, HOURLY_RATE } from '@/constants';

type PlanFeature = { text: string; included: boolean; highlight?: boolean; bold?: boolean };

type ModalStatus = 'idle' | 'loading' | 'success' | 'error';

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', course: '', message: '' });
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
          subject: `Rate/Pricing Query — ${form.course}`,
          message: form.message,
        }),
      });

      const data = await res.json();

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card-base w-full max-w-md p-8 relative"
        style={{ background: 'var(--color-background)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-[var(--color-background-alt)] transition-colors"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div
              className="text-4xl mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
              We&apos;ll be in touch!
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Thanks for reaching out. Our team will contact you within 24 hours.
            </p>
            <Button className="mt-6 w-full font-semibold" onClick={onClose}
              style={{ background: 'var(--gradient-primary)', color: '#fff' }}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
              Get Started
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-muted-foreground)' }}>
              Tell us about your needs and we&apos;ll get back to you with accurate pricing.
            </p>

            {status === 'error' && (
              <div
                className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
                  Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === 'loading'}
                  className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    background: 'var(--color-background-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
                  Email <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={status === 'loading'}
                  className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    background: 'var(--color-background-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  disabled={status === 'loading'}
                  className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    background: 'var(--color-background-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                  placeholder="e.g. SAT Prep, AP Calc BC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={status === 'loading'}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  style={{
                    background: 'var(--color-background-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                  placeholder="Tell us about your goals and current level..."
                />
              </div>

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full font-semibold"
                style={{ background: 'var(--gradient-primary)', color: '#fff' }}
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

function FeatureRow({ feature }: { feature: PlanFeature }) {
  if (!feature.included) {
    return (
      <li className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-muted-foreground)', opacity: 0.5 }}>
        <Square className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{feature.text}</span>
      </li>
    );
  }

  if (feature.highlight) {
    return (
      <li
        className="flex items-start gap-2.5 text-sm rounded-md px-2 py-1 -mx-2"
        style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-foreground)' }}
      >
        <CheckSquare className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#d97706' }} />
        <span className="font-semibold" style={{ color: '#d97706' }}>{feature.text}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-foreground)' }}>
      <CheckSquare className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
      <span className={feature.bold ? 'font-bold' : ''}>{feature.text}</span>
    </li>
  );
}

const COMPARISON_ROWS = [
  {
    label: 'Sessions per month',
    foundation: '4 hrs',
    scholar: '8 hrs',
    elite: '12 hrs',
  },
  {
    label: 'Effective hourly rate',
    foundation: '$62/hr',
    scholar: '$56/hr',
    elite: '$54/hr',
  },
  {
    label: 'Doubt solving',
    foundation: 'Email 48 hr',
    scholar: 'WhatsApp 24 hr',
    elite: 'Instant — anytime',
  },
  {
    label: 'Session scheduling',
    foundation: 'Standard',
    scholar: 'Priority 48 hr',
    elite: 'Confirmed <24 hrs',
  },
  {
    label: 'Progress reports',
    foundation: 'Monthly',
    scholar: 'Weekly',
    elite: 'Weekly detailed',
  },
  {
    label: 'Mock tests',
    foundation: null,
    scholar: '1/mo',
    elite: '2/mo',
  },
  {
    label: 'Score guarantee',
    foundation: null,
    scholar: null,
    elite: 'checked',
  },
];

const SELLING_POINTS = [
  {
    title: 'Instant doubt solving sells',
    body: 'Students get stuck at 10 PM before an exam. "Anytime WhatsApp" is the feature parents remember and talk about.',
  },
  {
    title: 'Easy scheduling reduces churn',
    body: 'Scheduling friction is the #1 reason students drop tutors. A 24 hr confirmation promise removes that anxiety entirely.',
  },
  {
    title: 'Risk reversal closes deals',
    body: 'The score guarantee on Elite removes the biggest objection. Parents pay for certainty — not just hours.',
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [activeCol, setActiveCol] = useState<'foundation' | 'scholar' | 'elite' | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (res.status === 401) {
        router.push('/sign-in');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Failed to create checkout session');
      window.location.href = data.url;
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <>
      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}

      {/* Pay as you go banner */}
      <div
        className="card-base p-6 max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>
            Pay as you go
          </p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-3xl font-black" style={{ color: 'var(--color-foreground)' }}>
              ${HOURLY_RATE}
            </span>
            <span className="text-sm pb-1" style={{ color: 'var(--color-muted-foreground)' }}>/hour</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            Contact us for more accurate pricing based on the needs of your student.
          </p>
        </div>
        <Button
          className="font-semibold shrink-0"
          style={{ background: 'var(--gradient-primary)', color: '#fff' }}
          onClick={() => setModalOpen(true)}
        >
          Contact US
        </Button>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`card-base p-8 relative flex flex-col ${plan.isPopular ? 'outline outline-2 outline-[var(--color-primary)]' : ''}`}
          >
            {plan.isPopular && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Zap className="h-3 w-3" />
                Most popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
                {plan.name}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
                {plan.description}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black" style={{ color: 'var(--color-primary)' }}>
                  ${plan.price}
                </span>
                <span className="text-sm pb-1" style={{ color: 'var(--color-muted-foreground)' }}>/mo</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <FeatureRow key={feature.text} feature={feature} />
              ))}
            </ul>

            <Button
              className="w-full font-semibold"
              variant={plan.isPopular ? 'default' : 'outline'}
              style={plan.isPopular ? { background: 'var(--gradient-primary)', color: '#fff' } : {}}
              disabled={loadingPlan !== null}
              onClick={() => handleCheckout(plan.id)}
            >
              {loadingPlan === plan.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Pay now $${plan.price}`
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="max-w-5xl mx-auto mt-16 overflow-x-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Click a column to compare
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th
                className="text-left py-3 pr-4 font-semibold"
                style={{ color: 'var(--color-muted-foreground)', width: '30%' }}
              >
                Feature
              </th>
              {(['foundation', 'scholar', 'elite'] as const).map((col) => {
                const isActive = activeCol === col;
                const isScholar = col === 'scholar';
                return (
                  <th
                    key={col}
                    onClick={() => setActiveCol(isActive ? null : col)}
                    className="text-center py-3 px-4 cursor-pointer select-none transition-all duration-200"
                    style={{
                      color: isActive || isScholar ? 'var(--color-primary)' : 'var(--color-foreground)',
                      background: isActive
                        ? 'rgba(var(--color-primary-rgb, 99,102,241),0.12)'
                        : isScholar
                        ? 'rgba(var(--color-primary-rgb, 99,102,241),0.06)'
                        : 'transparent',
                      fontWeight: isActive || isScholar ? 700 : 600,
                      borderBottom: isActive ? '2px solid var(--color-primary)' : undefined,
                    }}
                  >
                    <span className="capitalize">{col}</span>
                    {isScholar && !isActive && (
                      <span
                        className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--gradient-primary)', color: '#fff' }}
                      >
                        ★
                      </span>
                    )}
                    {isActive && (
                      <span
                        className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--gradient-primary)', color: '#fff' }}
                      >
                        ✓
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => {
              const isHovered = hoveredRow === i;
              return (
                <tr
                  key={row.label}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="transition-colors duration-150"
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: isHovered
                      ? 'rgba(var(--color-primary-rgb, 99,102,241),0.05)'
                      : i % 2 !== 0
                      ? 'var(--color-background-alt)'
                      : 'transparent',
                    cursor: 'default',
                  }}
                >
                  <td
                    className="py-3 pr-4 font-semibold transition-all duration-150"
                    style={{
                      color: isHovered ? 'var(--color-primary)' : 'var(--color-foreground)',
                      borderLeft: isHovered ? '3px solid var(--color-primary)' : '3px solid transparent',
                      paddingLeft: '12px',
                    }}
                  >
                    {row.label}
                  </td>
                  {(['foundation', 'scholar', 'elite'] as const).map((col) => {
                    const val = row[col];
                    const isActive = activeCol === col;
                    const isScholar = col === 'scholar';
                    return (
                      <td
                        key={col}
                        className="text-center py-3 px-4 transition-all duration-200"
                        style={{
                          color: isActive || isScholar ? 'var(--color-primary)' : 'var(--color-foreground)',
                          fontWeight: isActive || isScholar ? 600 : 500,
                          background: isActive
                            ? 'rgba(var(--color-primary-rgb, 99,102,241),0.08)'
                            : isScholar
                            ? 'rgba(var(--color-primary-rgb, 99,102,241),0.04)'
                            : 'transparent',
                        }}
                      >
                        {val === null ? (
                          <Square className="h-4 w-4 mx-auto" style={{ opacity: 0.4 }} />
                        ) : val === 'checked' ? (
                          <CheckSquare className="h-4 w-4 mx-auto" style={{ color: 'var(--color-success)' }} />
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selling points */}
      <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        {SELLING_POINTS.map((pt) => (
          <div
            key={pt.title}
            className="card-base p-5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-start gap-2 mb-2">
              <CheckSquare className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                {pt.title}
              </p>
            </div>
            <p className="text-sm pl-6" style={{ color: 'var(--color-muted-foreground)' }}>
              {pt.body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
