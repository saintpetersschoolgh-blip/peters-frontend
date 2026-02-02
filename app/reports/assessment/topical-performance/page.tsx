'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface TopicalData {
  topicId: string;
  topicName: string;
  subjectName: string;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  performance: 'excellent' | 'good' | 'poor';
}

export default function TopicalPerformancePage() {
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [data, setData] = useState<TopicalData[]>([]);

  useEffect(() => {
    const mockData: TopicalData[] = [
      {
        topicId: 't001',
        topicName: 'Algebra',
        subjectName: 'Mathematics',
        averageScore: 88.5,
        totalQuestions: 20,
        correctAnswers: 17.7,
        performance: 'excellent',
      },
      {
        topicId: 't002',
        topicName: 'Geometry',
        subjectName: 'Mathematics',
        averageScore: 75.2,
        totalQuestions: 15,
        correctAnswers: 11.3,
        performance: 'good',
      },
      {
        topicId: 't003',
        topicName: 'Calculus',
        subjectName: 'Mathematics',
        averageScore: 52.8,
        totalQuestions: 18,
        correctAnswers: 9.5,
        performance: 'poor',
      },
    ];

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getPerformanceColor = (perf: string) => {
    switch (perf) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'poor': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Topical Performance Analysis</h1>
          <p className="text-gray-600 mt-1">Which syllabus topics perform worst/best</p>
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
              <option value="Mathematics">Mathematics</option>
              <option value="English Language">English Language</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Topic Performance Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.topicId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.topicName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.totalQuestions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.correctAnswers.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(item.performance)}`}>
                      {item.performance.toUpperCase()}
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
