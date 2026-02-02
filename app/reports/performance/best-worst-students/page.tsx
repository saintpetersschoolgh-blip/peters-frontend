'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';
import { Student, ExamResult } from '../../../../types';

interface StudentPerformance {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  averageScore: number;
  totalSubjects: number;
  rank: number;
  improvement: number;
}

export default function BestWorstStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [sortBy, setSortBy] = useState<'best' | 'worst'>('best');

  useEffect(() => {
    const mockStudents: StudentPerformance[] = [
      {
        studentId: 's001',
        studentName: 'John Doe',
        admissionNumber: 'STU001',
        className: 'Grade 10A',
        averageScore: 92.5,
        totalSubjects: 8,
        rank: 1,
        improvement: 5.2,
      },
      {
        studentId: 's002',
        studentName: 'Alice Smith',
        admissionNumber: 'STU002',
        className: 'Grade 10A',
        averageScore: 89.3,
        totalSubjects: 8,
        rank: 2,
        improvement: 3.1,
      },
      {
        studentId: 's003',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        averageScore: 45.2,
        totalSubjects: 8,
        rank: 38,
        improvement: -2.5,
      },
      {
        studentId: 's004',
        studentName: 'Emma Wilson',
        admissionNumber: 'STU004',
        className: 'Grade 10A',
        averageScore: 38.7,
        totalSubjects: 8,
        rank: 40,
        improvement: -5.8,
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const sortedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      return sortBy === 'best' ? b.averageScore - a.averageScore : a.averageScore - b.averageScore;
    });
    return sorted;
  }, [students, sortBy]);

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
          <h1 className="text-3xl font-bold text-gray-900">Best & Worst Performing Students</h1>
          <p className="text-gray-600 mt-1">Identify top and struggling students</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'best' | 'worst')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="best">Best Performing</option>
              <option value="worst">Worst Performing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Terms</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
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
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {sortBy === 'best' ? 'Best Performing Students' : 'Worst Performing Students'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student, index) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      index < 3 && sortBy === 'best' ? 'bg-green-100 text-green-800' :
                      index >= sortedStudents.length - 3 && sortBy === 'worst' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(student.averageScore)}`}>
                      {student.averageScore.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${student.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {student.improvement >= 0 ? '+' : ''}{student.improvement.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalSubjects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
