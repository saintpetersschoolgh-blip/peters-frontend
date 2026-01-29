import React from 'react';
import type { TopicStatus } from '../types';

const LABELS: Record<TopicStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const CLASSES: Record<TopicStatus, string> = {
  NOT_STARTED: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export function StatusBadge({ status }: { status: TopicStatus }) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  );
}

export const STATUS_OPTIONS: { value: TopicStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: LABELS.NOT_STARTED },
  { value: 'IN_PROGRESS', label: LABELS.IN_PROGRESS },
  { value: 'COMPLETED', label: LABELS.COMPLETED },
];

