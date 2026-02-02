'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface TeacherLoadData {
  teacherId: string;
  teacherName: string;
  subjectsCount: number;
  classesCount: number;
  totalStudents: number;
  averageScore: number;
  efficiency: number;
  status: 'efficient' | 'overloaded' | 'underutilized';
}

export default function TeacherLoadPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeacherLoadData[]>([]);

  useEffect(() => {
    const mockData: TeacherLoadData[] = [
      {
        teacherId: 't001',
        teacherName: 'Sarah Johnson',
        subjectsCount: 2,
        classesCount: 3,
        totalStudents: 120,
        averageScore: 85.5,
        efficiency: 0.71,
        status: 'efficient',
      },
      {
        teacherId: 't002',
        teacherName: 'Michael Brown',
        subjectsCount: 3,
        classesCount: 4,
        totalStudents: 150,
        averageScore: 62.8,
        efficiency: 0.42,
        status: 'overloaded',
      },
    ];

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Load vs Performance</h1>
          <p className="text-gray-600 mt-1">Analyze subjects/classes handled vs outcomes</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Load vs Performance Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.teacherId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.subjectsCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.classesCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(item.efficiency * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'efficient' ? 'bg-green-100 text-green-800' :
                      item.status === 'overloaded' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
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
