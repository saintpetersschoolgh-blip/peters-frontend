import React from 'react';
import { ICONS } from '../../../../constants';

export function ReadOnlyBanner({ title = 'Read-only', message }: { title?: string; message: string }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
      <div className="flex items-start gap-2">
        <span className="text-amber-700 mt-0.5">{ICONS.Lock}</span>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-amber-900/90">{message}</div>
        </div>
      </div>
    </div>
  );
}

