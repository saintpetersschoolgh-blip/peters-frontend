import React from 'react';

export function ProgressBar({
  value,
  label,
}: {
  value: number; // 0..100
  label?: string;
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="space-y-1">
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${safe}%` }}
        />
      </div>
      {label ? <div className="text-xs text-slate-600">{label}</div> : null}
    </div>
  );
}

