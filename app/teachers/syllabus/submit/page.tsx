'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from '../mock-data';
import { ProgressBar } from '../components/ProgressBar';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { SyllabusNav } from '../components/SyllabusNav';
import { useToasts } from '../components/ToastHost';
import type { TopicProgressMap, SyllabusSubject } from '../types';
import type { SyllabusSubmission } from '../types';
import {
  PROGRESS_KEY,
  SUBMISSIONS_KEY,
  SYLLABUS_SUBJECTS_KEY,
  buildFallbackStatuses,
  computeCoveragePercent,
  defaultSubmission,
  findSubject,
  getSubmissionKey,
  isEditingLockedBySubmission,
  mergeSyllabusSubjects,
  useLocalStorageState,
} from '../lib';

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SubmitSyllabusPage() {
  const pathname = '/teachers/syllabus/submit';
  const { ToastHost, pushToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [academicYearId, setAcademicYearId] = useState<string>('ay-2025-2026');
  const [termId, setTermId] = useState<string>('t2-2025-2026');
  const [classId, setClassId] = useState<string>('c-10a');
  const [subjectId, setSubjectId] = useState<string>('sub-math-10a-t2');

  const [progress] = useLocalStorageState<TopicProgressMap>(PROGRESS_KEY, {});
  const [submissions, setSubmissions] = useLocalStorageState<Record<string, SyllabusSubmission>>(SUBMISSIONS_KEY, {});
  const [createdSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);

  const [declaration, setDeclaration] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const termsForYear = useMemo(() => MOCK_TERMS.filter((t) => t.academicYearId === academicYearId), [academicYearId]);

  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, createdSubjects), [createdSubjects]);

  const subjectsForFilters = useMemo(() => {
    return allSubjects.filter((s) => {
      return s.academicYearId === academicYearId && s.termId === termId && s.classId === classId;
    });
  }, [allSubjects, academicYearId, termId, classId]);

  const subjectOptions = useMemo(() => subjectsForFilters.map((s) => ({ value: s.id, label: s.name })), [subjectsForFilters]);

  useEffect(() => {
    if (!subjectOptions.length) {
      setSubjectId('');
      return;
    }
    if (!subjectOptions.some((o) => o.value === subjectId)) setSubjectId(subjectOptions[0].value);
  }, [subjectOptions, subjectId]);

  const selectedSubject: SyllabusSubject | null = useMemo(() => {
    if (!subjectId) return null;
    return findSubject(allSubjects, subjectId);
  }, [subjectId]);

  const fallbackStatuses = useMemo(() => buildFallbackStatuses(allSubjects), [allSubjects]);

  const requiredThreshold = 70;

  const coverage = useMemo(() => {
    if (!selectedSubject) return { percent: 0, completed: 0, total: 0 };
    return computeCoveragePercent(selectedSubject, progress, fallbackStatuses);
  }, [selectedSubject, progress, fallbackStatuses]);

  const submissionKey = useMemo(() => {
    if (!selectedSubject) return '';
    return getSubmissionKey({
      academicYearId: selectedSubject.academicYearId,
      termId: selectedSubject.termId,
      classId: selectedSubject.classId,
      subjectId: selectedSubject.id,
    });
  }, [selectedSubject]);

  const existingSubmission = useMemo(() => {
    if (!submissionKey) return null;
    return submissions[submissionKey] || null;
  }, [submissions, submissionKey]);

  const currentStatus = existingSubmission?.status || 'DRAFT';
  const locked = isEditingLockedBySubmission(currentStatus as any) || currentStatus === 'SUBMITTED';

  const canSubmit = !!selectedSubject && currentStatus !== 'APPROVED' && currentStatus !== 'SUBMITTED';

  const warningLowCoverage = coverage.percent < requiredThreshold;

  const doSubmit = async () => {
    if (!selectedSubject) return;
    if (!declaration) {
      pushToast({ tone: 'error', title: 'Declaration required', message: 'Please confirm the declaration before submitting.' });
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 350));
    const now = new Date().toISOString();

    const base =
      existingSubmission ||
      defaultSubmission({
        academicYearId,
        termId,
        classId,
        subjectId: selectedSubject.id,
        requiredThresholdPercent: requiredThreshold,
      });

    const next: SyllabusSubmission = {
      ...base,
      academicYearId,
      termId,
      classId,
      subjectId: selectedSubject.id,
      requiredThresholdPercent: requiredThreshold,
      coveragePercentAtSubmit: coverage.percent,
      declarationAccepted: true,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
    };

    setSubmissions({ ...submissions, [submissionKey]: next });
    setShowConfirm(false);
    setBusy(false);
    pushToast({ tone: 'success', title: 'Syllabus submitted', message: 'Your submission is now locked until reviewed.' });
  };

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submit Syllabus</h1>
          <p className="text-slate-600 mt-1">Submit your coverage summary for approval.</p>
          <div className="mt-3">
            <SyllabusNav pathname={pathname} />
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <SubmissionStatusBadge status={currentStatus as any} />
          </div>
          {existingSubmission?.submittedAt ? (
            <div className="text-xs text-slate-500 mt-2">
              Submitted: {new Date(existingSubmission.submittedAt).toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            label="Academic Year"
            value={academicYearId}
            onChange={(v) => setAcademicYearId(v)}
            options={MOCK_ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.name }))}
            placeholder="Select year"
          />
          <SelectField
            label="Term / Semester"
            value={termId}
            onChange={(v) => setTermId(v)}
            options={termsForYear.map((t) => ({ value: t.id, label: `${t.name}${t.ended ? ' (Ended)' : ''}` }))}
            placeholder="Select term"
          />
          <SelectField
            label="Class"
            value={classId}
            onChange={(v) => setClassId(v)}
            options={MOCK_CLASSES.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select class"
          />
          <SelectField
            label="Subject"
            value={subjectId}
            onChange={(v) => setSubjectId(v)}
            options={subjectOptions}
            placeholder={subjectOptions.length ? 'Select subject' : 'No subjects'}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6 animate-pulse">
          <div className="h-4 w-1/3 bg-slate-200 rounded" />
          <div className="h-2 w-full bg-slate-200 rounded mt-4" />
        </div>
      ) : !selectedSubject ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.BookOpen}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">No syllabus available</p>
          <p className="text-sm text-slate-600 mt-1">Pick filters that match available mock syllabus data.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-slate-600">Coverage summary</div>
                <div className="text-xl font-semibold text-slate-900 mt-1">
                  {selectedSubject.name} • {MOCK_CLASSES.find((c) => c.id === selectedSubject.classId)?.name || '—'}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Required threshold: <span className="font-semibold text-slate-900">{requiredThreshold}%</span>
                </div>
              </div>
              <div className="w-full md:w-96">
                <ProgressBar value={coverage.percent} label={`${coverage.completed}/${coverage.total} topics completed`} />
              </div>
            </div>
          </div>

          {warningLowCoverage ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5">{ICONS.AlertTriangle}</span>
                <div>
                  <div className="font-medium">Low coverage warning</div>
                  <div className="mt-1">
                    Coverage is <span className="font-semibold">{coverage.percent}%</span>, which is below the required{' '}
                    <span className="font-semibold">{requiredThreshold}%</span>. You can still submit, but it may be rejected.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900">
              <div className="flex items-start gap-2">
                <span className="text-green-700 mt-0.5">{ICONS.Check}</span>
                <div>
                  <div className="font-medium">Coverage meets threshold</div>
                  <div className="mt-1">You can submit for approval.</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4"
                disabled={!canSubmit || busy || currentStatus === 'APPROVED' || currentStatus === 'SUBMITTED'}
              />
              <div>
                <div className="font-medium text-slate-900">Declaration</div>
                <div className="text-sm text-slate-600 mt-1">
                  I confirm the coverage summary is accurate and reflects what has been taught for the selected subject.
                </div>
              </div>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-500">
                Status: <span className="font-semibold text-slate-900">{currentStatus}</span>
                {locked ? <span className="ml-2 text-slate-600">• Locked</span> : null}
              </div>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
                disabled={!canSubmit || !declaration || busy}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm ? (
        <ConfirmationModal
          title="Confirm submission"
          message={
            <div className="space-y-2">
              <p>
                You are about to submit your syllabus coverage for approval. After submitting, editing will be locked until the
                submission is reviewed.
              </p>
              {selectedSubject ? (
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
                  <div>
                    <span className="font-medium text-slate-900">Subject:</span> {selectedSubject.name}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium text-slate-900">Coverage:</span> {coverage.percent}% ({coverage.completed}/{coverage.total})
                  </div>
                </div>
              ) : null}
            </div>
          }
          confirmLabel="Submit now"
          onConfirm={doSubmit}
          onClose={() => setShowConfirm(false)}
          busy={busy}
        />
      ) : null}
    </div>
  );
}

