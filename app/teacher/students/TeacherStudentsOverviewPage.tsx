'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../constants';
import { MOCK_ACADEMIC_YEARS, MOCK_CLASSES, MOCK_TERMS } from '../../teachers/syllabus/mock-data';
import { StudentCardGrid } from './components/StudentCardGrid';
import { RemarkModal } from './components/RemarkModal';
import { StudentTable } from './components/StudentTable';
import { useToasts } from './components/ToastHost';
import type { TeacherRemark, TeacherStudent } from './types';
import {
  TEACHER_REMARKS_KEY,
  TEACHER_STUDENTS_KEY,
  addRemark,
  getTeacherAssignedClasses,
  getTeacherAssignedSubjects,
  isStudentVisibleToTeacher,
  isTermEnded,
  migrateOldMyStudentsIfNeeded,
  readLocalStorage,
  seedTeacherStudents,
  writeLocalStorage,
} from './lib';

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

export function TeacherStudentsOverviewPage() {
  const { ToastHost, pushToast } = useToasts();
  const [loading, setLoading] = useState(true);

  const teacherClasses = useMemo(() => getTeacherAssignedClasses(), []);
  const teacherSubjects = useMemo(() => getTeacherAssignedSubjects(), []);

  // filters
  const [academicYearId, setAcademicYearId] = useState<string>('ay-2025-2026');
  const [termId, setTermId] = useState<string>('t2-2025-2026');
  const [className, setClassName] = useState<string>('ALL');
  const [subjectName, setSubjectName] = useState<string>('ALL');

  const termEnded = useMemo(() => isTermEnded(MOCK_TERMS, termId), [termId]);

  // Seed/migrate + load
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [remarksByStudent, setRemarksByStudent] = useState<Record<string, TeacherRemark[]>>({});

  useEffect(() => {
    migrateOldMyStudentsIfNeeded();

    const existing = readLocalStorage<TeacherStudent[] | null>(TEACHER_STUDENTS_KEY, null as any);
    const shouldSeed = !Array.isArray(existing) || existing.length === 0;
    const seeded = shouldSeed ? seedTeacherStudents(teacherClasses, teacherSubjects) : existing;
    if (shouldSeed) writeLocalStorage(TEACHER_STUDENTS_KEY, seeded);
    setStudents(seeded);

    const remarks = readLocalStorage<Record<string, TeacherRemark[]>>(TEACHER_REMARKS_KEY, {});
    setRemarksByStudent(remarks);

    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [teacherClasses, teacherSubjects]);

  const visibleStudents = useMemo(() => {
    const filtered = students.filter((s) => isStudentVisibleToTeacher(s, teacherClasses, teacherSubjects));
    return filtered;
  }, [students, teacherClasses, teacherSubjects]);

  const filteredRows = useMemo(() => {
    return visibleStudents
      .filter((s) => className === 'ALL' || s.className === className)
      .filter((s) => {
        if (subjectName === 'ALL') return true;
        const teacherSubjectList = (s.subjects || []).filter((sub) => teacherSubjects.map((x) => x.toLowerCase()).includes(sub.toLowerCase()));
        return teacherSubjectList.map((x) => x.toLowerCase()).includes(subjectName.toLowerCase());
      })
      .map((student) => {
        const taught = (student.subjects || []).filter((sub) => teacherSubjects.map((x) => x.toLowerCase()).includes(sub.toLowerCase()));
        return { student, teacherSubjects: taught };
      });
  }, [visibleStudents, className, subjectName, teacherSubjects]);

  const noClassAssigned = teacherClasses.length === 0 || teacherSubjects.length === 0;

  const [remarkStudentId, setRemarkStudentId] = useState<string | null>(null);
  const remarkStudent = useMemo(() => {
    if (!remarkStudentId) return null;
    return students.find((s) => s.id === remarkStudentId) || null;
  }, [students, remarkStudentId]);

  const openProfile = (id: string) => (window.location.hash = `#/teacher/students/profile/${id}`);
  const openPerformance = (id: string) => (window.location.hash = `#/teacher/students/performance/${id}`);

  const lockMessage = termEnded ? 'Term ended: remarks are read-only for this term.' : '';

  return (
    <div className="space-y-6">
      <ToastHost />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Students</h1>
          <p className="text-slate-600 mt-1">Only students in your assigned class/subjects are shown.</p>
        </div>
      </div>

      {termEnded ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex items-start gap-2">
          <span className="text-amber-700 mt-0.5">{ICONS.Lock}</span>
          <div>
            <div className="font-medium">Term ended</div>
            <div className="opacity-90">This module is read-only for the selected term (remarks disabled).</div>
          </div>
        </div>
      ) : null}

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
            options={MOCK_TERMS.filter((t) => t.academicYearId === academicYearId).map((t) => ({
              value: t.id,
              label: `${t.name}${t.ended ? ' (Ended)' : ''}`,
            }))}
            placeholder="Select term"
          />
          <SelectField
            label="Class"
            value={className}
            onChange={setClassName}
            options={Array.from(new Set(teacherClasses)).map((c) => ({ value: c, label: c }))}
            placeholder={teacherClasses.length ? 'All my classes' : 'No class assigned'}
          />
          <SelectField
            label="Subject"
            value={subjectName}
            onChange={setSubjectName}
            options={Array.from(new Set(teacherSubjects)).map((s) => ({ value: s, label: s }))}
            placeholder={teacherSubjects.length ? 'All my subjects' : 'No subject assigned'}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-8 animate-pulse">
          <div className="h-5 w-1/3 bg-slate-200 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 rounded mt-3" />
          <div className="h-32 w-full bg-slate-200 rounded mt-6" />
        </div>
      ) : noClassAssigned ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.Users}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">No class/subject assigned</p>
          <p className="text-sm text-slate-600 mt-1">
            Your account has no class/subject assigned yet. Please contact the administrator to assign you to a class and subject.
          </p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-10 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.Search}</div>
          <p className="text-lg font-semibold text-slate-900 mt-3">Empty student list</p>
          <p className="text-sm text-slate-600 mt-1">No students matched your filters for your assigned classes/subjects.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <StudentTable
              rows={filteredRows}
              onViewProfile={openProfile}
              onViewPerformance={openPerformance}
              onAddRemark={(id) => {
                if (termEnded) {
                  pushToast({ tone: 'error', title: 'Read-only', message: lockMessage });
                  return;
                }
                setRemarkStudentId(id);
              }}
            />
          </div>
          {/* Mobile cards */}
          <div className="md:hidden">
            <StudentCardGrid
              rows={filteredRows}
              onViewProfile={openProfile}
              onViewPerformance={openPerformance}
              onAddRemark={(id) => {
                if (termEnded) {
                  pushToast({ tone: 'error', title: 'Read-only', message: lockMessage });
                  return;
                }
                setRemarkStudentId(id);
              }}
            />
          </div>
        </>
      )}

      {remarkStudent ? (
        <RemarkModal
          studentName={`${remarkStudent.firstName} ${remarkStudent.lastName} • ${remarkStudent.admissionNumber}`}
          locked={termEnded}
          lockMessage={lockMessage}
          onClose={() => setRemarkStudentId(null)}
          onSave={(text) => {
            const next = addRemark(remarksByStudent, remarkStudent.id, text);
            setRemarksByStudent(next);
            writeLocalStorage(TEACHER_REMARKS_KEY, next);
            pushToast({ tone: 'success', title: 'Remark added', message: 'Saved and visible to admin (simulated).' });
            setRemarkStudentId(null);
          }}
        />
      ) : null}
    </div>
  );
}

