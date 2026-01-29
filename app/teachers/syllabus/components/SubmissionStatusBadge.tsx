import React from 'react';
import type { SubmissionStatus } from '../types';

const LABELS: Record<SubmissionStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const CLASSES: Record<SubmissionStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  );
}

