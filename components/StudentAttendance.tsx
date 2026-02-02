'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/auth-context';
import { Student, StudentAttendance, AttendanceStatus, UserRole } from '../types';
import { ICONS } from '../constants';

interface StudentAttendanceProps {
  students?: Student[];
}

export default function StudentAttendanceView({ students: propStudents }: StudentAttendanceProps) {
  const { user } = useAuth();
  const isParent = user?.role === UserRole.PARENT;
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'ALL'>('ALL');

  useEffect(() => {
    // Mock data
    const mockChildren: Student[] = [
      {
        id: 'student001',
        admissionNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2008-05-15',
        gender: 'MALE',
        address: '123 Main St',
        phoneNumber: '+1234567890',
        emergencyContact: '+1234567891',
        parentId: 'parent001',
        classroomId: 'class001',
        isActive: true,
        enrolledAt: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockAttendances: StudentAttendance[] = [
      { id: 'att001', studentId: 'student001', date: '2024-01-15', status: AttendanceStatus.PRESENT, remarks: '' },
      { id: 'att002', studentId: 'student001', date: '2024-01-16', status: AttendanceStatus.PRESENT, remarks: '' },
      { id: 'att003', studentId: 'student001', date: '2024-01-17', status: AttendanceStatus.ABSENT, remarks: 'Medical leave' },
      { id: 'att004', studentId: 'student001', date: '2024-01-18', status: AttendanceStatus.PRESENT, remarks: '' },
      { id: 'att005', studentId: 'student001', date: '2024-01-19', status: AttendanceStatus.LATE, remarks: 'Late arrival' },
      { id: 'att006', studentId: 'student001', date: '2024-01-20', status: AttendanceStatus.PRESENT, remarks: '' },
    ];

    setTimeout(() => {
      if (isParent) {
        setChildren(mockChildren);
        setSelectedChildId(mockChildren[0]?.id || '');
      }
      setAttendances(mockAttendances);
      setLoading(false);
    }, 500);
  }, [isParent]);

  const filteredAttendances = useMemo(() => {
    let filtered = attendances;
    
    if (isParent && selectedChildId) {
      filtered = filtered.filter(att => att.studentId === selectedChildId);
    } else if (!isParent && user) {
      // For student view, filter by their own ID
      filtered = filtered.filter(att => att.studentId === user.studentId);
    }

    if (dateFilter) {
      filtered = filtered.filter(att => att.date === dateFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(att => att.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendances, selectedChildId, dateFilter, statusFilter, isParent, user]);

  const stats = useMemo(() => {
    const all = isParent && selectedChildId
      ? attendances.filter(att => att.studentId === selectedChildId)
      : attendances;
    return {
      total: all.length,
      present: all.filter(a => a.status === AttendanceStatus.PRESENT).length,
      absent: all.filter(a => a.status === AttendanceStatus.ABSENT).length,
      late: all.filter(a => a.status === AttendanceStatus.LATE).length,
      rate: all.length > 0 ? Math.round((all.filter(a => a.status === AttendanceStatus.PRESENT).length / all.length) * 100) : 0,
    };
  }, [attendances, selectedChildId, isParent]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'bg-green-100 text-green-800';
      case AttendanceStatus.ABSENT:
        return 'bg-red-100 text-red-800';
      case AttendanceStatus.LATE:
        return 'bg-yellow-100 text-yellow-800';
      case AttendanceStatus.PERMISSION:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isParent ? 'Child Attendance' : 'My Attendance'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isParent ? 'Track your child\'s attendance records' : 'View your attendance history'}
          </p>
        </div>
      </div>

      {/* Child Selection for Parents */}
      {isParent && children.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName} - {child.admissionNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
          <div className="text-sm text-slate-500">Total Days</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-700">Present</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{stats.present}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-sm text-red-700">Absent</div>
          <div className="text-2xl font-bold text-red-900 mt-1">{stats.absent}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-sm text-yellow-700">Late</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.late}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <div className="text-sm text-blue-700">Attendance Rate</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{stats.rate}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value={AttendanceStatus.PRESENT}>Present</option>
              <option value={AttendanceStatus.ABSENT}>Absent</option>
              <option value={AttendanceStatus.LATE}>Late</option>
              <option value={AttendanceStatus.PERMISSION}>Permission</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Attendance Records ({filteredAttendances.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((attendance) => {
                  const date = new Date(attendance.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                  
                  return (
                    <tr key={attendance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{dayName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendance.status)}`}>
                          {attendance.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {attendance.remarks || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
