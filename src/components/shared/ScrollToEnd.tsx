'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/** Horizontal scroller that starts at the right edge (most recent data), like GitHub's contribution graph */
export function ScrollToEnd({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = ref.current.scrollWidth;
  }, []);
  return <div ref={ref} className={cn('overflow-x-auto', className)}>{children}</div>;
}
