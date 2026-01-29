import React, { useState } from 'react';
import { ICONS } from '../../../../constants';

export function RemarkModal({
  studentName,
  locked,
  lockMessage,
  onClose,
  onSave,
}: {
  studentName: string;
  locked: boolean;
  lockMessage?: string;
  onClose: () => void;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add Remark</h2>
            <p className="text-sm text-slate-600 mt-1">{studentName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md">
            {ICONS.Close}
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {locked ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-900 flex items-start gap-2">
              <span className="text-amber-700 mt-0.5">{ICONS.Lock}</span>
              <div>
                <div className="font-medium">Read-only</div>
                <div className="opacity-90">{lockMessage || 'Editing is locked.'}</div>
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Remark</label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Write your remark..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              disabled={locked}
            />
            {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
            <p className="text-xs text-slate-500 mt-2">Note: remarks are visible to admin (simulated).</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (locked) return;
              const v = text.trim();
              if (!v) {
                setError('Remark is required');
                return;
              }
              onSave(v);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
            disabled={locked}
          >
            Save remark
          </button>
        </div>
      </div>
    </div>
  );
}

