'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface TeacherTarget {
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  termlyTarget: number;
  currentForecast: number;
  achievement: number;
  status: 'on-track' | 'at-risk' | 'exceeding';
  gap: number;
}

export default function TeacherTargetsPage() {
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<TeacherTarget[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [filterStatus, setFilterStatus] = useState<'all' | 'on-track' | 'at-risk' | 'exceeding'>('all');

  useEffect(() => {
    const mockTargets: TeacherTarget[] = [
      {
        teacherId: 't001',
        teacherName: 'Sarah Johnson',
        subjectName: 'Mathematics',
        className: 'Grade 10A',
        termlyTarget: 80,
        currentForecast: 85.5,
        achievement: 106.9,
        status: 'exceeding',
        gap: 5.5,
      },
      {
        teacherId: 't002',
        teacherName: 'David Lee',
        subjectName: 'English Language',
        className: 'Grade 10A',
        termlyTarget: 75,
        currentForecast: 78.2,
        achievement: 104.3,
        status: 'on-track',
        gap: 3.2,
      },
      {
        teacherId: 't003',
        teacherName: 'Michael Brown',
        subjectName: 'Physics',
        className: 'Grade 11B',
        termlyTarget: 70,
        currentForecast: 65.2,
        achievement: 93.1,
        status: 'at-risk',
        gap: -4.8,
      },
    ];

    setTimeout(() => {
      setTargets(mockTargets);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTargets = useMemo(() => {
    if (filterStatus === 'all') return targets;
    return targets.filter(t => t.status === filterStatus);
  }, [targets, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeding': return 'bg-green-100 text-green-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Target Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor teacher performance against termly targets</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="exceeding">Exceeding</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Teacher Target Achievement</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termly Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Forecast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTargets.map((target) => (
                <tr key={target.teacherId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{target.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.termlyTarget}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.currentForecast.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{target.achievement.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${target.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {target.gap >= 0 ? '+' : ''}{target.gap.toFixed(1)}%
                    </span>
                  </td>
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
