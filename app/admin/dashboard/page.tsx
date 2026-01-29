'use client';
import React, { useState, useEffect } from 'react';
import { DashboardStats, Alert, Activity, PerformanceFlag, StudentAnalytics, ClassroomAnalytics } from '../../../types';
import { ICONS } from '../../../constants';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
    totalSubjects: 0,
    attendanceRate: 0,
    averagePerformance: 0,
    totalFees: 0,
    pendingPayments: 0,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [riskFlags, setRiskFlags] = useState<PerformanceFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for admin dashboard
    const mockStats: DashboardStats = {
      totalStudents: 1250,
      totalTeachers: 85,
      totalClassrooms: 42,
      totalSubjects: 156,
      attendanceRate: 87.5,
      averagePerformance: 78.3,
      totalFees: 1250000,
      pendingPayments: 156000,
    };

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'WARNING',
        title: 'High Absentee Rate',
        message: 'Grade 10A has 15% absentee rate this week',
        actionUrl: '/attendance/students',
        actionLabel: 'View Details',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'ERROR',
        title: 'Payment Overdue',
        message: '25 students have overdue fee payments',
        actionUrl: '/finance/payments',
        actionLabel: 'Review Payments',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'SUCCESS',
        title: 'Exam Results Published',
        message: 'Mathematics mid-term results are now available',
        createdAt: new Date().toISOString(),
      },
    ];

    const mockActivity: Activity[] = [
      {
        id: '1',
        type: 'EXAM_CREATED',
        description: 'New Physics exam created for Grade 11B',
        userId: 'teacher001',
        user: { firstName: 'Sarah', lastName: 'Johnson', role: 'TEACHER' },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: '2',
        type: 'PAYMENT_RECEIVED',
        description: 'Fee payment received from John Doe',
        userId: 'admin001',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '3',
        type: 'ATTENDANCE_MARKED',
        description: 'Grade 10A attendance marked by Class Master',
        userId: 'teacher002',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
    ];

    const mockRiskFlags: PerformanceFlag[] = [
      {
        id: '1',
        type: 'ACADEMIC',
        severity: 'HIGH',
        title: 'Critical Performance Decline',
        description: '5 students showing significant performance drop',
        entityType: 'STUDENT',
        entityId: 'student001',
        status: 'ACTIVE',
        raisedById: 'system',
        priority: 9,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'ATTENDANCE',
        severity: 'MEDIUM',
        title: 'Chronic Absenteeism',
        description: 'Grade 9C has 12 students with >20% absence rate',
        entityType: 'CLASSROOM',
        entityId: 'class001',
        status: 'ACTIVE',
        raisedById: 'system',
        priority: 7,
        createdAt: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setStats(mockStats);
      setAlerts(mockAlerts);
      setRecentActivity(mockActivity);
      setRiskFlags(mockRiskFlags);
      setLoading(false);
    }, 1000);
  }, []);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'WARNING': return '⚠️';
      case 'ERROR': return '🚨';
      case 'SUCCESS': return '✅';
      default: return 'ℹ️';
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'WARNING': return 'border-yellow-200 bg-yellow-50';
      case 'ERROR': return 'border-red-200 bg-red-50';
      case 'SUCCESS': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'EXAM_CREATED': return '📝';
      case 'PAYMENT_RECEIVED': return '💰';
      case 'ATTENDANCE_MARKED': return '✅';
      default: return '📋';
    }
  };

  const getFlagSeverityColor = (severity: PerformanceFlag['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-300 bg-red-50 text-red-800';
      case 'HIGH': return 'border-orange-300 bg-orange-50 text-orange-800';
      case 'MEDIUM': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      case 'LOW': return 'border-blue-300 bg-blue-50 text-blue-800';
      default: return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
          <p className="text-gray-600 mt-1">School-wide analytics and system monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Generate KPI Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Students}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Teachers}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <div className="text-purple-600">{ICONS.LayoutGrid}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classrooms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClassrooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <div className="text-orange-600">{ICONS.CreditCard}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">GH₵ {stats.pendingPayments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="font-semibold">{stats.averagePerformance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${stats.averagePerformance}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Rate</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall Attendance</span>
              <span className="font-semibold">{stats.attendanceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${stats.attendanceRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Risk Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 ${getAlertColor(alert.type)} border-l-4 ${
                alert.type === 'WARNING' ? 'border-l-yellow-400' :
                alert.type === 'ERROR' ? 'border-l-red-400' :
                alert.type === 'SUCCESS' ? 'border-l-green-400' : 'border-l-blue-400'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.actionLabel && (
                      <button className="text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium">
                        {alert.actionLabel} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Flags */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Risk Flags</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {riskFlags.map((flag) => (
              <div key={flag.id} className={`p-4 ${getFlagSeverityColor(flag.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{flag.title}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        flag.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        flag.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        flag.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{flag.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                      <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}