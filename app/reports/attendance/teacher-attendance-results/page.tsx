'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface TeacherAttendanceResult {
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  teacherAttendance: number;
  studentAverageScore: number;
  correlation: number;
  status: 'strong' | 'moderate' | 'weak';
}

export default function TeacherAttendanceResultsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeacherAttendanceResult[]>([]);

  useEffect(() => {
    const mockData: TeacherAttendanceResult[] = [
      {
        teacherId: 't001',
        teacherName: 'Sarah Johnson',
        subjectName: 'Mathematics',
        className: 'Grade 10A',
        teacherAttendance: 98.5,
        studentAverageScore: 85.5,
        correlation: 0.87,
        status: 'strong',
      },
      {
        teacherId: 't002',
        teacherName: 'Michael Brown',
        subjectName: 'Physics',
        className: 'Grade 11B',
        teacherAttendance: 82.3,
        studentAverageScore: 62.8,
        correlation: 0.76,
        status: 'moderate',
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Attendance vs Student Results</h1>
          <p className="text-gray-600 mt-1">Analyze impact of teacher attendance on student performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Teacher Attendance-Results Correlation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.teacherId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.teacherAttendance.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.studentAverageScore.toFixed(1)}%</td>
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
