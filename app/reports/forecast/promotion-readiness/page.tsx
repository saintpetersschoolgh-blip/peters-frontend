'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface PromotionReadiness {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  currentAverage: number;
  promotionThreshold: number;
  readinessScore: number;
  recommendation: 'promote' | 'repeat' | 'conditional';
}

export default function PromotionReadinessPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PromotionReadiness[]>([]);

  useEffect(() => {
    const mockData: PromotionReadiness[] = [
      {
        studentId: 's001',
        studentName: 'John Doe',
        admissionNumber: 'STU001',
        className: 'Grade 10A',
        currentAverage: 92.5,
        promotionThreshold: 50,
        readinessScore: 95.0,
        recommendation: 'promote',
      },
      {
        studentId: 's002',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        currentAverage: 38.7,
        promotionThreshold: 50,
        readinessScore: 25.0,
        recommendation: 'repeat',
      },
    ];

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'promote': return 'bg-green-100 text-green-800';
      case 'repeat': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Promotion Readiness Report</h1>
          <p className="text-gray-600 mt-1">Identify students likely to be promoted or repeated</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Promotion Readiness Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Readiness Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.promotionThreshold}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.readinessScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(item.recommendation)}`}>
                      {item.recommendation.toUpperCase()}
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
