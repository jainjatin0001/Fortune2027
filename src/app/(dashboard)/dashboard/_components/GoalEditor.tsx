'use client';

import { useState, useTransition } from 'react';
import { Pencil } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DAILY_GOAL_MAX, DAILY_GOAL_MIN, DAILY_GOAL_PRESETS } from '@/lib/progress/constants';
import { setDailyGoal } from '../actions';

export function GoalEditor({ goal }: { goal: number }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(goal));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const save = (next: number) => {
    setError(null);
    startTransition(async () => {
      const res = await setDailyGoal(next);
      if (res.ok) setOpen(false);
      else setError(res.error ?? 'Could not save your goal.');
    });
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) { setValue(String(goal)); setError(null); } }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          <Pencil className="h-3 w-3" /> Edit goal
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <form
          onSubmit={(e) => { e.preventDefault(); save(Number(value)); }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold">Daily question goal</p>
          <div className="flex flex-wrap gap-1.5">
            {DAILY_GOAL_PRESETS.map((p) => (
              <Button
                key={p}
                type="button"
                size="sm"
                variant={Number(value) === p ? 'default' : 'outline'}
                onClick={() => setValue(String(p))}
                disabled={pending}
              >
                {p}
              </Button>
            ))}
          </div>
          <label className="block text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            Custom ({DAILY_GOAL_MIN}–{DAILY_GOAL_MAX})
            <Input
              type="number"
              inputMode="numeric"
              min={DAILY_GOAL_MIN}
              max={DAILY_GOAL_MAX}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
              disabled={pending}
            />
          </label>
          {error && <p className="text-xs" role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <Button type="submit" size="sm" className="w-full" disabled={pending}>
            {pending ? 'Saving…' : 'Save goal'}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
