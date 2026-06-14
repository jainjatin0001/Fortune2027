'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let _addToast: ((type: ToastType, message: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  _addToast?.(type, message);
}

let counter = 0;

export function AdminToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    _addToast = (type, message) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    return () => { _addToast = null; };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto"
          style={{
            background: t.type === 'success' ? 'var(--color-success-light, #dcfce7)' : 'color-mix(in srgb, var(--color-danger) 15%, white)',
            color: t.type === 'success' ? 'var(--color-success, #16a34a)' : 'var(--color-danger)',
            border: `1px solid ${t.type === 'success' ? 'var(--color-success, #16a34a)' : 'var(--color-danger)'}`,
            minWidth: 280,
          }}
        >
          {t.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
