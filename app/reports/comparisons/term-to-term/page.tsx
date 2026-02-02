'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface TermComparison {
  term: string;
  averageScore: number;
  passRate: number;
  totalStudents: number;
  improvement: number;
}

export default function TermToTermPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TermComparison[]>([]);

  useEffect(() => {
    const mockData: TermComparison[] = [
      {
        term: 'Term 1 2023',
        averageScore: 70.2,
        passRate: 75.0,
        totalStudents: 83,
        improvement: 0,
      },
      {
        term: 'Term 2 2023',
        averageScore: 74.5,
        passRate: 80.0,
        totalStudents: 83,
        improvement: 4.3,
      },
      {
        term: 'Term 3 2023',
        averageScore: 77.8,
        passRate: 84.4,
        totalStudents: 83,
        improvement: 3.3,
      },
      {
        term: 'Term 1 2024',
        averageScore: 81.2,
        passRate: 88.9,
        totalStudents: 83,
        improvement: 3.4,
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
          <h1 className="text-3xl font-bold text-gray-900">Term-to-Term Comparison</h1>
          <p className="text-gray-600 mt-1">Compare performance across academic terms</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Term Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.term} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.term}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.passRate.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.improvement > 0 && (
                      <span className="text-sm text-green-600 font-semibold">
                        +{item.improvement.toFixed(1)}%
                      </span>
                    )}
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
