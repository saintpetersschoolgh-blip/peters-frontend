'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from './mock-data';
import { ProgressBar } from './components/ProgressBar';
import { StatusBadge } from './components/StatusBadge';
import { TopicDetailsModal } from './components/TopicDetailsModal';
import { UnitAccordion } from './components/UnitAccordion';
import type { SyllabusSubject, SyllabusTopicContent, TopicProgressMap, TopicStatus } from './types';
import { SyllabusNav } from './components/SyllabusNav';
import { SUBMISSIONS_KEY, SYLLABUS_SUBJECTS_KEY, buildFallbackStatuses, computeCoveragePercent, getLockReason, getSubmissionKey, isEditingLockedBySubmission, mergeSyllabusSubjects } from './lib';
import type { SyllabusSubmission } from './types';

import { PROGRESS_KEY, useLocalStorageState } from './lib';

function getAllTopics(subject: SyllabusSubject): SyllabusTopicContent[] {
  return subject.units.flatMap((u) => u.topics);
}

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

function SyllabusCard({
  subject,
  className,
  progress,
  onOpen,
}: {
  subject: SyllabusSubject;
  className: string;
  progress: { percent: number; completed: number; total: number };
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200 p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-slate-900 truncate">{subject.name}</div>
          <div className="text-sm text-slate-600 mt-1">{className}</div>
        </div>
        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
          {ICONS.Book}
        </div>
      </div>
      <div className="space-y-1">
        <ProgressBar value={progress.percent} label={`${progress.percent}% completed`} />
        <div className="text-xs text-slate-600">
          <span className="font-medium text-slate-900">{progress.completed}</span> / {progress.total} topics completed
        </div>
      </div>
      <div className="pt-1">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700">
          View syllabus breakdown {ICONS.ChevronRight}
        </span>
      </div>
    </button>
  );
}

export default function TeacherSyllabusPage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'breakdown'>('overview');

  const [academicYearId, setAcademicYearId] = useState<string>('ay-2025-2026');
  const [termId, setTermId] = useState<string>('t2-2025-2026');
  const [classId, setClassId] = useState<string>('ALL');
  const [subjectId, setSubjectId] = useState<string>('ALL');

  const [progress, setProgress] = useLocalStorageState<TopicProgressMap>(PROGRESS_KEY, {});
  const [submissions] = useLocalStorageState<Record<string, SyllabusSubmission>>(SUBMISSIONS_KEY, {});
  const [createdSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const allSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS, createdSubjects), [createdSubjects]);

  // Simulated loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const termsForYear = useMemo(
    () => MOCK_TERMS.filter((t) => t.academicYearId === academicYearId),
    [academicYearId],
  );
  const termEnded = useMemo(() => termsForYear.find((t) => t.id === termId)?.ended ?? false, [termsForYear, termId]);

  // Keep term selection valid when year changes
  useEffect(() => {
    const valid = termsForYear.some((t) => t.id === termId);
    if (!valid) setTermId(termsForYear[0]?.id || 'ALL');
  }, [termsForYear, termId]);

  const subjectsForFilters = useMemo(() => {
    return allSubjects.filter((s) => {
      const matchYear = academicYearId === 'ALL' || s.academicYearId === academicYearId;
      const matchTerm = termId === 'ALL' || s.termId === termId;
      const matchClass = classId === 'ALL' || s.classId === classId;
      return matchYear && matchTerm && matchClass;
    });
  }, [allSubjects, academicYearId, termId, classId]);

  const subjectOptions = useMemo(() => {
    const uniq = new Map<string, string>();
    for (const s of subjectsForFilters) uniq.set(s.id, s.name);
    return Array.from(uniq.entries()).map(([value, label]) => ({ value, label }));
  }, [subjectsForFilters]);

  // Ensure subject filter is valid after narrowing filters
  useEffect(() => {
    if (subjectId === 'ALL') return;
    const stillExists = subjectOptions.some((o) => o.value === subjectId);
    if (!stillExists) setSubjectId('ALL');
  }, [subjectOptions, subjectId]);

  const filteredSubjects = useMemo(() => {
    return subjectsForFilters.filter((s) => subjectId === 'ALL' || s.id === subjectId);
  }, [subjectsForFilters, subjectId]);

  const classNameById = useMemo(() => {
    const m = new Map(MOCK_CLASSES.map((c) => [c.id, c.name]));
    return (id: string) => m.get(id) || '—';
  }, []);

  const fallbackStatuses = useMemo(() => {
    return buildFallbackStatuses(allSubjects);
  }, [allSubjects]);

  const openBreakdown = (subj: SyllabusSubject) => {
    setActiveSubjectId(subj.id);
    setView('breakdown');
  };

  const activeSubject = useMemo(() => {
    const id = activeSubjectId || (filteredSubjects[0]?.id ?? null);
    return id ? allSubjects.find((s) => s.id === id) || null : null;
  }, [activeSubjectId, filteredSubjects]);

  const activeTopic = useMemo(() => {
    if (!activeSubject || !activeTopicId) return null;
    for (const u of activeSubject.units) {
      const found = u.topics.find((t) => t.id === activeTopicId);
      if (found) return found;
    }
    return null;
  }, [activeSubject, activeTopicId]);

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

  const submissionStatusForSubject = (subj: SyllabusSubject): SyllabusSubmission['status'] => {
    const key = getSubmissionKey({
      academicYearId: subj.academicYearId,
      termId: subj.termId,
      classId: subj.classId,
      subjectId: subj.id,
    });
    return submissions[key]?.status || 'DRAFT';
  };

  const headerRight = (
    <div className="flex items-center gap-3">
      {termEnded ? (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
          <span className="text-amber-700">{ICONS.Lock}</span>
          Term ended • Editing locked
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-900 text-xs font-medium">
          <span className="text-green-700">{ICONS.Check}</span>
          Term active • Editing enabled
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Syllabus</h1>
          <p className="text-slate-600 mt-1">
            Syllabus content is read-only. Only progress status and notes are editable.
          </p>
          <div className="mt-3">
            <SyllabusNav pathname="/teachers/syllabus" />
          </div>
        </div>
        {headerRight}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            label="Academic Year"
            value={academicYearId}
            onChange={(v) => setAcademicYearId(v)}
            options={MOCK_ACADEMIC_YEARS.map((y) => ({ value: y.id, label: y.name }))}
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
          />
          <SelectField
            label="Subject"
            value={subjectId}
            onChange={(v) => setSubjectId(v)}
            options={subjectOptions}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((k) => (
            <div key={k} className="bg-white rounded-lg shadow border border-slate-200 p-5 animate-pulse">
              <div className="h-5 w-2/3 bg-slate-200 rounded" />
              <div className="h-4 w-1/3 bg-slate-200 rounded mt-3" />
              <div className="h-2 w-full bg-slate-200 rounded mt-6" />
              <div className="h-3 w-1/2 bg-slate-200 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : view === 'overview' ? (
        filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
            <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.BookOpen}</div>
            <p className="text-lg font-semibold text-slate-900 mt-3">No syllabus found</p>
            <p className="text-sm text-slate-600 mt-1">Try changing Academic Year, Term, Class, or Subject filters.</p>
            <button
              type="button"
              onClick={() => (window.location.hash = '#/teachers/syllabus/create')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Subject Syllabus
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSubjects.map((s) => {
              const p = computeCoveragePercent(s, progress, fallbackStatuses);
              return (
                <SyllabusCard
                  key={s.id}
                  subject={s}
                  className={classNameById(s.classId)}
                  progress={p}
                  onOpen={() => openBreakdown(s)}
                />
              );
            })}
          </div>
        )
      ) : activeSubject ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setView('overview')}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {ICONS.ChevronLeft} Back to overview
            </button>

            <div className="hidden sm:block text-sm text-slate-600">
              Overall progress:{' '}
              <span className="font-semibold text-slate-900">
                {computeCoveragePercent(activeSubject, progress, fallbackStatuses).percent}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeSubject.name}</h2>
                <p className="text-slate-600 mt-1">{classNameById(activeSubject.classId)}</p>
              </div>
              <div className="w-full md:w-80">
                {(() => {
                  const p = computeCoveragePercent(activeSubject, progress, fallbackStatuses);
                  return <ProgressBar value={p.percent} label={`${p.completed}/${p.total} topics completed`} />;
                })()}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {activeSubject.units.map((u) => (
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
      ) : (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">Select a subject</p>
          <p className="text-sm text-slate-600 mt-1">Go back and pick a subject to view its syllabus.</p>
        </div>
      )}

      {activeSubject && activeTopic ? (
        <TopicDetailsModal
          subject={activeSubject}
          topic={activeTopic}
          progress={ensureProgressForTopic(activeTopic.id)}
          locked={termEnded || isEditingLockedBySubmission(submissionStatusForSubject(activeSubject))}
          lockMessage={getLockReason({ termEnded, submissionStatus: submissionStatusForSubject(activeSubject) })}
          onClose={() => setActiveTopicId(null)}
          onChangeStatus={(next) => updateTopicProgress(activeTopic.id, { status: next })}
          onChangeDateCovered={(next) => updateTopicProgress(activeTopic.id, { dateCovered: next })}
          onChangeNotes={(next) => updateTopicProgress(activeTopic.id, { notes: next })}
        />
      ) : null}

      {/* Small legend for status colors */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Legend:</span>
          <span className="inline-flex items-center gap-2"><StatusBadge status="NOT_STARTED" /> <span>Not started</span></span>
          <span className="inline-flex items-center gap-2"><StatusBadge status="IN_PROGRESS" /> <span>In progress</span></span>
          <span className="inline-flex items-center gap-2"><StatusBadge status="COMPLETED" /> <span>Completed</span></span>
        </div>
      </div>
    </div>
  );
}