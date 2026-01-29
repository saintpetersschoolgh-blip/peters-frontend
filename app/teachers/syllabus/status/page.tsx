'use client';

import React, { useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from '../mock-data';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ReadOnlyBanner } from '../components/ReadOnlyBanner';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { SyllabusNav } from '../components/SyllabusNav';
import { useToasts } from '../components/ToastHost';
import type { SyllabusSubmission } from '../types';
import type { SyllabusSubject } from '../types';
import { SUBMISSIONS_KEY, SYLLABUS_SUBJECTS_KEY, isEditingLockedBySubmission, mergeSyllabusSubjects, useLocalStorageState } from '../lib';

function formatWhen(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function SubmissionStatusPage() {
  const pathname = '/teachers/syllabus/status';
  const { ToastHost, pushToast } = useToasts();
  const [submissions, setSubmissions] = useLocalStorageState<Record<string, SyllabusSubmission>>(SUBMISSIONS_KEY, {});
  const [createdSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);
  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, createdSubjects), [createdSubjects]);

  const all = useMemo(() => Object.values(submissions), [submissions]);
  const [selectedId, setSelectedId] = useState<string>(() => all[0]?.id || '');

  const selected = useMemo(() => {
    if (!selectedId) return all[0] || null;
    return all.find((s) => s.id === selectedId) || all[0] || null;
  }, [all, selectedId]);

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const locked = selected ? isEditingLockedBySubmission(selected.status) : false;

  const updateSubmission = (patch: Partial<SyllabusSubmission>) => {
    if (!selected) return;
    const next: SyllabusSubmission = { ...selected, ...patch, updatedAt: new Date().toISOString() };
    const nextMap: Record<string, SyllabusSubmission> = {};
    for (const [k, v] of Object.entries(submissions)) nextMap[k] = v.id === selected.id ? next : v;
    setSubmissions(nextMap);
  };

  const findLabel = (id: string, list: { id: string; name: string }[]) => list.find((x) => x.id === id)?.name || '—';
  const findTermLabel = (id: string) => MOCK_TERMS.find((t) => t.id === id)?.name || '—';
  const findSubjectLabel = (id: string) => allSubjects.find((s) => s.id === id)?.name || '—';

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submission Status</h1>
          <p className="text-slate-600 mt-1">Track your syllabus submission state and simulate review outcomes.</p>
          <div className="mt-3">
            <SyllabusNav pathname={pathname} />
          </div>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.Send}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">No submissions yet</p>
          <p className="text-sm text-slate-600 mt-1">Go to the Submit page to create your first submission.</p>
          <button
            type="button"
            onClick={() => (window.location.hash = '#/teachers/syllabus/submit')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Submit
          </button>
        </div>
      ) : selected ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="text-sm text-slate-600">Selected submission</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SubmissionStatusBadge status={selected.status} />
                  <span className="text-xs text-slate-500">Updated: {formatWhen(selected.updatedAt)}</span>
                </div>
              </div>

              <div className="w-full md:w-80">
                <label className="block text-sm font-medium text-slate-700 mb-2">Choose submission</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {all.map((s) => (
                    <option key={s.id} value={s.id}>
                      {findSubjectLabel(s.subjectId)} • {findLabel(s.classId, MOCK_CLASSES)} • {findTermLabel(s.termId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs text-slate-500">Academic Year</div>
                <div className="font-semibold text-slate-900 mt-1">{findLabel(selected.academicYearId, MOCK_ACADEMIC_YEARS)}</div>
                <div className="text-xs text-slate-500 mt-3">Term</div>
                <div className="font-semibold text-slate-900 mt-1">{findTermLabel(selected.termId)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs text-slate-500">Class</div>
                <div className="font-semibold text-slate-900 mt-1">{findLabel(selected.classId, MOCK_CLASSES)}</div>
                <div className="text-xs text-slate-500 mt-3">Subject</div>
                <div className="font-semibold text-slate-900 mt-1">{findSubjectLabel(selected.subjectId)}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-slate-900">Coverage at submission</div>
              <div className="text-sm text-slate-700 mt-1">
                {selected.coveragePercentAtSubmit}% (required: {selected.requiredThresholdPercent}%)
              </div>
              {selected.coveragePercentAtSubmit < selected.requiredThresholdPercent ? (
                <div className="mt-3 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                  <span className="text-amber-700 mt-0.5">{ICONS.AlertTriangle}</span>
                  <div>
                    <div className="font-medium">Below threshold</div>
                    <div className="text-amber-900/90">This submission may be rejected due to low coverage.</div>
                  </div>
                </div>
              ) : null}
            </div>

            {selected.status === 'SUBMITTED' || selected.status === 'APPROVED' ? (
              <ReadOnlyBanner
                message={
                  selected.status === 'SUBMITTED'
                    ? 'Submitted: editing is locked while awaiting approval.'
                    : 'Approved: editing is locked.'
                }
              />
            ) : null}

            {selected.status === 'REJECTED' && selected.reviewerComment ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
                <div className="font-semibold">Rejection comment</div>
                <div className="mt-1 whitespace-pre-wrap">{selected.reviewerComment}</div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                Submitted: <span className="font-medium text-slate-900">{formatWhen(selected.submittedAt)}</span>
                <span className="mx-2">•</span>
                Reviewed: <span className="font-medium text-slate-900">{formatWhen(selected.reviewedAt)}</span>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowApprove(true)}
                  disabled={selected.status !== 'SUBMITTED'}
                  className="px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                >
                  Simulate Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectComment(selected.reviewerComment || '');
                    setShowReject(true);
                  }}
                  disabled={selected.status !== 'SUBMITTED'}
                  className="px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60"
                >
                  Simulate Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSubmission({ status: 'DRAFT', reviewerComment: undefined, reviewedAt: undefined });
                    pushToast({ tone: 'info', title: 'Reset to draft', message: 'Editing is now allowed.' });
                  }}
                  className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Reset to Draft
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="text-sm font-semibold text-slate-900">Editing rules</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Syllabus structure is read-only (units/topics cannot be edited).</li>
              <li>Editing progress is allowed only in <b>Draft</b> or <b>Rejected</b>.</li>
              <li>Editing is locked in <b>Submitted</b> and <b>Approved</b>.</li>
            </ul>
          </div>

          {showApprove ? (
            <ConfirmationModal
              title="Simulate approval?"
              message="This will mark the submission as Approved and lock editing."
              confirmLabel="Approve"
              onClose={() => setShowApprove(false)}
              onConfirm={() => {
                updateSubmission({ status: 'APPROVED', reviewedAt: new Date().toISOString(), reviewerComment: undefined });
                setShowApprove(false);
                pushToast({ tone: 'success', title: 'Approved', message: 'Submission approved. Editing is locked.' });
              }}
            />
          ) : null}

          {showReject ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900">Simulate rejection</h2>
                  <button
                    onClick={() => setShowReject(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    {ICONS.Close}
                  </button>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <div className="text-sm text-slate-700">
                    Add a rejection comment (required). This will unlock editing (Rejected state).
                  </div>
                  <textarea
                    rows={4}
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reason for rejection..."
                  />
                </div>
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReject(false)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!rejectComment.trim()) {
                        pushToast({ tone: 'error', title: 'Comment required', message: 'Please add a rejection comment.' });
                        return;
                      }
                      updateSubmission({ status: 'REJECTED', reviewedAt: new Date().toISOString(), reviewerComment: rejectComment.trim() });
                      setShowReject(false);
                      pushToast({ tone: 'error', title: 'Rejected', message: 'Submission rejected. Editing is allowed.' });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

