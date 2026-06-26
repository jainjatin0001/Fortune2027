'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  courseId: string;
  isFree: boolean;
}

export function EnrollButton({ courseId, isFree }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    try {
      if (isFree) {
        const res = await fetch('/api/enrollment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        });
        if (res.status === 401) { router.push('/sign-in'); return; }
        if (res.ok) router.push('/dashboard/courses');
        return;
      }

      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'course', courseId }),
      });
      if (res.status === 401) { router.push('/sign-in'); return; }
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full h-12 text-base font-bold text-white shadow-md hover:opacity-90 transition-opacity"
      style={{ background: 'var(--gradient-primary)' }}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isFree ? (
        'Enroll for Free'
      ) : (
        'Enroll Now'
      )}
    </Button>
  );
}
