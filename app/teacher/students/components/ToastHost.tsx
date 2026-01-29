import React, { useCallback, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  message?: string;
}

function toneClasses(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return { wrap: 'bg-green-50 border-green-200 text-green-900', icon: 'text-green-700', iconEl: ICONS.Check };
    case 'error':
      return { wrap: 'bg-red-50 border-red-200 text-red-900', icon: 'text-red-700', iconEl: ICONS.AlertTriangle };
    default:
      return { wrap: 'bg-slate-50 border-slate-200 text-slate-900', icon: 'text-slate-700', iconEl: ICONS.Info };
  }
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { id, ...t };
    setToasts((prev) => [item, ...prev].slice(0, 5));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const ToastHost = useMemo(() => {
    return function ToastHostImpl() {
      if (!toasts.length) return null;
      return (
        <div className="fixed right-4 top-4 z-[60] w-[92vw] max-w-sm space-y-2">
          {toasts.map((t) => {
            const cls = toneClasses(t.tone);
            return (
              <div key={t.id} className={`border rounded-lg shadow bg-white overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${cls.wrap} flex items-start justify-between gap-3`}>
                  <div className="flex items-start gap-2">
                    <span className={`${cls.icon} mt-0.5`}>{cls.iconEl}</span>
                    <div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      {t.message ? <div className="text-xs opacity-90 mt-0.5">{t.message}</div> : null}
                    </div>
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white/60 rounded"
                    aria-label="Dismiss"
                  >
                    {ICONS.Close}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
  }, [toasts, dismiss]);

  return { ToastHost, pushToast };
}

