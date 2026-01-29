'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../constants';
import { MOCK_SYLLABUS_SUBJECTS, MOCK_TERMS } from '../../teachers/syllabus/mock-data';
import { ProgressBar } from '../../teachers/syllabus/components/ProgressBar';
import type { SyllabusSubject } from '../../teachers/syllabus/types';
import {
  PROGRESS_KEY,
  SYLLABUS_SUBJECTS_KEY,
  buildFallbackStatuses,
  computeCoveragePercent,
  mergeSyllabusSubjects,
  useLocalStorageState,
} from '../../teachers/syllabus/lib';
import type { TopicProgressMap } from '../../teachers/syllabus/types';
import type { TeacherRemark, TeacherStudent } from './types';
import { TEACHER_REMARKS_KEY, TEACHER_STUDENTS_KEY, getTeacherAssignedSubjects, isTermEnded, readLocalStorage } from './lib';
import { RemarkModal } from './components/RemarkModal';
import { useToasts } from './components/ToastHost';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-900 mt-1">{value}</div>
    </div>
  );
}

export function TeacherStudentProfilePage({ studentId }: { studentId: string }) {
  const { ToastHost, pushToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [remarksByStudent, setRemarksByStudent] = useState<Record<string, TeacherRemark[]>>({});

  const teacherSubjects = useMemo(() => getTeacherAssignedSubjects(), []);

  // Use syllabus module data to display coverage
  const [progress] = useLocalStorageState<TopicProgressMap>(PROGRESS_KEY, {});
  const [createdSyllabusSubjects] = useLocalStorageState<SyllabusSubject[]>(SYLLABUS_SUBJECTS_KEY, []);
  const allSyllabusSubjects = useMemo(() => mergeSyllabusSubjects(MOCK_SYLLABUS_SUBJECTS as any, createdSyllabusSubjects), [createdSyllabusSubjects]);
  const fallbackStatuses = useMemo(() => buildFallbackStatuses(allSyllabusSubjects), [allSyllabusSubjects]);

  const [termId] = useState<string>('t2-2025-2026');
  const termEnded = useMemo(() => isTermEnded(MOCK_TERMS, termId), [termId]);
  const lockMessage = termEnded ? 'Term ended: remarks are read-only for this term.' : '';

  useEffect(() => {
    setLoading(true);
    const s = readLocalStorage<TeacherStudent[]>(TEACHER_STUDENTS_KEY, []);
    const r = readLocalStorage<Record<string, TeacherRemark[]>>(TEACHER_REMARKS_KEY, {});
    setStudents(s);
    setRemarksByStudent(r);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const student = useMemo(() => students.find((x) => x.id === studentId) || null, [students, studentId]);

  const taughtSubjects = useMemo(() => {
    if (!student) return [];
    const teacherSet = new Set(teacherSubjects.map((s) => s.toLowerCase()));
    return (student.subjects || []).filter((s) => teacherSet.has(s.toLowerCase()));
  }, [student, teacherSubjects]);

  const caAverage = useMemo(() => {
    if (!student || !student.caScores.length) return 0;
    const percents = student.caScores.map((s) => (s.total ? (s.score / s.total) * 100 : 0));
    return Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
  }, [student]);

  const syllabusProgress = useMemo(() => {
    if (!student) return [];
    // For each teacher subject, find syllabus subject matching class + name (any term/year in demo)
    return taughtSubjects.map((subjName) => {
      const syllabus = allSyllabusSubjects.find((s) => s.classId && student.className && s.name.toLowerCase() === subjName.toLowerCase());
      if (!syllabus) return { subject: subjName, percent: 0, completed: 0, total: 0 };
      const cov = computeCoveragePercent(syllabus as any, progress, fallbackStatuses);
      return { subject: subjName, ...cov };
    });
  }, [student, taughtSubjects, allSyllabusSubjects, progress, fallbackStatuses]);

  const [remarkOpen, setRemarkOpen] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-slate-200 p-8 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 rounded mt-3" />
        <div className="h-40 w-full bg-slate-200 rounded mt-6" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
        <div className="bg-white rounded-lg shadow border border-slate-200 p-8 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.User}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">Student not found</p>
          <button
            type="button"
            onClick={() => (window.location.hash = '#/teacher/students/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to My Students
          </button>
        </div>
      </div>
    );
  }

  const remarks = remarksByStudent[student.id] || [];

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => (window.location.hash = '#/teacher/students/list')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            {ICONS.ChevronLeft} Back to My Students
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Student Profile</h1>
          <p className="text-slate-600 mt-1">Personal data is read-only.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (termEnded) {
              pushToast({ tone: 'error', title: 'Read-only', message: lockMessage });
              return;
            }
            setRemarkOpen(true);
          }}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
        >
          Add Remark
        </button>
      </div>

      {termEnded ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-start gap-2">
          <span className="text-amber-700 mt-0.5">{ICONS.Lock}</span>
          <div>
            <div className="font-medium">Term ended</div>
            <div className="opacity-90">This page is read-only for the selected term (remarks disabled).</div>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={`https://picsum.photos/seed/${encodeURIComponent(student.id)}/64/64`}
            alt={`${student.firstName} ${student.lastName}`}
          />
          <div>
            <div className="text-xl font-semibold text-slate-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-slate-600">{student.admissionNumber}</div>
          </div>
          <div className="ml-auto">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Personal Info</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoRow label="Name" value={`${student.firstName} ${student.lastName}`} />
            <InfoRow label="Student ID" value={student.admissionNumber} />
            <InfoRow label="Gender" value={student.gender} />
            <InfoRow label="Date of birth" value={student.dateOfBirth} />
            <InfoRow label="Class" value={student.className} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Attendance Summary</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="text-xs text-green-800">Present</div>
              <div className="text-2xl font-bold text-green-900 mt-1">{student.attendance.present}</div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-xs text-red-800">Absent</div>
              <div className="text-2xl font-bold text-red-900 mt-1">{student.attendance.absent}</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            CA average: <span className="font-semibold text-slate-900">{caAverage}%</span>
          </div>
          <button
            type="button"
            onClick={() => (window.location.hash = `#/teacher/students/performance/${student.id}`)}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Performance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Academic Summary</h2>
        <div className="mt-2 text-sm text-slate-600">
          Subjects taught by you: <span className="font-medium text-slate-900">{taughtSubjects.join(', ') || '—'}</span>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-900">Syllabus Coverage</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabusProgress.length ? (
              syllabusProgress.map((s) => (
                <div key={s.subject} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900">{s.subject}</div>
                    <div className="text-xs text-slate-600">
                      {s.completed}/{s.total}
                    </div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={s.percent} label={`${s.percent}%`} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">No syllabus data available for the subjects you teach.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Teacher Remarks & Notes</h2>
          <span className="text-xs text-slate-500">Visible to admin (simulated)</span>
        </div>

        {remarks.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600">No remarks yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {remarks.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-lg p-4">
                <div className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</div>
                <div className="text-sm text-slate-900 mt-2 whitespace-pre-wrap">{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {remarkOpen ? (
        <RemarkModal
          studentName={`${student.firstName} ${student.lastName} • ${student.admissionNumber}`}
          locked={termEnded}
          lockMessage={lockMessage}
          onClose={() => setRemarkOpen(false)}
          onSave={(text) => {
            const next = {
              ...remarksByStudent,
              [student.id]: [
                { id: `remark-${Date.now()}`, studentId: student.id, text, createdAt: new Date().toISOString(), visibleToAdmin: true },
                ...(remarksByStudent[student.id] || []),
              ],
            };
            setRemarksByStudent(next);
            localStorage.setItem(TEACHER_REMARKS_KEY, JSON.stringify(next));
            pushToast({ tone: 'success', title: 'Remark added', message: 'Saved and visible to admin (simulated).' });
            setRemarkOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

