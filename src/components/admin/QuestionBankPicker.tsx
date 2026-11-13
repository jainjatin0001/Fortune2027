'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { htmlToText } from '@/components/admin/RichEditor/utils/htmlToText';

export interface BankQuestion {
  id: string;
  statement: string;
  difficulty: string;
  sourceType?: string;
  subject: { name: string } | null;
  topic?: { name: string } | null;
}

interface QuestionBankPickerProps {
  subjects: { id: string; name: string }[];
  assignedIds: Set<string>;
  onAdd: (question: BankQuestion) => Promise<void>;
  /** Enables checkboxes + "Add selected" for adding many questions in one request */
  onAddMany?: (questions: BankQuestion[]) => Promise<void>;
  pageSize?: number;
  /** Max height of the scrollable results list, e.g. 'max-h-72'. */
  listClassName?: string;
}

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

export const diffColors: Record<string, { background: string; color: string }> = {
  EASY: { background: '#dcfce7', color: '#16a34a' },
  MEDIUM: { background: '#fef3c7', color: '#d97706' },
  HARD: { background: '#fee2e2', color: '#dc2626' },
  EXPERT: { background: '#ede9fe', color: '#7c3aed' },
};

export function QuestionBankPicker({
  subjects,
  assignedIds,
  onAdd,
  onAddMany,
  pageSize = 20,
  listClassName = 'max-h-80',
}: QuestionBankPickerProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<BankQuestion[]>([]);
  const [total, setTotal] = useState(0);
  // Which query the current results/error belong to; loading = they don't match the current query
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [errorQuery, setErrorQuery] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  // Kept across pages and filters so a selection can be built up before adding
  const [selected, setSelected] = useState<Map<string, BankQuestion>>(new Map());
  const [addingMany, setAddingMany] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
  if (debouncedSearch) params.set('search', debouncedSearch);
  if (subjectId) params.set('subjectId', subjectId);
  if (difficulty) params.set('difficulty', difficulty);
  const query = params.toString();

  const error = errorQuery === query;
  const loading = !error && loadedQuery !== query;

  // Debounce typing so we don't fire a request per keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    // Ignore responses that arrive after a newer request was made
    let stale = false;
    fetch(`/api/admin/questions?${query}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (stale) return;
        setResults(data.questions ?? []);
        setTotal(data.total ?? 0);
        setLoadedQuery(query);
        listRef.current?.scrollTo({ top: 0 });
      })
      .catch(() => { if (!stale) setErrorQuery(query); });
    return () => { stale = true; };
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleAdd = async (q: BankQuestion) => {
    setPendingIds(s => new Set(s).add(q.id));
    try {
      await onAdd(q);
    } finally {
      setPendingIds(s => { const n = new Set(s); n.delete(q.id); return n; });
    }
  };

  const toggleSelected = (q: BankQuestion) => {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(q.id)) next.delete(q.id);
      else next.set(q.id, q);
      return next;
    });
  };

  const selectable = results.filter(q => !assignedIds.has(q.id));
  const allPageSelected = selectable.length > 0 && selectable.every(q => selected.has(q.id));
  const togglePage = () => {
    setSelected(prev => {
      const next = new Map(prev);
      if (allPageSelected) selectable.forEach(q => next.delete(q.id));
      else selectable.forEach(q => next.set(q.id, q));
      return next;
    });
  };

  const handleAddMany = async () => {
    if (!onAddMany) return;
    const qs = [...selected.values()].filter(q => !assignedIds.has(q.id));
    if (!qs.length) { setSelected(new Map()); return; }
    setAddingMany(true);
    try {
      await onAddMany(qs);
      setSelected(new Map());
    } finally {
      setAddingMany(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--color-muted-foreground)' }} />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            onKeyDown={(e) => { if (e.key === 'Enter') setDebouncedSearch(search.trim()); }}
          />
        </div>
        <Select value={subjectId || 'all'} onValueChange={(v) => { setSubjectId(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-36 h-9 shrink-0 text-sm"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty || 'all'} onValueChange={(v) => { setDifficulty(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-32 h-9 shrink-0 text-sm"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {onAddMany && (
        <div className="flex items-center gap-3 mb-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--color-muted-foreground)' }}>
            <Checkbox checked={allPageSelected} onCheckedChange={togglePage} disabled={selectable.length === 0} />
            Select page
          </label>
          {selected.size > 0 && (
            <button className="underline" style={{ color: 'var(--color-muted-foreground)' }} onClick={() => setSelected(new Map())}>
              Clear
            </button>
          )}
          <Button size="sm" className="ml-auto h-7 text-xs" onClick={handleAddMany} disabled={selected.size === 0 || addingMany}>
            <Plus className="h-3 w-3 mr-1" />
            {addingMany ? 'Adding…' : `Add selected (${selected.size})`}
          </Button>
        </div>
      )}

      <div
        ref={listRef}
        className={`${listClassName} overflow-y-auto space-y-1.5 transition-opacity`}
        style={{ opacity: loading && results.length > 0 ? 0.55 : 1 }}
      >
        {error ? (
          <p className="text-sm py-2 text-center" style={{ color: 'var(--color-danger)' }}>Failed to load questions.</p>
        ) : loading && results.length === 0 ? (
          <p className="text-sm py-2 text-center" style={{ color: 'var(--color-muted-foreground)' }}>Loading…</p>
        ) : results.length === 0 ? (
          <p className="text-sm py-2 text-center" style={{ color: 'var(--color-muted-foreground)' }}>No questions found.</p>
        ) : results.map(q => {
          const already = assignedIds.has(q.id);
          const pending = pendingIds.has(q.id);
          return (
            <div
              key={q.id}
              className="flex items-start gap-3 p-2.5 rounded-lg border"
              style={{
                borderColor: 'var(--color-border)',
                background: already ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-card))' : 'var(--color-card)',
              }}
            >
              {onAddMany && (
                <Checkbox
                  className="mt-1 shrink-0"
                  checked={already || selected.has(q.id)}
                  disabled={already}
                  onCheckedChange={() => toggleSelected(q)}
                  aria-label="Select question"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{htmlToText(q.statement, 200)}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[q.difficulty] ?? {}}>{q.difficulty}</span>
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {[q.subject?.name, q.sourceType].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
              {already ? (
                <span className="text-xs shrink-0 mt-1" style={{ color: 'var(--color-primary)' }}>Added</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 h-7 text-xs"
                  onClick={() => handleAdd(q)}
                  disabled={pending}
                >
                  {pending ? '…' : <><Plus className="h-3 w-3 mr-1" />Add</>}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => p - 1)} disabled={page <= 1 || loading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2">{page} / {totalPages}</span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages || loading}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
