'use client';
import React, { useState, useEffect } from 'react';
import { Notification, UserRole, Classroom, formatUserRole } from '../../../types';
import { ICONS } from '../../../constants';

interface NotificationFormData {
  title: string;
  message: string;
  type: Notification['type'];
  recipientType: Notification['recipientType'];
  recipientRoles: UserRole[];
  classroomIds: string[];
}

export default function SendNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Notification['type'] | 'ALL'>('ALL');

  // Modal states
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Form state
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    type: 'GENERAL',
    recipientType: 'ALL',
    recipientRoles: [],
    classroomIds: [],
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NotificationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockClassrooms: Classroom[] = [
      {
        id: 'c001',
        name: 'Grade 10A',
        academicYear: '2024-2025',
        capacity: 40,
        currentStudents: 35,
        classMasterId: 'teacher001',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
      {
        id: 'c002',
        name: 'Grade 11B',
        academicYear: '2024-2025',
        capacity: 35,
        currentStudents: 32,
        classMasterId: 'teacher002',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
      {
        id: 'c003',
        name: 'Grade 9C',
        academicYear: '2024-2025',
        capacity: 38,
        currentStudents: 36,
        classMasterId: 'teacher003',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
    ];

    const mockNotifications: Notification[] = [
      {
        id: 'n001',
        title: 'School Holiday Notice',
        message: 'School will be closed tomorrow due to maintenance work. All classes are cancelled.',
        type: 'IMPORTANT',
        recipientType: 'ALL',
        sentById: 'u001',
        isRead: false,
        createdAt: '2024-01-15T09:00:00Z',
      },
      {
        id: 'n002',
        title: 'Exam Results Published',
        message: 'Mathematics mid-term exam results are now available. Please check your student portal.',
        type: 'ACADEMIC',
        recipientType: 'ROLE',
        recipientRoles: [UserRole.STUDENT, UserRole.PARENT],
        sentById: 'u001',
        isRead: true,
        readAt: '2024-01-16T10:30:00Z',
        createdAt: '2024-01-16T08:00:00Z',
      },
      {
        id: 'n003',
        title: 'Fee Payment Reminder',
        message: 'This is a reminder that the second term fees are due by the end of this month.',
        type: 'FINANCIAL',
        recipientType: 'CLASS',
        classroomIds: ['c001', 'c002'],
        sentById: 'u001',
        isRead: false,
        createdAt: '2024-01-17T10:00:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setClassrooms(mockClassrooms);
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || notification.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof NotificationFormData, string>> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    if (formData.recipientType === 'ROLE' && formData.recipientRoles.length === 0) {
      errors.recipientRoles = 'At least one recipient role must be selected';
    }

    if (formData.recipientType === 'CLASS' && formData.classroomIds.length === 0) {
      errors.classroomIds = 'At least one classroom must be selected';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modal handlers
  const handleComposeNotification = () => {
    setFormData({
      title: '',
      message: '',
      type: 'GENERAL',
      recipientType: 'ALL',
      recipientRoles: [],
      classroomIds: [],
    });
    setFormErrors({});
    setSelectedNotification(null);
    setShowComposeModal(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      recipientType: notification.recipientType,
      recipientRoles: notification.recipientRoles || [],
      classroomIds: notification.classroomIds || [],
    });
    setFormErrors({});
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const handleDeleteNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      if (selectedNotification) {
        // Update existing notification
        const updatedNotification: Notification = {
          ...selectedNotification,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          recipientType: formData.recipientType,
          recipientRoles: formData.recipientRoles,
          classroomIds: formData.classroomIds,
        };
        setNotifications(prev => prev.map(n => n.id === selectedNotification.id ? updatedNotification : n));
        setShowEditModal(false);
        setSelectedNotification(null);
      } else {
        // Send new notification
        const newNotification: Notification = {
          id: `n${String(notifications.length + 1).padStart(3, '0')}`,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          recipientType: formData.recipientType,
          recipientRoles: formData.recipientRoles.length > 0 ? formData.recipientRoles : undefined,
          classroomIds: formData.classroomIds.length > 0 ? formData.classroomIds : undefined,
          sentById: 'current-user', // Would be current user ID
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
        setShowComposeModal(false);
      }

      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'GENERAL',
        recipientType: 'ALL',
        recipientRoles: [],
        classroomIds: [],
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNotification) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
      setShowDeleteModal(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'GENERAL': return 'bg-blue-100 text-blue-800';
      case 'ACADEMIC': return 'bg-green-100 text-green-800';
      case 'FINANCIAL': return 'bg-yellow-100 text-yellow-800';
      case 'ATTENDANCE': return 'bg-purple-100 text-purple-800';
      case 'IMPORTANT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'GENERAL': return ICONS.Bell;
      case 'ACADEMIC': return ICONS.BookOpen;
      case 'FINANCIAL': return ICONS.CreditCard;
      case 'ATTENDANCE': return ICONS.UserCheck;
      case 'IMPORTANT': return ICONS.Alert;
      default: return ICONS.Bell;
    }
  };

  const getRecipientDisplay = (notification: Notification) => {
    switch (notification.recipientType) {
      case 'ALL':
        return 'All Users';
      case 'ROLE':
        return notification.recipientRoles?.map(formatUserRole).join(', ') || 'Specific Roles';
      case 'CLASS':
        const classNames = notification.classroomIds?.map(id => {
          const classroom = classrooms.find(c => c.id === id);
          return classroom?.name;
        }).filter(Boolean).join(', ');
        return classNames || 'Specific Classrooms';
      case 'INDIVIDUAL':
        return 'Individual Recipients';
      default:
        return 'All Users';
    }
  };

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      recipientRoles: checked
        ? [...prev.recipientRoles, role]
        : prev.recipientRoles.filter(r => r !== role)
    }));
    if (formErrors.recipientRoles) {
      setFormErrors({ ...formErrors, recipientRoles: undefined });
    }
  };

  const handleClassroomChange = (classroomId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      classroomIds: checked
        ? [...prev.classroomIds, classroomId]
        : prev.classroomIds.filter(id => id !== classroomId)
    }));
    if (formErrors.classroomIds) {
      setFormErrors({ ...formErrors, classroomIds: undefined });
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
          <h1 className="text-3xl font-bold text-gray-900">Send Notifications</h1>
          <p className="text-gray-600 mt-1">Communicate with students, teachers, and parents</p>
        </div>
        <button
          onClick={handleComposeNotification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Compose Notification
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by title or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as Notification['type'] | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="GENERAL">General</option>
              <option value="ACADEMIC">Academic</option>
              <option value="FINANCIAL">Financial</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="IMPORTANT">Important</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full">
              Export Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Notifications ({filteredNotifications.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getTypeColor(notification.type).split(' ')[0]}`}>
                    <div className="text-white">{getTypeIcon(notification.type)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {notification.isRead && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Read
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <span>Sent: {new Date(notification.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>Recipients: {getRecipientDisplay(notification)}</span>
                      {notification.readAt && (
                        <>
                          <span>•</span>
                          <span>Read: {new Date(notification.readAt).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">{ICONS.Bell}</div>
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria or create a new notification</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Notification Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Compose Notification</h2>
                <p className="text-sm text-gray-600 mt-1">Send a message to selected recipients</p>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                    }}
                    placeholder="Notification title"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                    }}
                    placeholder="Enter your notification message here..."
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.message && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Notification['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="FINANCIAL">Financial</option>
                    <option value="ATTENDANCE">Attendance</option>
                    <option value="IMPORTANT">Important</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        recipientType: e.target.value as Notification['recipientType'],
                        recipientRoles: [],
                        classroomIds: []
                      });
                      setFormErrors({});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    disabled={isSubmitting}
                  >
                    <option value="ALL">All Users</option>
                    <option value="ROLE">Specific Roles</option>
                    <option value="CLASS">Specific Classrooms</option>
                    <option value="INDIVIDUAL">Individual Recipients</option>
                  </select>

                  {formData.recipientType === 'ROLE' && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(UserRole).map(role => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.recipientRoles.includes(role)}
                              onChange={(e) => handleRoleChange(role, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">{formatUserRole(role)}</span>
                          </label>
                        ))}
                      </div>
                      {formErrors.recipientRoles && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          {ICONS.Alert}
                          {formErrors.recipientRoles}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.recipientType === 'CLASS' && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Classrooms:</label>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {classrooms.map(classroom => (
                          <label key={classroom.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.classroomIds.includes(classroom.id)}
                              onChange={(e) => handleClassroomChange(classroom.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">
                              {classroom.name} ({classroom.academicYear}) - {classroom.currentStudents} students
                            </span>
                          </label>
                        ))}
                      </div>
                      {formErrors.classroomIds && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          {ICONS.Alert}
                          {formErrors.classroomIds}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.recipientType === 'INDIVIDUAL' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Individual recipient selection feature coming soon. For now, please use Role or Classroom selection.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    {ICONS.Bell}
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notification Modal */}
      {showEditModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Notification</h2>
                <p className="text-sm text-gray-600 mt-1">Update notification details</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                    }}
                    placeholder="Notification title"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                    }}
                    placeholder="Enter your notification message here..."
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.message && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Notification['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="FINANCIAL">Financial</option>
                    <option value="ATTENDANCE">Attendance</option>
                    <option value="IMPORTANT">Important</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        recipientType: e.target.value as Notification['recipientType'],
                        recipientRoles: [],
                        classroomIds: []
                      });
                      setFormErrors({});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    disabled={isSubmitting}
                  >
                    <option value="ALL">All Users</option>
                    <option value="ROLE">Specific Roles</option>
                    <option value="CLASS">Specific Classrooms</option>
                    <option value="INDIVIDUAL">Individual Recipients</option>
                  </select>

                  {formData.recipientType === 'ROLE' && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(UserRole).map(role => (
                          <label key={role} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.recipientRoles.includes(role)}
                              onChange={(e) => handleRoleChange(role, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">{formatUserRole(role)}</span>
                          </label>
                        ))}
                      </div>
                      {formErrors.recipientRoles && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          {ICONS.Alert}
                          {formErrors.recipientRoles}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.recipientType === 'CLASS' && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Classrooms:</label>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {classrooms.map(classroom => (
                          <label key={classroom.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.classroomIds.includes(classroom.id)}
                              onChange={(e) => handleClassroomChange(classroom.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">
                              {classroom.name} ({classroom.academicYear}) - {classroom.currentStudents} students
                            </span>
                          </label>
                        ))}
                      </div>
                      {formErrors.classroomIds && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          {ICONS.Alert}
                          {formErrors.classroomIds}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  'Update Notification'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-red-600">Delete Notification</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this notification? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="font-medium text-gray-900 mb-1">
                  {selectedNotification.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(selectedNotification.type)}`}>
                    {selectedNotification.type}
                  </span>
                  <span className="ml-2">• Sent {new Date(selectedNotification.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {selectedNotification.message}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Notification'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}