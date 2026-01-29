import React from 'react';
import type { TeacherStudent } from '../types';

export function StudentCardGrid({
  rows,
  onViewProfile,
  onViewPerformance,
  onAddRemark,
}: {
  rows: Array<{ student: TeacherStudent; teacherSubjects: string[] }>;
  onViewProfile: (id: string) => void;
  onViewPerformance: (id: string) => void;
  onAddRemark: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rows.map(({ student, teacherSubjects }) => (
        <div key={student.id} className="bg-white rounded-lg shadow border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                src={`https://picsum.photos/seed/${encodeURIComponent(student.id)}/48/48`}
                alt={`${student.firstName} ${student.lastName}`}
              />
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">
                  {student.firstName} {student.lastName}
                </div>
                <div className="text-sm text-slate-600">{student.admissionNumber}</div>
              </div>
            </div>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {student.status}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-500">Gender</div>
              <div className="text-slate-900 font-medium">{student.gender}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Class</div>
              <div className="text-slate-900 font-medium">{student.className}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-slate-500">Subject(s) you teach</div>
              <div className="text-slate-900 font-medium truncate" title={teacherSubjects.join(', ')}>
                {teacherSubjects.join(', ') || '—'}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onViewProfile(student.id)}
              className="px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={() => onViewPerformance(student.id)}
              className="px-3 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
            >
              View Performance
            </button>
            <button
              type="button"
              onClick={() => onAddRemark(student.id)}
              className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
            >
              Add Remark
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

