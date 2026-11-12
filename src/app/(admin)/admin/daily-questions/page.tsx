'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DAYS = 14;

interface QuestionSummary {
  id: string;
  statement: string;
  difficulty: string;
  subject: { name: string };
}

interface Entry {
  date: string;
  isManual: boolean;
  attempts: number;
  question: QuestionSummary;
}

interface Track {
  id: string;
  name: string;
  isActive: boolean;
  subjects: string[];
  entries: Entry[];
}

const addDays = (key: string, n: number) => {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmt = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

export default function AdminDailyQuestionsPage() {
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [today, setToday] = useState(from);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const [picking, setPicking] = useState<{ track: Track; date: string } | null>(null);
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<QuestionSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  // Bumped after a schedule change to refetch the current window
  const [version, setVersion] = useState(0);
  const load = () => setVersion(v => v + 1);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/daily-questions?from=${from}&days=${DAYS}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        if (cancelled) return;
        setTracks(data.tracks);
        setToday(data.today);
      })
      .catch(() => { if (!cancelled) toast('error', 'Failed to load the schedule'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [from, version]);

  const findCandidates = useCallback(async (trackId: string, q: string) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/daily-questions?trackId=${trackId}&search=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      setCandidates((await res.json()).questions);
    } catch {
      toast('error', 'Search failed');
    } finally {
      setSearching(false);
    }
  }, []);

  const openPicker = (track: Track, date: string) => {
    setPicking({ track, date });
    setSearch('');
    setCandidates([]);
    findCandidates(track.id, '');
  };

  const schedule = async (questionId: string) => {
    if (!picking) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/daily-questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: picking.track.id, date: picking.date, questionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Could not schedule');
      toast('success', `Scheduled for ${fmt(picking.date)}`);
      setPicking(null);
      load();
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Could not schedule');
    } finally {
      setSaving(false);
    }
  };

  const reset = async (track: Track, date: string) => {
    const res = await fetch(`/api/admin/daily-questions?trackId=${track.id}&date=${date}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { toast('success', 'Reset to automatic pick'); load(); }
    else toast('error', data.error ?? 'Could not reset');
  };

  const goTo = (next: string) => {
    setLoading(true);
    setFrom(next);
  };

  const dates = Array.from({ length: DAYS }, (_, i) => addDays(from, i));

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Question of the Day"
        description="Each track gets one question per day, auto-picked from its subjects unless you schedule one. Dates are calendar days; students see the question for their local date."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goTo(addDays(from, -DAYS))} aria-label="Previous two weeks">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => goTo(today)}>Today</Button>
            <Button variant="outline" size="sm" onClick={() => goTo(addDays(from, DAYS))} aria-label="Next two weeks">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="h-64 rounded-xl animate-pulse" style={{ background: 'var(--color-muted)' }} />
      ) : tracks.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No tracks configured.</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {tracks.map(track => {
            const byDate = new Map(track.entries.map(e => [e.date, e]));
            return (
              <section key={track.id} className="card-base p-5">
                <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>
                  {track.name} {!track.isActive && <span className="text-xs font-normal">(inactive)</span>}
                </h2>
                <p className="text-xs mt-0.5 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                  Pool: {track.subjects.join(', ') || 'no subjects linked'}
                </p>
                <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {dates.map(date => {
                    const e = byDate.get(date);
                    const locked = date < addDays(today, -1) || (e?.attempts ?? 0) > 0;
                    return (
                      <li key={date} className="py-3 flex items-start gap-3">
                        <div className="w-24 shrink-0">
                          <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{fmt(date)}</p>
                          <p className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>
                            {!e ? 'Auto (on the day)' : e.isManual ? 'Scheduled' : 'Auto-picked'}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          {e ? (
                            <>
                              <p className="text-xs line-clamp-2" style={{ color: 'var(--color-foreground)' }}>{e.question.statement}</p>
                              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                                {e.question.subject.name} · {e.question.difficulty.toLowerCase()} · {e.attempts} answer{e.attempts === 1 ? '' : 's'}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>—</p>
                          )}
                        </div>
                        {!locked && (
                          <div className="flex gap-1 shrink-0">
                            <Button size="sm" variant="outline" onClick={() => openPicker(track, date)}>
                              {e ? 'Change' : 'Schedule'}
                            </Button>
                            {e && (
                              <Button size="sm" variant="ghost" onClick={() => reset(track, date)} aria-label="Reset to automatic pick">
                                <RotateCcw className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <Dialog open={!!picking} onOpenChange={(o) => { if (!o) setPicking(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {picking && `${picking.track.name} · ${fmt(picking.date)}`}
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); if (picking) findCandidates(picking.track.id, search); }}
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question text or paste a question ID"
              autoFocus
            />
            <Button type="submit" variant="outline" disabled={searching}><Search className="h-4 w-4" /></Button>
          </form>
          <ul className="max-h-[50vh] overflow-y-auto divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {searching && <li className="py-6 text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Searching…</li>}
            {!searching && candidates.length === 0 && (
              <li className="py-6 text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No matching questions in this track’s subjects.</li>
            )}
            {!searching && candidates.map(q => (
              <li key={q.id} className="py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-3" style={{ color: 'var(--color-foreground)' }}>{q.statement}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {q.subject.name} · {q.difficulty.toLowerCase()} · <span className="font-mono">{q.id.slice(0, 8)}</span>
                  </p>
                </div>
                <Button size="sm" onClick={() => schedule(q.id)} disabled={saving}>Use</Button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
