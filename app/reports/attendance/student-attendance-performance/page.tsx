'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface AttendancePerformance {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  attendanceRate: number;
  averageScore: number;
  correlation: number;
  status: 'strong' | 'moderate' | 'weak';
}

export default function StudentAttendancePerformancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AttendancePerformance[]>([]);

  useEffect(() => {
    const mockData: AttendancePerformance[] = [
      {
        studentId: 's001',
        studentName: 'John Doe',
        admissionNumber: 'STU001',
        className: 'Grade 10A',
        attendanceRate: 95.5,
        averageScore: 92.5,
        correlation: 0.97,
        status: 'strong',
      },
      {
        studentId: 's002',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        attendanceRate: 68.2,
        averageScore: 38.7,
        correlation: 0.57,
        status: 'weak',
      },
    ];

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Student Attendance vs Performance</h1>
          <p className="text-gray-600 mt-1">Analyze correlation between attendance and academic performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Attendance-Performance Correlation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.attendanceRate.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.correlation.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
