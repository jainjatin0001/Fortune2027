'use client';

import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading,
  total,
  page,
  pageSize = 20,
  onPageChange,
  onEdit,
  onDelete,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterSlot,
}: AdminTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const showActions = onEdit || onDelete;

  return (
    <div className="card-base overflow-hidden">
      {/* Toolbar */}
      {(onSearchChange || filterSlot) && (
        <div className="p-4 border-b flex items-center gap-3 flex-wrap" style={{ borderColor: 'var(--color-border)' }}>
          {onSearchChange && (
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          )}
          {filterSlot}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-muted)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${col.className ?? ''}`}
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {col.label}
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color: 'var(--color-muted-foreground)' }} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-16 text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: i < data.length - 1 ? '1px solid var(--color-border)' : undefined,
                  }}
                  className="hover:bg-[var(--color-muted)] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`} style={{ color: 'var(--color-foreground)' }}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="cursor-pointer p-1.5 rounded-lg transition-colors hover:opacity-80"
                            style={{ color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="cursor-pointer p-1.5 rounded-lg transition-colors hover:opacity-80"
                            style={{ color: 'var(--color-danger)', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)' }}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2" style={{ color: 'var(--color-foreground)' }}>
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
