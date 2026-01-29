import React, { useMemo } from 'react';
import { ICONS } from '../../../../constants';
import type { SyllabusSubject, SyllabusTopicContent, TopicProgress, TopicStatus } from '../types';
import { EvidenceUpload } from './EvidenceUpload';
import { ReadOnlyBanner } from './ReadOnlyBanner';
import { STATUS_OPTIONS, StatusBadge } from './StatusBadge';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm text-slate-500">None</p>;
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}

export function TopicDetailsModal({
  subject,
  topic,
  progress,
  locked,
  lockMessage,
  onClose,
  onChangeStatus,
  onChangeDateCovered,
  onChangeNotes,
}: {
  subject: SyllabusSubject;
  topic: SyllabusTopicContent;
  progress: TopicProgress;
  locked: boolean;
  lockMessage?: string;
  onClose: () => void;
  onChangeStatus: (next: TopicStatus) => void;
  onChangeDateCovered: (next: string) => void;
  onChangeNotes: (next: string) => void;
}) {
  const lastUpdated = useMemo(() => {
    try {
      return new Date(progress.updatedAt).toLocaleString();
    } catch {
      return progress.updatedAt;
    }
  }, [progress.updatedAt]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{topic.title}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {subject.name} • Teaching periods: <span className="font-medium text-slate-900">{topic.teachingPeriods}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md">
            {ICONS.Close}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {locked ? <ReadOnlyBanner message={lockMessage || 'Editing is currently locked.'} /> : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <Section title="Current status">
                <div className="flex items-center gap-2">
                  <StatusBadge status={progress.status} />
                  <span className="text-xs text-slate-500">Updated: {lastUpdated}</span>
                </div>
              </Section>

              <Section title="Update progress">
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={progress.status}
                  onChange={(e) => onChangeStatus(e.target.value as TopicStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  disabled={locked}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-medium text-slate-700 mt-3 mb-1">Date covered</label>
                <input
                  type="date"
                  value={progress.dateCovered || ''}
                  onChange={(e) => onChangeDateCovered(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  disabled={locked}
                />

                <label className="block text-xs font-medium text-slate-700 mt-3 mb-1">Teaching notes</label>
                <textarea
                  rows={5}
                  value={progress.notes || ''}
                  onChange={(e) => onChangeNotes(e.target.value)}
                  placeholder="Add teaching notes... (placeholder for rich text)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  disabled={locked}
                />

                <div className="mt-3">
                  <EvidenceUpload disabled={locked} />
                </div>
              </Section>
            </div>

            <div className="md:col-span-2 space-y-4">
              <Section title="Sub-topics">
                <BulletList items={topic.subTopics} />
              </Section>
              <Section title="Learning objectives">
                <BulletList items={topic.learningObjectives} />
              </Section>
              <Section title="Key concepts">
                <BulletList items={topic.keyConcepts} />
              </Section>
              <Section title="Teaching materials">
                <BulletList items={topic.teachingMaterials} />
              </Section>
              <Section title="Reference materials">
                <BulletList items={topic.referenceMaterials} />
              </Section>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

