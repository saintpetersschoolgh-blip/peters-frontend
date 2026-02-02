'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface InspectionReport {
  reportId: string;
  reportName: string;
  reportType: string;
  lastGenerated: string;
  status: 'ready' | 'pending';
}

export default function InspectionReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<InspectionReport[]>([]);

  useEffect(() => {
    const mockData: InspectionReport[] = [
      {
        reportId: 'r001',
        reportName: 'GES Annual Report 2024',
        reportType: 'GES',
        lastGenerated: '2024-01-15',
        status: 'ready',
      },
      {
        reportId: 'r002',
        reportName: 'WAEC Performance Report',
        reportType: 'WAEC',
        lastGenerated: '2024-01-10',
        status: 'ready',
      },
    ];

    setTimeout(() => {
      setReports(mockData);
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
          <h1 className="text-3xl font-bold text-gray-900">Inspection-Ready Reports</h1>
          <p className="text-gray-600 mt-1">GES/WAEC compliant reports</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Generate All Reports
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.reportId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.reportName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.lastGenerated}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Generate</button>
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
