'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../constants';

type ApprovalItem = {
  id: string;
  studentName: string;
  admissionNumber: string;
  examTitle: string;
  score: number;
  grade: string;
  isPublished: boolean;
  updatedAt: string;
};

const IMPORTED_RESULTS_KEY = 'importedExamResults';

export default function HeadMasterDashboardPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMPORTED_RESULTS_KEY);
      const parsed = raw ? (JSON.parse(raw) as any[]) : [];
      const mapped = parsed.map(item => ({
        id: String(item.id),
        studentName: `${item.student?.firstName ?? ''} ${item.student?.lastName ?? ''}`.trim(),
        admissionNumber: item.student?.admissionNumber ?? '—',
        examTitle: item.exam?.title ?? 'Exam',
        score: item.score ?? 0,
        grade: item.grade ?? '—',
        isPublished: Boolean(item.isPublished),
        updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
      }));
      setApprovals(mapped);
    } catch {
      setApprovals([]);
    }
  }, []);

  const pendingCount = useMemo(
    () => approvals.filter(item => !item.isPublished).length,
    [approvals]
  );

  const approvedCount = useMemo(
    () => approvals.filter(item => item.isPublished).length,
    [approvals]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Headmaster Dashboard</h1>
          <p className="text-gray-600 mt-1">Approval queue and school overview</p>
        </div>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-700">{ICONS.Alert}</span>
            <div>
              <p className="text-sm text-gray-500">Pending approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-green-100 text-green-700">{ICONS.Check}</span>
            <div>
              <p className="text-sm text-gray-500">Approved results</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">{ICONS.Clipboard}</span>
            <div>
              <p className="text-sm text-gray-500">Total submissions</p>
              <p className="text-2xl font-semibold text-gray-900">{approvals.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvals.slice(0, 6).map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.studentName || 'Student'}
                    <div className="text-xs text-gray-500">{item.admissionNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.examTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.score} ({item.grade})
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.isPublished ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No submitted results yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
