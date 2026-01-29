'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from '../mock-data';
import { ProgressBar } from '../components/ProgressBar';
import { TopicDetailsModal } from '../components/TopicDetailsModal';
import { UnitAccordion } from '../components/UnitAccordion';
import { ReadOnlyBanner } from '../components/ReadOnlyBanner';
import { SyllabusNav } from '../components/SyllabusNav';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { useToasts } from '../components/ToastHost';
import type { SyllabusSubject, TopicProgressMap, TopicStatus } from '../types';
import {
  PROGRESS_KEY,
  SUBMISSIONS_KEY,
  SYLLABUS_SUBJECTS_KEY,
  buildFallbackStatuses,
  computeCoveragePercent,
  defaultSubmission,
  findSubject,
  findTopic,
  getLockReason,
  getSubmissionKey,
  isEditingLockedBySubmission,
  mergeSyllabusSubjects,
  useLocalStorageState,
} from '../lib';
import type { SyllabusSubmission } from '../types';

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'All',
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
        <option value="ALL">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SyllabusProgressPage() {
  const [loading, setLoading] = useState(true);
  const { ToastHost, pushToast } = useToasts();

  const [academicYearId, setAcademicYearId] = useState<string>('ay-2025-2026');
  const [termId, setTermId] = useState<string>('t2-2025-2026');
  const [classId, setClassId] = useState<string>('c-10a');
  const [subjectId, setSubjectId] = useState<string>('ALL');

  const [progress, setProgress] = useLocalStorageState<TopicProgressMap>(PROGRESS_KEY, {});
  const [submissions, setSubmissions] = useLocalStorageState<Record<string, SyllabusSubmission>>(SUBMISSIONS_KEY, {});
  const [createdSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const termsForYear = useMemo(() => MOCK_TERMS.filter((t) => t.academicYearId === academicYearId), [academicYearId]);
  const termEnded = useMemo(() => termsForYear.find((t) => t.id === termId)?.ended ?? false, [termsForYear, termId]);

  useEffect(() => {
    const valid = termsForYear.some((t) => t.id === termId);
    if (!valid) setTermId(termsForYear[0]?.id || 'ALL');
  }, [termsForYear, termId]);

  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, createdSubjects), [createdSubjects]);
  const fallbackStatuses = useMemo(() => buildFallbackStatuses(allSubjects), [allSubjects]);

  const availableSubjects = useMemo(() => {
    return allSubjects.filter((s) => {
      const matchYear = academicYearId === 'ALL' || s.academicYearId === academicYearId;
      const matchTerm = termId === 'ALL' || s.termId === termId;
      const matchClass = classId === 'ALL' || s.classId === classId;
      return matchYear && matchTerm && matchClass;
    });
  }, [allSubjects, academicYearId, termId, classId]);

  const subjectOptions = useMemo(() => {
    return availableSubjects.map((s) => ({ value: s.id, label: s.name }));
  }, [availableSubjects]);

  useEffect(() => {
    if (subjectId === 'ALL') return;
    if (!subjectOptions.some((o) => o.value === subjectId)) setSubjectId('ALL');
  }, [subjectOptions, subjectId]);

  const selectedSubject: SyllabusSubject | null = useMemo(() => {
    if (subjectId === 'ALL') return availableSubjects[0] || null;
    return findSubject(availableSubjects, subjectId);
  }, [availableSubjects, subjectId]);

  const submission = useMemo(() => {
    if (!selectedSubject) return null;
    const key = getSubmissionKey({
      academicYearId: selectedSubject.academicYearId,
      termId: selectedSubject.termId,
      classId: selectedSubject.classId,
      subjectId: selectedSubject.id,
    });
    return submissions[key] || defaultSubmission({
      academicYearId: selectedSubject.academicYearId,
      termId: selectedSubject.termId,
      classId: selectedSubject.classId,
      subjectId: selectedSubject.id,
      requiredThresholdPercent: 70,
    });
  }, [selectedSubject, submissions]);

  const isLocked = useMemo(() => {
    if (!submission) return termEnded;
    return termEnded || isEditingLockedBySubmission(submission.status);
  }, [termEnded, submission]);

  const lockMessage = useMemo(() => {
    if (!submission) return getLockReason({ termEnded, submissionStatus: 'DRAFT' });
    return getLockReason({ termEnded, submissionStatus: submission.status });
  }, [termEnded, submission]);

  const ensureProgressForTopic = (topicId: string) => {
    const existing = progress[topicId];
    if (existing) return existing;
    return {
      status: fallbackStatuses[topicId] || 'NOT_STARTED',
      updatedAt: new Date().toISOString(),
    };
  };

  const updateTopicProgress = (topicId: string, patch: Partial<{ status: TopicStatus; dateCovered: string; notes: string }>) => {
    const prev = ensureProgressForTopic(topicId);
    setProgress({
      ...progress,
      [topicId]: {
        ...prev,
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const activeTopic = useMemo(() => {
    if (!selectedSubject || !activeTopicId) return null;
    return findTopic(selectedSubject, activeTopicId);
  }, [selectedSubject, activeTopicId]);

  const pageCoverage = useMemo(() => {
    if (!selectedSubject) return { percent: 0, completed: 0, total: 0 };
    return computeCoveragePercent(selectedSubject, progress, fallbackStatuses);
  }, [selectedSubject, progress, fallbackStatuses]);

  const pathname = '/teachers/syllabus/progress';

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Syllabus Progress</h1>
          <p className="text-slate-600 mt-1">Mark topics and add teaching notes/attachments (UI only).</p>
          <div className="mt-3">
            <SyllabusNav pathname={pathname} />
          </div>
        </div>
        {submission ? (
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <SubmissionStatusBadge status={submission.status} />
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Editing: <span className="font-medium text-slate-900">{isLocked ? 'Locked' : 'Allowed'}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            label="Academic Year"
            value={academicYearId}
            onChange={setAcademicYearId}
            options={MOCK_ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.name }))}
          />
          <SelectField
            label="Term / Semester"
            value={termId}
            onChange={setTermId}
            options={termsForYear.map((t) => ({ value: t.id, label: `${t.name}${t.ended ? ' (Ended)' : ''}` }))}
            placeholder="Select term"
          />
          <SelectField
            label="Class"
            value={classId}
            onChange={setClassId}
            options={MOCK_CLASSES.map((c) => ({ value: c.id, label: c.name }))}
          />
          <SelectField
            label="Subject"
            value={subjectId}
            onChange={setSubjectId}
            options={subjectOptions}
            placeholder={subjectOptions.length ? 'All (auto-picks first)' : 'No subjects'}
          />
        </div>
      </div>

      {isLocked ? <ReadOnlyBanner message={lockMessage} /> : null}

      {loading ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6 animate-pulse">
          <div className="h-5 w-1/3 bg-slate-200 rounded" />
          <div className="h-2 w-full bg-slate-200 rounded mt-5" />
          <div className="h-4 w-1/4 bg-slate-200 rounded mt-3" />
        </div>
      ) : !selectedSubject ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.BookOpen}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">No syllabus found</p>
          <p className="text-sm text-slate-600 mt-1">Try adjusting filters to match available mock syllabus data.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedSubject.name}</h2>
                <p className="text-slate-600 mt-1">{MOCK_CLASSES.find((c) => c.id === selectedSubject.classId)?.name || '—'}</p>
              </div>
              <div className="w-full md:w-96">
                <ProgressBar value={pageCoverage.percent} label={`${pageCoverage.completed}/${pageCoverage.total} topics completed`} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {selectedSubject.units.map((u) => (
              <UnitAccordion
                key={u.id}
                unit={u}
                progress={progress}
                fallbackStatuses={fallbackStatuses}
                onViewTopic={(id) => setActiveTopicId(id)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedSubject && activeTopic ? (
        <TopicDetailsModal
          subject={selectedSubject}
          topic={activeTopic}
          progress={ensureProgressForTopic(activeTopic.id)}
          locked={isLocked}
          lockMessage={lockMessage}
          onClose={() => setActiveTopicId(null)}
          onChangeStatus={(next) => {
            if (isLocked) {
              pushToast({ tone: 'error', title: 'Editing locked', message: lockMessage });
              return;
            }
            updateTopicProgress(activeTopic.id, { status: next });
            pushToast({ tone: 'success', title: 'Progress updated', message: `Status set to ${next.replace('_', ' ')}` });
          }}
          onChangeDateCovered={(next) => {
            if (isLocked) return;
            updateTopicProgress(activeTopic.id, { dateCovered: next });
          }}
          onChangeNotes={(next) => {
            if (isLocked) return;
            updateTopicProgress(activeTopic.id, { notes: next });
          }}
        />
      ) : null}
    </div>
  );
}

