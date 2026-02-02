'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface VarianceData {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  caAverage: number;
  examAverage: number;
  variance: number;
  status: 'normal' | 'inflated' | 'deflated';
}

export default function CAVsExamVariancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VarianceData[]>([]);

  useEffect(() => {
    const mockData: VarianceData[] = [
      {
        subjectId: 'sub001',
        subjectName: 'Mathematics',
        teacherName: 'Sarah Johnson',
        caAverage: 88.5,
        examAverage: 85.5,
        variance: 3.0,
        status: 'normal',
      },
      {
        subjectId: 'sub002',
        subjectName: 'English Language',
        teacherName: 'David Lee',
        caAverage: 85.0,
        examAverage: 78.2,
        variance: 6.8,
        status: 'inflated',
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
          <h1 className="text-3xl font-bold text-gray-900">CA vs Exam Variance Report</h1>
          <p className="text-gray-600 mt-1">Detect over-inflated CA scores</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Variance Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.subjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.caAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.examAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${item.variance > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.variance >= 0 ? '+' : ''}{item.variance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'normal' ? 'bg-green-100 text-green-800' :
                      item.status === 'inflated' ? 'bg-red-100 text-red-800' :
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
