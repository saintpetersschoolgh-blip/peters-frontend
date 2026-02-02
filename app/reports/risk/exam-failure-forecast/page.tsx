'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../../../constants';

interface FailureForecast {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  caAverage: number;
  mockExamScore: number;
  predictedScore: number;
  failureProbability: number;
  riskLevel: 'high' | 'medium' | 'low';
  recommendedAction: string;
}

export default function ExamFailureForecastPage() {
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<FailureForecast[]>([]);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const mockForecasts: FailureForecast[] = [
      {
        studentId: 's001',
        studentName: 'Bob Johnson',
        admissionNumber: 'STU003',
        className: 'Grade 11B',
        caAverage: 42.5,
        mockExamScore: 38.0,
        predictedScore: 40.2,
        failureProbability: 85.5,
        riskLevel: 'high',
        recommendedAction: 'Intensive tutoring required',
      },
      {
        studentId: 's002',
        studentName: 'Emma Wilson',
        admissionNumber: 'STU004',
        className: 'Grade 10A',
        caAverage: 48.0,
        mockExamScore: 45.5,
        predictedScore: 46.8,
        failureProbability: 72.3,
        riskLevel: 'high',
        recommendedAction: 'Additional support needed',
      },
      {
        studentId: 's003',
        studentName: 'Tom Brown',
        admissionNumber: 'STU005',
        className: 'Grade 11B',
        caAverage: 55.0,
        mockExamScore: 52.0,
        predictedScore: 53.5,
        failureProbability: 45.2,
        riskLevel: 'medium',
        recommendedAction: 'Monitor closely',
      },
    ];

    setTimeout(() => {
      setForecasts(mockForecasts);
      setLoading(false);
    }, 500);
  }, []);

  const filteredForecasts = useMemo(() => {
    if (filterRisk === 'all') return forecasts;
    return forecasts.filter(f => f.riskLevel === filterRisk);
  }, [forecasts, filterRisk]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-green-600';
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
          <h1 className="text-3xl font-bold text-gray-900">Exam Failure Probability Forecast</h1>
          <p className="text-gray-600 mt-1">Predictive analysis based on CA and mock exam scores</p>
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
            {forecasts.filter(f => f.riskLevel === 'high').length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-sm text-yellow-700">Medium Risk</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            {forecasts.filter(f => f.riskLevel === 'medium').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-700">Total At-Risk</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{forecasts.length}</div>
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
          <h3 className="text-lg font-medium text-gray-900">Failure Forecast Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mock Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failure Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForecasts.map((forecast) => (
                <tr key={forecast.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{forecast.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{forecast.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{forecast.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.caAverage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.mockExamScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{forecast.predictedScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${getProbabilityColor(forecast.failureProbability)}`}>
                      {forecast.failureProbability.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(forecast.riskLevel)}`}>
                      {forecast.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{forecast.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
