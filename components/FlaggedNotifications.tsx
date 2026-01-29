'use client';
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface FlaggedNotification {
  id: string;
  title: string;
  message: string;
  recipientType: 'student' | 'teacher' | 'parent' | 'all';
  recipientId?: string;
  flaggedReason: string;
  flaggedBy: string;
  flaggedAt: string;
  status: 'flagged' | 'resolved' | 'dismissed';
  performanceImpact: 'low' | 'medium' | 'high';
}

export default function FlaggedNotifications() {
  const [notifications, setNotifications] = useState<FlaggedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FlaggedNotification['status'] | 'ALL'>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<FlaggedNotification['performanceImpact'] | 'ALL'>('ALL');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockNotifications: FlaggedNotification[] = [
      {
        id: '1',
        title: 'High Priority: System Performance Alert',
        message: 'Multiple students reporting slow loading times in the exam portal',
        recipientType: 'all',
        flaggedReason: 'Performance degradation affecting user experience',
        flaggedBy: 'System Monitor',
        flaggedAt: new Date().toISOString(),
        status: 'flagged',
        performanceImpact: 'high',
      },
      {
        id: '2',
        title: 'Database Query Optimization Needed',
        message: 'Attendance queries taking longer than expected',
        recipientType: 'teacher',
        flaggedReason: 'Slow database performance',
        flaggedBy: 'Database Monitor',
        flaggedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'resolved',
        performanceImpact: 'medium',
      },
      {
        id: '3',
        title: 'Memory Usage Alert',
        message: 'Application memory usage exceeding threshold',
        recipientType: 'all',
        flaggedReason: 'Potential memory leak detected',
        flaggedBy: 'System Monitor',
        flaggedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'dismissed',
        performanceImpact: 'low',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 200);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = `${notification.title} ${notification.message} ${notification.flaggedReason}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || notification.status === selectedStatus;
    const matchesImpact = selectedImpact === 'ALL' || notification.performanceImpact === selectedImpact;
    return matchesSearch && matchesStatus && matchesImpact;
  });

  const getStatusBadgeColor = (status: FlaggedNotification['status']) => {
    switch (status) {
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactBadgeColor = (impact: FlaggedNotification['performanceImpact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (notification: FlaggedNotification, newStatus: FlaggedNotification['status']) => {
    try {
      const updatedNotification: FlaggedNotification = {
        ...notification,
        status: newStatus,
      };
      setNotifications(prev => prev.map(n => n.id === notification.id ? updatedNotification : n));
    } catch (error) {
      console.error('Error updating notification status:', error);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flagged Notifications</h1>
          <p className="text-gray-600 mt-1">Monitor system performance and flagged issues</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ICONS.Alert className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'flagged').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ICONS.Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'resolved' &&
                  new Date(n.flaggedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ICONS.Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as FlaggedNotification['status'] | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="flagged">Flagged</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Impact Level</label>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value as FlaggedNotification['performanceImpact'] | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Impact</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Performance Alerts ({filteredNotifications.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flagged By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {notification.flaggedReason}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactBadgeColor(notification.performanceImpact)}`}>
                      {notification.performanceImpact.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.flaggedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notification.flaggedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {notification.status === 'flagged' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(notification, 'resolved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleStatusChange(notification, 'dismissed')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      {notification.status === 'resolved' && (
                        <span className="text-green-600">Resolved</span>
                      )}
                      {notification.status === 'dismissed' && (
                        <span className="text-gray-600">Dismissed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No notifications found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}