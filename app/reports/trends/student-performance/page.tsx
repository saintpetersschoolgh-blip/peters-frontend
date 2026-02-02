'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface StudentTrendData {
  term: string;
  averageScore: number;
  rank: number;
  totalSubjects: number;
}

export default function StudentPerformanceTrendPage() {
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('John Doe (STU001)');
  const [trendData, setTrendData] = useState<StudentTrendData[]>([]);

  useEffect(() => {
    const mockData: StudentTrendData[] = [
      { term: 'Term 1 2023', averageScore: 68.5, rank: 15, totalSubjects: 8 },
      { term: 'Term 2 2023', averageScore: 72.3, rank: 12, totalSubjects: 8 },
      { term: 'Term 3 2023', averageScore: 75.8, rank: 8, totalSubjects: 8 },
      { term: 'Term 1 2024', averageScore: 82.5, rank: 3, totalSubjects: 8 },
    ];

    setTimeout(() => {
      setTrendData(mockData);
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
          <h1 className="text-3xl font-bold text-gray-900">Student Performance Trend</h1>
          <p className="text-gray-600 mt-1">Track individual student growth over time</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="John Doe (STU001)">John Doe (STU001)</option>
              <option value="Alice Smith (STU002)">Alice Smith (STU002)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trend Chart</h3>
        <div className="h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <ICONS.LineChart className="mx-auto mb-2" />
            <p>Trend chart for {selectedStudent}</p>
            <p className="text-sm mt-2">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Historical Performance Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trendData.map((data, index) => {
                const previousScore = index > 0 ? trendData[index - 1].averageScore : null;
                const change = previousScore ? data.averageScore - previousScore : 0;
                return (
                  <tr key={data.term} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.term}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.averageScore.toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{data.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.totalSubjects}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {previousScore && (
                        <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
