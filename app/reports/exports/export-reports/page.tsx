'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface ExportReport {
  reportId: string;
  reportName: string;
  format: 'PDF' | 'Excel';
  lastExported: string;
  size: string;
}

export default function ExportReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ExportReport[]>([]);

  useEffect(() => {
    const mockData: ExportReport[] = [
      {
        reportId: 'e001',
        reportName: 'Performance Analytics Report',
        format: 'PDF',
        lastExported: '2024-01-15',
        size: '2.5 MB',
      },
      {
        reportId: 'e002',
        reportName: 'Student Results Export',
        format: 'Excel',
        lastExported: '2024-01-14',
        size: '1.8 MB',
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
          <h1 className="text-3xl font-bold text-gray-900">Export Reports (PDF/Excel)</h1>
          <p className="text-gray-600 mt-1">Generate and download reports in various formats</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Download} Export All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Exports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Exported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.reportId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.reportName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.format}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.lastExported}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Download</button>
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
