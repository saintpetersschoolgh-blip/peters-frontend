import React from 'react';
import { ICONS } from '../../../../constants';
import type { TeacherStudent } from '../types';

export function StudentTable({
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject(s)
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
            {rows.map(({ student, teacherSubjects }) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`https://picsum.photos/seed/${encodeURIComponent(student.id)}/40/40`}
                        alt={`${student.firstName} ${student.lastName}`}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{student.attendance.present} present</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.admissionNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.className}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="max-w-[260px] truncate" title={teacherSubjects.join(', ')}>
                    {teacherSubjects.join(', ') || '—'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => onViewProfile(student.id)} className="text-blue-600 hover:text-blue-900">
                      View Profile
                    </button>
                    <button onClick={() => onViewPerformance(student.id)} className="text-indigo-600 hover:text-indigo-900">
                      View Performance
                    </button>
                    <button onClick={() => onAddRemark(student.id)} className="text-gray-700 hover:text-gray-900">
                      Add Remark
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-gray-500" colSpan={7}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-gray-400">{ICONS.Users}</div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">No students found</p>
                      <p className="text-sm text-gray-500 mt-1">Try changing filters.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

