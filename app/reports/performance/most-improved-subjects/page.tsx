'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface SubjectImprovement {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  previousAverage: number;
  currentAverage: number;
  improvement: number;
  improvementPercent: number;
  totalStudents: number;
}

export default function MostImprovedSubjectsPage() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectImprovement[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('Term 2');

  useEffect(() => {
    const mockSubjects: SubjectImprovement[] = [
      {
        subjectId: 'sub001',
        subjectName: 'Mathematics',
        teacherName: 'Sarah Johnson',
        previousAverage: 72.5,
        currentAverage: 85.5,
        improvement: 13.0,
        improvementPercent: 17.9,
        totalStudents: 45,
      },
      {
        subjectId: 'sub002',
        subjectName: 'Physics',
        teacherName: 'Michael Brown',
        previousAverage: 65.2,
        currentAverage: 72.8,
        improvement: 7.6,
        improvementPercent: 11.7,
        totalStudents: 38,
      },
      {
        subjectId: 'sub003',
        subjectName: 'English Language',
        teacherName: 'David Lee',
        previousAverage: 75.0,
        currentAverage: 78.2,
        improvement: 3.2,
        improvementPercent: 4.3,
        totalStudents: 45,
      },
    ];

    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500);
  }, []);

  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a, b) => b.improvement - a.improvement);
  }, [subjects]);

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
          <h1 className="text-3xl font-bold text-gray-900">Most Improved Subjects</h1>
          <p className="text-gray-600 mt-1">Track subject performance improvement over time</p>
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
          <h3 className="text-lg font-medium text-gray-900">Subject Improvement Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSubjects.map((subject) => (
                <tr key={subject.subjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.previousAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.currentAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      +{subject.improvement.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    +{subject.improvementPercent.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.totalStudents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
