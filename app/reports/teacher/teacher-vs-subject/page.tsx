'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface TeacherSubjectComparison {
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  teacherAverage: number;
  subjectAverage: number;
  difference: number;
  performance: 'above' | 'below' | 'equal';
}

export default function TeacherVsSubjectPage() {
  const [loading, setLoading] = useState(true);
  const [comparisons, setComparisons] = useState<TeacherSubjectComparison[]>([]);

  useEffect(() => {
    const mockData: TeacherSubjectComparison[] = [
      {
        teacherId: 't001',
        teacherName: 'Sarah Johnson',
        subjectName: 'Mathematics',
        className: 'Grade 10A',
        teacherAverage: 85.5,
        subjectAverage: 82.0,
        difference: 3.5,
        performance: 'above',
      },
      {
        teacherId: 't002',
        teacherName: 'David Lee',
        subjectName: 'English Language',
        className: 'Grade 10A',
        teacherAverage: 78.2,
        subjectAverage: 80.5,
        difference: -2.3,
        performance: 'below',
      },
    ];

    setTimeout(() => {
      setComparisons(mockData);
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher vs Subject Performance</h1>
          <p className="text-gray-600 mt-1">Compare individual teacher performance against subject average</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisons.map((comp) => (
                <tr key={comp.teacherId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.teacherAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.subjectAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${comp.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comp.difference >= 0 ? '+' : ''}{comp.difference.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      comp.performance === 'above' ? 'bg-green-100 text-green-800' :
                      comp.performance === 'below' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {comp.performance.toUpperCase()}
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
