'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../constants';
import { useAuth } from '../../lib/auth-context';
import { Link } from '../../lib/navigation';

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

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClassrooms: number;
  pendingApprovals: number;
  approvedResults: number;
  averagePerformance: number;
  attendanceRate: number;
  atRiskStudents: number;
}

const IMPORTED_RESULTS_KEY = 'importedExamResults';

export default function HeadMasterDashboardPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
    pendingApprovals: 0,
    approvedResults: 0,
    averagePerformance: 0,
    attendanceRate: 0,
    atRiskStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load imported results
    let mapped: ApprovalItem[] = [];
    try {
      const raw = localStorage.getItem(IMPORTED_RESULTS_KEY);
      const parsed = raw ? (JSON.parse(raw) as any[]) : [];
      mapped = parsed.map(item => ({
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

    // Mock dashboard statistics
    const mockStats: DashboardStats = {
      totalStudents: 1250,
      totalTeachers: 85,
      totalClassrooms: 42,
      pendingApprovals: mapped.filter(item => !item.isPublished).length,
      approvedResults: mapped.filter(item => item.isPublished).length,
      averagePerformance: 78.3,
      attendanceRate: 87.5,
      atRiskStudents: 15,
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  const pendingCount = useMemo(
    () => approvals.filter(item => !item.isPublished).length,
    [approvals]
  );

  const approvedCount = useMemo(
    () => approvals.filter(item => item.isPublished).length,
    [approvals]
  );

  const recentApprovals = useMemo(
    () => approvals.slice(0, 5).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [approvals]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Headmaster Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName || 'Headmaster'}! Here's your school overview and key metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/head-master/approvals/exam-results"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {ICONS.Check()} Review Approvals
          </Link>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2">
            {ICONS.Download()} Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Students()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Teaching Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTeachers}</p>
              <p className="text-xs text-gray-500 mt-1">Active teachers</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Teachers()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">Requires your review</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <div className="text-amber-600">{ICONS.Alert()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Performance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averagePerformance.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">School-wide average</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <div className="text-purple-600">{ICONS.Trophy()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.UserCheck()}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${stats.attendanceRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Results</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{approvedCount}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Check()}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">Results approved this term</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.atRiskStudents}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <div className="text-red-600">{ICONS.AlertTriangle()}</div>
            </div>
          </div>
          <Link
            href="/reports/risk/at-risk-students"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View Report →
          </Link>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600 mt-1">Frequently used tasks</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link
              href="/head-master/approvals/exam-results"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-lg mb-2">
                <div className="text-blue-600">{ICONS.Check()}</div>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Review Results</span>
            </Link>
            <Link
              href="/head-master/approvals/syllabus-submissions"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="p-3 bg-green-100 rounded-lg mb-2">
                <div className="text-green-600">{ICONS.Book()}</div>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Syllabus Review</span>
            </Link>
            <Link
              href="/reports/performance/best-worst-students"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="p-3 bg-purple-100 rounded-lg mb-2">
                <div className="text-purple-600">{ICONS.BarChart()}</div>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">View Reports</span>
            </Link>
            <Link
              href="/notifications/send"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <div className="p-3 bg-amber-100 rounded-lg mb-2">
                <div className="text-amber-600">{ICONS.Bell()}</div>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Send Notice</span>
            </Link>
          </div>
        </div>

        {/* Recent Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
              <p className="text-sm text-gray-600 mt-1">Latest results awaiting approval</p>
            </div>
            <Link
              href="/head-master/approvals/exam-results"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApprovals.length > 0 ? (
              recentApprovals.map(item => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.studentName}</h4>
                      <p className="text-sm text-gray-600">{item.admissionNumber} • {item.examTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Score: {item.score} ({item.grade})
                      </p>
                    </div>
                    <span
                      className={`ml-4 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.isPublished ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-2">{ICONS.Clipboard()}</div>
                <p>No submissions yet</p>
                <p className="text-xs mt-1">Results will appear here when teachers submit them</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Important Links */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/reports/risk/at-risk-students"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-red-100 rounded-lg">
              <div className="text-red-600">{ICONS.AlertTriangle()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">At-Risk Students</p>
              <p className="text-xs text-gray-600">Monitor struggling students</p>
            </div>
          </Link>
          <Link
            href="/reports/performance/best-worst-students"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Trophy()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Performance Reports</p>
              <p className="text-xs text-gray-600">View detailed analytics</p>
            </div>
          </Link>
          <Link
            href="/attendance/students"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.UserCheck()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Attendance Overview</p>
              <p className="text-xs text-gray-600">Check attendance rates</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
