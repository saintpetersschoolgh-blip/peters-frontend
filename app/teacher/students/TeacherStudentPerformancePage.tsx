'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../constants';
import type { TeacherStudent } from './types';
import { TEACHER_STUDENTS_KEY, readLocalStorage } from './lib';

function scorePercent(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: 'good' | 'mid' | 'bad' }) {
  const cls =
    tone === 'good'
      ? 'bg-green-50 border-green-200 text-green-900'
      : tone === 'bad'
        ? 'bg-red-50 border-red-200 text-red-900'
        : 'bg-slate-50 border-slate-200 text-slate-900';
  return (
    <div className={`border rounded-lg p-4 ${cls}`}>
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export function TeacherStudentPerformancePage({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<TeacherStudent[]>([]);

  useEffect(() => {
    setLoading(true);
    const s = readLocalStorage<TeacherStudent[]>(TEACHER_STUDENTS_KEY, []);
    setStudents(s);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const student = useMemo(() => students.find((x) => x.id === studentId) || null, [students, studentId]);

  const caItems = useMemo(() => (student ? student.caScores : []), [student]);
  const examItems = useMemo(() => (student ? student.examScores : []), [student]);

  const caAvg = useMemo(() => {
    if (!caItems.length) return 0;
    const avg = caItems.reduce((sum, s) => sum + scorePercent(s.score, s.total), 0) / caItems.length;
    return Math.round(avg);
  }, [caItems]);

  const examAvg = useMemo(() => {
    if (!examItems.length) return 0;
    const avg = examItems.reduce((sum, s) => sum + scorePercent(s.score, s.total), 0) / examItems.length;
    return Math.round(avg);
  }, [examItems]);

  const toneFor = (p: number): 'good' | 'mid' | 'bad' => (p >= 75 ? 'good' : p >= 55 ? 'mid' : 'bad');

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
        <h1 className="text-2xl font-bold text-slate-900">Student Performance</h1>
        <div className="bg-white rounded-lg shadow border border-slate-200 p-8 text-center">
          <div className="text-slate-400 mx-auto w-12 h-12 flex items-center justify-center">{ICONS.Trophy}</div>
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

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => (window.location.hash = `#/teacher/students/profile/${student.id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          {ICONS.ChevronLeft} Back to Profile
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">Student Performance</h1>
        <p className="text-slate-600 mt-1">
          {student.firstName} {student.lastName} • {student.admissionNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Continuous Assessment Avg" value={`${caAvg}%`} tone={toneFor(caAvg)} />
        <StatCard label="Exam Avg" value={`${examAvg}%`} tone={toneFor(examAvg)} />
        <StatCard
          label="Overall Trend"
          value={caAvg >= examAvg ? 'Improving' : 'Needs support'}
          tone={caAvg >= examAvg ? 'good' : 'mid'}
        />
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Performance Trend</h2>
        <p className="text-sm text-slate-600 mt-1">Chart placeholder (UI only)</p>
        <div className="mt-4 h-40 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500">
          Trend chart placeholder
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">CA Scores</h2>
        <p className="text-sm text-slate-600 mt-1">Quizzes, assignments, and tests (read-only)</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {caItems.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{it.kind}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{it.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{it.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {it.score}/{it.total}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{scorePercent(it.score, it.total)}%</td>
                </tr>
              ))}
              {caItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-600">
                    No CA scores available (mock).
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Exam Scores</h2>
        <p className="text-sm text-slate-600 mt-1">Mock exam scores (read-only)</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {examItems.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{it.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{it.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {it.score}/{it.total}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{scorePercent(it.score, it.total)}%</td>
                </tr>
              ))}
              {examItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-600">
                    No exam scores available (mock).
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

