'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface ClassTrendData {
  term: string;
  className: string;
  averageScore: number;
  passRate: number;
  totalStudents: number;
}

export default function ClassPerformanceTrendPage() {
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [trendData, setTrendData] = useState<ClassTrendData[]>([]);

  useEffect(() => {
    const mockData: ClassTrendData[] = [
      { term: 'Term 1 2023', className: 'Grade 10A', averageScore: 70.2, passRate: 75.0, totalStudents: 45 },
      { term: 'Term 2 2023', className: 'Grade 10A', averageScore: 74.5, passRate: 80.0, totalStudents: 45 },
      { term: 'Term 3 2023', className: 'Grade 10A', averageScore: 77.8, passRate: 84.4, totalStudents: 45 },
      { term: 'Term 1 2024', className: 'Grade 10A', averageScore: 81.2, passRate: 88.9, totalStudents: 45 },
      { term: 'Term 1 2023', className: 'Grade 11B', averageScore: 68.5, passRate: 72.0, totalStudents: 38 },
      { term: 'Term 2 2023', className: 'Grade 11B', averageScore: 71.2, passRate: 76.3, totalStudents: 38 },
      { term: 'Term 3 2023', className: 'Grade 11B', averageScore: 73.8, passRate: 78.9, totalStudents: 38 },
      { term: 'Term 1 2024', className: 'Grade 11B', averageScore: 75.5, passRate: 81.6, totalStudents: 38 },
    ];

    setTimeout(() => {
      setTrendData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = selectedClass === 'ALL' 
    ? trendData 
    : trendData.filter(d => d.className === selectedClass);

  const groupedData = filteredData.reduce((acc, data) => {
    if (!acc[data.className]) acc[data.className] = [];
    acc[data.className].push(data);
    return acc;
  }, {} as Record<string, ClassTrendData[]>);

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
          <h1 className="text-3xl font-bold text-gray-900">Class Performance Trend</h1>
          <p className="text-gray-600 mt-1">Compare class performance across multiple terms</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Classes</option>
              <option value="Grade 10A">Grade 10A</option>
              <option value="Grade 11B">Grade 11B</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trend Chart</h3>
        <div className="h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <ICONS.LineChart className="mx-auto mb-2" />
            <p>Multi-class trend comparison chart</p>
            <p className="text-sm mt-2">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      {Object.entries(groupedData).map(([className, data]) => (
        <div key={className} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{className} - Historical Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => {
                  const previousScore = index > 0 ? data[index - 1].averageScore : null;
                  const change = previousScore ? item.averageScore - previousScore : 0;
                  return (
                    <tr key={item.term} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.term}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.averageScore.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.passRate.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalStudents}</td>
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
      ))}
    </div>
  );
}
