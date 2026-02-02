'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface SubjectForecast {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  targetScore: number;
  currentForecast: number;
  achievement: number;
  status: 'on-track' | 'at-risk';
}

export default function SubjectTargetForecastPage() {
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<SubjectForecast[]>([]);

  useEffect(() => {
    const mockData: SubjectForecast[] = [
      {
        subjectId: 'sub001',
        subjectName: 'Mathematics',
        teacherName: 'Sarah Johnson',
        targetScore: 80,
        currentForecast: 85.5,
        achievement: 106.9,
        status: 'on-track',
      },
      {
        subjectId: 'sub002',
        subjectName: 'Physics',
        teacherName: 'Michael Brown',
        targetScore: 70,
        currentForecast: 65.2,
        achievement: 93.1,
        status: 'at-risk',
      },
    ];

    setTimeout(() => {
      setForecasts(mockData);
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
          <h1 className="text-3xl font-bold text-gray-900">Subject Target Forecast</h1>
          <p className="text-gray-600 mt-1">Forecast subject performance against targets</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Subject Forecast Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Forecast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forecasts.map((forecast) => (
                <tr key={forecast.subjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{forecast.subjectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{forecast.teacherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.targetScore}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.currentForecast.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.achievement.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      forecast.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {forecast.status.replace('-', ' ').toUpperCase()}
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
