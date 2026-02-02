'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface AtRiskStudent {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  averageScore: number;
  failingSubjects: number;
  consecutiveFailures: number;
  riskLevel: 'high' | 'medium' | 'low';
  lastTermScore: number;
}

export default function AtRiskStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const mockStudents: AtRiskStudent[] = [
      {
        studentId: 's001',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        averageScore: 38.7,
        failingSubjects: 6,
        consecutiveFailures: 2,
        riskLevel: 'high',
        lastTermScore: 42.5,
      },
      {
        studentId: 's002',
        studentName: 'Emma Wilson',
        admissionNumber: 'STU004',
        className: 'Grade 10A',
        averageScore: 45.2,
        failingSubjects: 4,
        consecutiveFailures: 1,
        riskLevel: 'high',
        lastTermScore: 48.0,
      },
      {
        studentId: 's003',
        studentName: 'Tom Brown',
        admissionNumber: 'STU005',
        className: 'Grade 11B',
        averageScore: 52.3,
        failingSubjects: 3,
        consecutiveFailures: 1,
        riskLevel: 'medium',
        lastTermScore: 55.0,
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = useMemo(() => {
    if (filterRisk === 'all') return students;
    return students.filter(s => s.riskLevel === filterRisk);
  }, [students, filterRisk]);

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
          <h1 className="text-3xl font-bold text-gray-900">At-Risk Students Report</h1>
          <p className="text-gray-600 mt-1">Identify students consistently below pass mark</p>
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
            {students.filter(s => s.riskLevel === 'high').length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-sm text-yellow-700">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            {students.filter(s => s.riskLevel === 'medium').length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <div className="text-sm text-blue-700">Low Risk</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {students.filter(s => s.riskLevel === 'low').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-700">Total At-Risk</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{students.length}</div>
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
          <h3 className="text-lg font-medium text-gray-900">At-Risk Students List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failing Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consecutive Failures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Term</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{student.averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.failingSubjects}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.consecutiveFailures}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.lastTermScore.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
