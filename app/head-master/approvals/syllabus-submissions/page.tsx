'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from '../../../teachers/syllabus/mock-data';
import type { SyllabusSubmission } from '../../../teachers/syllabus/types';
import type { SyllabusSubject } from '../../../teachers/syllabus/types';
import { SUBMISSIONS_KEY, SYLLABUS_SUBJECTS_KEY, mergeSyllabusSubjects, useLocalStorageState } from '../../../teachers/syllabus/lib';

function formatWhen(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: SyllabusSubmission['status'] }) {
  const config = {
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
    SUBMITTED: { label: 'Pending Review', className: 'bg-amber-100 text-amber-800' },
    APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  };
  const { label, className } = config[status] || config.DRAFT;
  return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>{label}</span>;
}

export default function HeadMasterSyllabusApprovalsPage() {
  const [submissions, setSubmissions] = useLocalStorageState<Record<string, SyllabusSubmission>>(SUBMISSIONS_KEY, {});
  const [createdSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);
  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, createdSubjects), [createdSubjects]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<SyllabusSubmission | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSubmissions = useMemo(() => Object.values(submissions), [submissions]);

  const filtered = useMemo(() => {
    return allSubmissions.filter(sub => {
      const subject = allSubjects.find(s => s.id === sub.subjectId);
      const subjectName = subject?.name?.toLowerCase() || '';
      const className = MOCK_CLASSES.find(c => c.id === sub.classId)?.name?.toLowerCase() || '';
      const termName = MOCK_TERMS.find(t => t.id === sub.termId)?.name?.toLowerCase() || '';
      const searchTerm = search.toLowerCase();
      const matchesSearch = subjectName.includes(searchTerm) || className.includes(searchTerm) || termName.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allSubmissions, search, statusFilter, allSubjects]);

  const findLabel = (id: string, list: { id: string; name: string }[]) => list.find((x) => x.id === id)?.name || '—';
  const findSubjectLabel = (id: string) => allSubjects.find((s) => s.id === id)?.name || '—';

  const handleApprove = (submission: SyllabusSubmission) => {
    setSelectedSubmission(submission);
    setShowApproveModal(true);
  };

  const handleReject = (submission: SyllabusSubmission) => {
    setSelectedSubmission(submission);
    setRejectComment(submission.reviewerComment || '');
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (!selectedSubmission) return;
    const next: SyllabusSubmission = {
      ...selectedSubmission,
      status: 'APPROVED',
      reviewedAt: new Date().toISOString(),
      reviewerComment: undefined,
      updatedAt: new Date().toISOString(),
    };
    setSubmissions({ ...submissions, [selectedSubmission.id]: next });
    setShowApproveModal(false);
    setSelectedSubmission(null);
  };

  const confirmReject = () => {
    if (!selectedSubmission || !rejectComment.trim()) return;
    const next: SyllabusSubmission = {
      ...selectedSubmission,
      status: 'REJECTED',
      reviewedAt: new Date().toISOString(),
      reviewerComment: rejectComment.trim(),
      updatedAt: new Date().toISOString(),
    };
    setSubmissions({ ...submissions, [selectedSubmission.id]: next });
    setShowRejectModal(false);
    setSelectedSubmission(null);
    setRejectComment('');
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    const updates: Record<string, SyllabusSubmission> = {};
    selectedIds.forEach(id => {
      const sub = allSubmissions.find(s => s.id === id);
      if (sub && sub.status === 'SUBMITTED') {
        updates[id] = {
          ...sub,
          status: 'APPROVED',
          reviewedAt: new Date().toISOString(),
          reviewerComment: undefined,
          updatedAt: new Date().toISOString(),
        };
      }
    });
    setSubmissions({ ...submissions, ...updates });
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const submittedIds = filtered.filter(s => s.status === 'SUBMITTED').map(s => s.id);
    if (submittedIds.every(id => selectedIds.has(id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submittedIds));
    }
  };

  const pendingCount = useMemo(() => allSubmissions.filter(s => s.status === 'SUBMITTED').length, [allSubmissions]);
  const approvedCount = useMemo(() => allSubmissions.filter(s => s.status === 'APPROVED').length, [allSubmissions]);
  const rejectedCount = useMemo(() => allSubmissions.filter(s => s.status === 'REJECTED').length, [allSubmissions]);
  
  const selectedPending = filtered.filter(s => s.status === 'SUBMITTED' && selectedIds.has(s.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Syllabus Submissions Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve teacher-submitted syllabus submissions</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
          <div className="text-sm text-slate-500">Total Submissions</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{allSubmissions.length}</div>
        </div>
        <div className="bg-amber-50 rounded-lg shadow p-4 border border-amber-200">
          <div className="text-sm text-amber-700">Pending Review</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-700">Approved</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-sm text-red-700">Rejected</div>
          <div className="text-2xl font-bold text-red-900 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, class, or term..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPending > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedPending} submission{selectedPending !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkApprove}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {ICONS.Check}
            Approve Selected
          </button>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Syllabus Submissions ({filtered.length})</h3>
          {filtered.some(s => s.status === 'SUBMITTED') && (
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {filtered.filter(s => s.status === 'SUBMITTED').every(s => selectedIds.has(s.id)) ? 'Deselect All' : 'Select All Pending'}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  {filtered.some(s => s.status === 'SUBMITTED') && (
                    <input
                      type="checkbox"
                      checked={filtered.filter(s => s.status === 'SUBMITTED').length > 0 && 
                               filtered.filter(s => s.status === 'SUBMITTED').every(s => selectedIds.has(s.id))}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(submission => {
                const subject = allSubjects.find(s => s.id === submission.subjectId);
                const className = MOCK_CLASSES.find(c => c.id === submission.classId)?.name || '—';
                const term = MOCK_TERMS.find(t => t.id === submission.termId)?.name || '—';
                const coverage = submission.coveragePercentAtSubmit;
                const threshold = submission.requiredThresholdPercent;
                const meetsThreshold = coverage >= threshold;

                return (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {submission.status === 'SUBMITTED' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(submission.id)}
                          onChange={() => toggleSelect(submission.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{findSubjectLabel(submission.subjectId)}</div>
                      <div className="text-xs text-gray-500">{findLabel(submission.academicYearId, MOCK_ACADEMIC_YEARS)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{className}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{term}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={meetsThreshold ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                          {coverage}%
                        </span>
                        <span className="text-gray-500">/ {threshold}%</span>
                        {!meetsThreshold && (
                          <span className="text-xs text-amber-600" title="Below required threshold">
                            {ICONS.AlertTriangle}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatWhen(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {submission.status === 'SUBMITTED' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(submission)}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                          >
                            {ICONS.Check}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(submission)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                          >
                            {ICONS.Close}
                            Reject
                          </button>
                        </div>
                      ) : submission.status === 'REJECTED' && submission.reviewerComment ? (
                        <div className="text-xs text-gray-500 max-w-xs truncate" title={submission.reviewerComment}>
                          {submission.reviewerComment}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Approve Submission</h2>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedSubmission(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {ICONS.Close}
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Subject: {findSubjectLabel(selectedSubmission.subjectId)}</p>
                <p className="text-gray-600">
                  Class: {MOCK_CLASSES.find(c => c.id === selectedSubmission.classId)?.name || '—'}
                </p>
                <p className="text-gray-600">
                  Term: {MOCK_TERMS.find(t => t.id === selectedSubmission.termId)?.name || '—'}
                </p>
                <p className="text-gray-600 mt-2">
                  Coverage: {selectedSubmission.coveragePercentAtSubmit}% (Required: {selectedSubmission.requiredThresholdPercent}%)
                </p>
              </div>
              <p className="text-sm text-gray-700">
                Are you sure you want to approve this syllabus submission? This will lock editing for the teacher.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Reject Submission</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedSubmission(null);
                  setRejectComment('');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {ICONS.Close}
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Subject: {findSubjectLabel(selectedSubmission.subjectId)}</p>
                <p className="text-gray-600">
                  Class: {MOCK_CLASSES.find(c => c.id === selectedSubmission.classId)?.name || '—'}
                </p>
                <p className="text-gray-600">
                  Term: {MOCK_TERMS.find(t => t.id === selectedSubmission.termId)?.name || '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Comment <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedSubmission(null);
                  setRejectComment('');
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={!rejectComment.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
