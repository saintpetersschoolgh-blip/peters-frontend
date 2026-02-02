'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../constants';

interface AuditLog {
  logId: string;
  action: string;
  user: string;
  role: string;
  target: string;
  timestamp: string;
  details: string;
}

export default function AuditTrailPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    const mockData: AuditLog[] = [
      {
        logId: 'a001',
        action: 'Approved',
        user: 'Headmaster Admin',
        role: 'HEAD_MASTER',
        target: 'Exam Results - Term 1 2024',
        timestamp: '2024-01-15 10:30:00',
        details: 'Approved 45 exam results',
      },
      {
        logId: 'a002',
        action: 'Edited',
        user: 'Sarah Johnson',
        role: 'TEACHER',
        target: 'Student Result - STU001',
        timestamp: '2024-01-14 14:20:00',
        details: 'Updated score from 85 to 88',
      },
      {
        logId: 'a003',
        action: 'Rejected',
        user: 'Headmaster Admin',
        role: 'HEAD_MASTER',
        target: 'Syllabus Submission - Mathematics',
        timestamp: '2024-01-13 09:15:00',
        details: 'Rejected due to incomplete coverage',
      },
    ];

    setTimeout(() => {
      setLogs(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredLogs = filterAction === 'ALL' 
    ? logs 
    : logs.filter(log => log.action === filterAction);

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
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail Report</h1>
          <p className="text-gray-600 mt-1">Who approved/edited results and when</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Actions</option>
              <option value="Approved">Approved</option>
              <option value="Edited">Edited</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Audit Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.action === 'Approved' ? 'bg-green-100 text-green-800' :
                      log.action === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
