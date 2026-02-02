'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface SchoolTarget {
  targetId: string;
  targetName: string;
  targetValue: number;
  currentValue: number;
  achievement: number;
  status: 'achieved' | 'on-track' | 'at-risk';
}

export default function SchoolWideTargetsPage() {
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<SchoolTarget[]>([]);

  useEffect(() => {
    const mockData: SchoolTarget[] = [
      {
        targetId: 't001',
        targetName: 'Overall Pass Rate',
        targetValue: 80,
        currentValue: 85.2,
        achievement: 106.5,
        status: 'achieved',
      },
      {
        targetId: 't002',
        targetName: 'Average Score',
        targetValue: 75,
        currentValue: 78.5,
        achievement: 104.7,
        status: 'achieved',
      },
      {
        targetId: 't003',
        targetName: 'Student Attendance',
        targetValue: 90,
        currentValue: 88.3,
        achievement: 98.1,
        status: 'on-track',
      },
    ];

    setTimeout(() => {
      setTargets(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">School-Wide Target Achievement</h1>
          <p className="text-gray-600 mt-1">Monitor overall school performance targets</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Target Achievement Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {targets.map((target) => (
                <tr key={target.targetId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{target.targetName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.targetValue}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.currentValue.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.achievement.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(target.status)}`}>
                      {target.status.replace('-', ' ').toUpperCase()}
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
