'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface DistributionData {
  subjectId: string;
  subjectName: string;
  className: string;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  gradeE: number;
  gradeF: number;
  totalStudents: number;
}

export default function ResultDistributionPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [data, setData] = useState<DistributionData[]>([]);

  useEffect(() => {
    const mockData: DistributionData[] = [
      {
        subjectId: 'sub001',
        subjectName: 'Mathematics',
        className: 'Grade 10A',
        gradeA: 12,
        gradeB: 18,
        gradeC: 10,
        gradeD: 3,
        gradeE: 2,
        gradeF: 0,
        totalStudents: 45,
      },
      {
        subjectId: 'sub002',
        subjectName: 'English Language',
        className: 'Grade 10A',
        gradeA: 8,
        gradeB: 15,
        gradeC: 14,
        gradeD: 5,
        gradeE: 2,
        gradeF: 1,
        totalStudents: 45,
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
          <h1 className="text-3xl font-bold text-gray-900">Result Distribution Report</h1>
          <p className="text-gray-600 mt-1">Grade spread (A–F) per subject/class</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English Language">English Language</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Grade Distribution</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">C</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">E</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">F</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.subjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{item.gradeA}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-semibold">{item.gradeB}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 font-semibold">{item.gradeC}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-orange-600 font-semibold">{item.gradeD}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-semibold">{item.gradeE}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-800 font-semibold">{item.gradeF}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalStudents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
