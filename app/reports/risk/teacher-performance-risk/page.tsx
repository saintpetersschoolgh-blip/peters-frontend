'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface TeacherRisk {
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  targetScore: number;
  currentAverage: number;
  consecutiveMisses: number;
  riskLevel: 'high' | 'medium' | 'low';
  gap: number;
}

export default function TeacherPerformanceRiskPage() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<TeacherRisk[]>([]);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const mockTeachers: TeacherRisk[] = [
      {
        teacherId: 't001',
        teacherName: 'Michael Brown',
        subjectName: 'Physics',
        className: 'Grade 11B',
        targetScore: 70,
        currentAverage: 62.8,
        consecutiveMisses: 2,
        riskLevel: 'high',
        gap: -7.2,
      },
      {
        teacherId: 't002',
        teacherName: 'Emily Davis',
        subjectName: 'Chemistry',
        className: 'Grade 11B',
        targetScore: 65,
        currentAverage: 58.5,
        consecutiveMisses: 1,
        riskLevel: 'medium',
        gap: -6.5,
      },
    ];

    setTimeout(() => {
      setTeachers(mockTeachers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTeachers = useMemo(() => {
    if (filterRisk === 'all') return teachers;
    return teachers.filter(t => t.riskLevel === filterRisk);
  }, [teachers, filterRisk]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Performance Risk</h1>
          <p className="text-gray-600 mt-1">Identify teachers missing targets consecutively</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-sm text-red-700">High Risk</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            {teachers.filter(t => t.riskLevel === 'high').length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-sm text-yellow-700">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            {teachers.filter(t => t.riskLevel === 'medium').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-700">Total At-Risk</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{teachers.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Risk Level</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as typeof filterRisk)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">At-Risk Teachers List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consecutive Misses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.teacherId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.targetScore}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{teacher.currentAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{teacher.gap.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.consecutiveMisses}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(teacher.riskLevel)}`}>
                      {teacher.riskLevel.toUpperCase()}
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
