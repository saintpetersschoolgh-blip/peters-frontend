'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface StudentImprovement {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  previousAverage: number;
  currentAverage: number;
  improvement: number;
  improvementPercent: number;
}

export default function MostImprovedStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentImprovement[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('Term 2');

  useEffect(() => {
    const mockStudents: StudentImprovement[] = [
      {
        studentId: 's001',
        studentName: 'John Doe',
        admissionNumber: 'STU001',
        className: 'Grade 10A',
        previousAverage: 65.2,
        currentAverage: 85.5,
        improvement: 20.3,
        improvementPercent: 31.1,
      },
      {
        studentId: 's002',
        studentName: 'Alice Smith',
        admissionNumber: 'STU002',
        className: 'Grade 10A',
        previousAverage: 72.1,
        currentAverage: 88.3,
        improvement: 16.2,
        improvementPercent: 22.5,
      },
      {
        studentId: 's003',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        previousAverage: 48.5,
        currentAverage: 62.8,
        improvement: 14.3,
        improvementPercent: 29.5,
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => b.improvement - a.improvement);
  }, [students]);

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
          <h1 className="text-3xl font-bold text-gray-900">Most Improved Students</h1>
          <p className="text-gray-600 mt-1">Identify students showing significant academic progress</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Term 2">Term 2 vs Term 1</option>
              <option value="Term 3">Term 3 vs Term 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Student Improvement Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.previousAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.currentAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      +{student.improvement.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    +{student.improvementPercent.toFixed(1)}%
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
