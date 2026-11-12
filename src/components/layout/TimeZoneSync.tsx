'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COOKIE = 'tz';

/**
 * Stores the browser's time zone in a cookie so the server buckets streaks,
 * goals and charts by the student's local day. Refreshes once when it changes.
 */
export function TimeZoneSync() {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    const current = document.cookie.split('; ').find(c => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (current && decodeURIComponent(current) === tz) return;

    document.cookie = `${COOKIE}=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);

  return null;
}
