import React from 'react';
import { ICONS } from '../../../../constants';

export function EvidenceUpload({ disabled }: { disabled: boolean }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-700">Attachments (UI only)</div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-60 disabled:hover:bg-white flex items-center justify-center gap-2"
          disabled={disabled}
          title="UI only"
        >
          <span className="text-slate-600">{ICONS.Upload}</span>
          Upload files
        </button>
        <div className="text-xs text-slate-500">
          This is a placeholder UI. No files are uploaded or stored.
        </div>
      </div>
    </div>
  );
}

