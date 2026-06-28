'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'SAT_PREP', label: 'SAT Prep' },
  { value: 'ACT_PREP', label: 'ACT Prep' },
  { value: 'AP_EXAM', label: 'AP Exams' },
  { value: 'CODING', label: 'Coding' },
  { value: 'HIGH_SCHOOL', label: 'High School' },
];

export function CoursesFilter({
  activeCategory,
  q,
}: {
  activeCategory: string;
  q: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState(activeCategory);

  const apply = () => {
    const params = new URLSearchParams();
    if (selected) params.set('category', selected);
    if (q) params.set('q', q);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const reset = () => {
    setSelected('');
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-foreground)' }}>Filters</span>
        <button
          onClick={reset}
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-accent)',
            fontWeight: 500,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
        >
          Reset
        </button>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '1rem' }} />

      {/* Category */}
      <p style={{
        fontWeight: 600,
        fontSize: '0.8rem',
        color: 'var(--color-foreground)',
        marginBottom: '0.75rem',
      }}>
        Category
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {CATEGORIES.map((cat) => {
          const isChecked = selected === cat.value;
          return (
            <label
              key={cat.value}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
            >
              <span
                onClick={() => setSelected(cat.value)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: isChecked ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                  background: isChecked ? 'var(--color-accent)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {isChecked && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                onClick={() => setSelected(cat.value)}
                style={{
                  fontSize: '0.875rem',
                  color: isChecked ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                  fontWeight: isChecked ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Apply button */}
      <button
        onClick={apply}
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '0.625rem',
          background: 'var(--color-primary)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-hover)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)'; }}
      >
        Apply Filters
      </button>
    </div>
  );
}
