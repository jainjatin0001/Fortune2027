'use client';

import { useCallback, useEffect, useRef } from 'react';
import Script from 'next/script';
import { X } from 'lucide-react';

type DesmosCalculatorInstance = { destroy?: () => void };

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        element: HTMLElement,
        options?: Record<string, boolean | number | string>,
      ) => DesmosCalculatorInstance;
    };
  }
}

interface DesmosCalculatorProps {
  apiKey: string;
  onClose: () => void;
}

/** Full graphing calculator for calculator-permitted exam sections. */
export function DesmosCalculator({ apiKey, onClose }: DesmosCalculatorProps) {
  const calculatorElement = useRef<HTMLDivElement>(null);
  const calculator = useRef<DesmosCalculatorInstance | null>(null);

  const mountCalculator = useCallback(() => {
    if (!calculatorElement.current || !window.Desmos) return;

    calculator.current?.destroy?.();
    calculatorElement.current.replaceChildren();
    calculator.current = window.Desmos.GraphingCalculator(calculatorElement.current, {
      expressions: true,
      expressionsTopbar: true,
      settingsMenu: true,
      zoomButtons: true,
      keypad: true,
      graphpaper: true,
      lockViewport: false,
    });
  }, []);

  useEffect(() => {
    mountCalculator();
    return () => calculator.current?.destroy?.();
  }, [mountCalculator]);

  return (
    <div
      className="absolute bottom-6 right-6 z-20 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl w-[min(42rem,calc(100vw-3rem))] h-[min(38rem,calc(100vh-7rem))]"
      style={{ borderColor: '#cbd5e1' }}
      role="dialog"
      aria-label="Desmos graphing calculator"
    >
      <Script
        id="desmos-graphing-calculator"
        src={`https://www.desmos.com/api/v1.12/calculator.js?apiKey=${apiKey}`}
        strategy="afterInteractive"
        onReady={mountCalculator}
      />
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: '#e2e8f0' }}>
        <span className="text-sm font-semibold" style={{ color: '#334155' }}>Desmos Graphing Calculator</span>
        <button
          onClick={onClose}
          className="rounded-md p-1 transition-colors hover:bg-slate-100"
          style={{ color: '#64748b' }}
          aria-label="Close calculator"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div ref={calculatorElement} className="min-h-0 flex-1" />
    </div>
  );
}
