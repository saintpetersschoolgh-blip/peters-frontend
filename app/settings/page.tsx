'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';
import { Mail, Phone, Save, TestTube, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface EmailConfig {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  useTLS: boolean;
  useSSL: boolean;
}

interface SMSConfig {
  enabled: boolean;
  provider: 'twilio' | 'africas-talking' | 'nexmo' | 'custom';
  apiKey: string;
  apiSecret: string;
  senderId: string;
  endpoint?: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'attendance' | 'financial' | 'system' | 'user' | 'communication' | 'student';
  recipientRoles: ('teacher' | 'headmaster' | 'parent' | 'admin' | 'student')[];
  emailEnabled: boolean;
  smsEnabled: boolean;
}

const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  // Academic Channels
  {
    id: 'exam_schedule_published',
    name: 'Exam Schedule Published',
    description: 'When exam schedules are published or updated',
    category: 'academic',
    recipientRoles: ['parent', 'teacher', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'exam_results_published',
    name: 'Exam Results Published',
    description: 'When exam results are published for students. Results are available in the portal (never send full marks via email)',
    category: 'academic',
    recipientRoles: ['parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'exam_results_approved',
    name: 'Exam Results Approved',
    description: 'When exam results are approved by headmaster',
    category: 'academic',
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'ca_scores_posted',
    name: 'Continuous Assessment Updated',
    description: 'When CA scores are posted (optional - weekly summary is better)',
    category: 'academic',
    recipientRoles: ['parent'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'grades_posted',
    name: 'Grades Posted',
    description: 'When grades are posted for assignments or assessments',
    category: 'academic',
    recipientRoles: ['parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'syllabus_submitted',
    name: 'Syllabus Submitted',
    description: 'When a teacher submits syllabus for approval',
    category: 'academic',
    recipientRoles: ['headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'syllabus_approved',
    name: 'Syllabus Approved',
    description: 'When syllabus is approved by headmaster',
    category: 'academic',
    recipientRoles: ['teacher'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'syllabus_rejected',
    name: 'Syllabus Rejected',
    description: 'When syllabus is rejected by headmaster',
    category: 'academic',
    recipientRoles: ['teacher'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'classwork_assigned',
    name: 'Classwork Assigned',
    description: 'When classwork is assigned to students',
    category: 'academic',
    recipientRoles: ['parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'homework_assigned',
    name: 'Homework Assigned',
    description: 'When homework is assigned to students',
    category: 'academic',
    recipientRoles: ['parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'lesson_notes_submitted',
    name: 'Lesson Notes Submitted',
    description: 'When lesson notes are submitted by teachers',
    category: 'academic',
    recipientRoles: ['headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'report_card_generated',
    name: 'Report Card Generated',
    description: 'When report cards are generated for students',
    category: 'academic',
    recipientRoles: ['parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'promotion_status',
    name: 'Promotion Status',
    description: 'When student promotion status is determined',
    category: 'academic',
    recipientRoles: ['parent', 'teacher', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'performance_flag_raised',
    name: 'Performance Flag Raised',
    description: 'When a performance flag is raised for a student',
    category: 'academic',
    recipientRoles: ['parent', 'teacher', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'at_risk_student_alert',
    name: 'At-Risk Student Alert',
    description: 'When a student is identified as at-risk',
    category: 'academic',
    recipientRoles: ['parent', 'teacher', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // Attendance Channels
  {
    id: 'student_absent',
    name: 'Student Absent',
    description: 'When a student is marked absent. 1 day → Parent only, 3+ consecutive days → Parent + Headmaster',
    category: 'attendance',
    recipientRoles: ['parent', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'student_late',
    name: 'Student Late',
    description: 'When a student is marked late. 1 day → Parent only, 3+ consecutive days → Parent + Headmaster',
    category: 'attendance',
    recipientRoles: ['parent', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'attendance_marked',
    name: 'Attendance Marked',
    description: 'When daily attendance is marked for a class',
    category: 'attendance',
    recipientRoles: ['teacher'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'attendance_report_generated',
    name: 'Attendance Report Generated',
    description: 'When attendance reports are generated',
    category: 'attendance',
    recipientRoles: ['headmaster', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'teacher_absent',
    name: 'Teacher Absent',
    description: 'When a teacher is marked absent',
    category: 'attendance',
    recipientRoles: ['admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'teacher_late',
    name: 'Teacher Late',
    description: 'When a teacher is marked late',
    category: 'attendance',
    recipientRoles: ['admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'attendance_threshold_breached',
    name: 'Attendance Threshold Breached',
    description: 'When student attendance falls below threshold',
    category: 'attendance',
    recipientRoles: ['parent', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // Financial Channels
  {
    id: 'fee_payment_due',
    name: 'Outstanding Fees Reminder',
    description: 'When fee payment is due or approaching due date. Overdue → Parent + Headmaster',
    category: 'financial',
    recipientRoles: ['parent', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'fee_payment_received',
    name: 'Fee Payment Made',
    description: 'When a fee payment is confirmed. Parent receives receipt, Admin and Headmaster (summary) are notified',
    category: 'financial',
    recipientRoles: ['parent', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'fee_payment_overdue',
    name: 'Fee Payment Overdue',
    description: 'When fee payment is overdue. Parent + Headmaster are notified',
    category: 'financial',
    recipientRoles: ['parent', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'fee_receipt_generated',
    name: 'Fee Receipt Generated',
    description: 'When a fee payment receipt is generated and sent to parent',
    category: 'financial',
    recipientRoles: ['parent'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'fee_invoice_generated',
    name: 'Fee Invoice Generated',
    description: 'When a new fee invoice is generated',
    category: 'financial',
    recipientRoles: ['parent', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'fee_structure_updated',
    name: 'Fee Structure Updated',
    description: 'When fee structure is updated',
    category: 'financial',
    recipientRoles: ['parent', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder',
    description: 'Automated payment reminders',
    category: 'financial',
    recipientRoles: ['parent'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // System Channels
  {
    id: 'system_alert',
    name: 'System Alert',
    description: 'Important system alerts and notifications',
    category: 'system',
    recipientRoles: ['admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'maintenance_notification',
    name: 'Maintenance Notification',
    description: 'System maintenance notifications',
    category: 'system',
    recipientRoles: ['parent', 'teacher', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'approval_request',
    name: 'Approval Request',
    description: 'When an approval request is submitted',
    category: 'system',
    recipientRoles: ['headmaster', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'approval_status',
    name: 'Approval Status',
    description: 'When approval status changes (approved/rejected)',
    category: 'system',
    recipientRoles: ['teacher', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'report_generated',
    name: 'Report Generated',
    description: 'When reports are generated and ready',
    category: 'system',
    recipientRoles: ['headmaster', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'data_export_ready',
    name: 'Data Export Ready',
    description: 'When data exports are ready for download',
    category: 'system',
    recipientRoles: ['admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // User Management Channels
  {
    id: 'account_created',
    name: 'Account Created',
    description: 'When a new user account is created',
    category: 'user',
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    description: 'When password reset is requested. Sent to the user (Parent/Teacher/Admin)',
    category: 'user',
    recipientRoles: ['parent', 'teacher', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'account_activated',
    name: 'Account Activated',
    description: 'When a user account is activated',
    category: 'user',
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'profile_updated',
    name: 'Profile Updated',
    description: 'When user profile information is updated',
    category: 'user',
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'login_alert',
    name: 'New Device Login',
    description: 'Security alert when login occurs from a new device. Sent to the user',
    category: 'user',
    recipientRoles: ['parent', 'teacher', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'role_changed',
    name: 'Role Change',
    description: 'When user role or permissions are changed (e.g., Teacher → Admin). Affected user and Headmaster are notified',
    category: 'user',
    recipientRoles: ['teacher', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // Communication Channels
  {
    id: 'notification_sent',
    name: 'Notification Sent',
    description: 'When a notification is sent to users',
    category: 'communication',
    recipientRoles: ['parent', 'teacher', 'student', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'message_received',
    name: 'Message Received',
    description: 'When a message is received from another user',
    category: 'communication',
    recipientRoles: ['parent', 'teacher', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'announcement_published',
    name: 'School Announcement',
    description: 'When school announcements are published. Use bulk + batching, not individual emails',
    category: 'communication',
    recipientRoles: ['parent', 'teacher', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'timetable_changes',
    name: 'Timetable Changes',
    description: 'When class or school timetable is updated',
    category: 'communication',
    recipientRoles: ['teacher', 'parent', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'event_reminder',
    name: 'Event Reminder',
    description: 'Reminders for upcoming school events',
    category: 'communication',
    recipientRoles: ['parent', 'teacher', 'student'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // New Student-Related Channels
  {
    id: 'student_admitted',
    name: 'Student is Admitted',
    description: 'When a new student is admitted. Parent receives admission confirmation, student ID, next steps. Admin and Headmaster are notified',
    category: 'student',
    recipientRoles: ['parent', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'student_promotion',
    name: 'Student Promotion / Class Change',
    description: 'When a student moves to a new class or is promoted',
    category: 'student',
    recipientRoles: ['parent', 'teacher', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'student_withdrawal',
    name: 'Student Withdrawal / Transfer',
    description: 'When a student leaves the school or transfers',
    category: 'student',
    recipientRoles: ['parent', 'admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // Teacher-Related Channels
  {
    id: 'teacher_account_created',
    name: 'Teacher Account Created',
    description: 'When a new teacher account is created. Teacher receives login details, Admin is notified',
    category: 'user',
    recipientRoles: ['teacher', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'teacher_assigned',
    name: 'Teacher Assigned to Class/Subject',
    description: 'When a teacher is assigned to a class or subject',
    category: 'academic',
    recipientRoles: ['teacher', 'headmaster', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'teacher_leave_request',
    name: 'Teacher Absence / Leave Request',
    description: 'When a teacher requests leave. Admin and Headmaster are notified',
    category: 'attendance',
    recipientRoles: ['admin', 'headmaster'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'teacher_leave_status',
    name: 'Teacher Leave Approved/Rejected',
    description: 'When teacher leave request is approved or rejected. Teacher is notified',
    category: 'attendance',
    recipientRoles: ['teacher'],
    emailEnabled: false,
    smsEnabled: false,
  },
  
  // Parent-Related Channels
  {
    id: 'parent_account_created',
    name: 'Parent Account Created',
    description: 'When a parent account is created. Parent receives login credentials',
    category: 'user',
    recipientRoles: ['parent'],
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'discipline_report',
    name: 'Discipline / Behavior Report',
    description: 'When a teacher submits a discipline or behavior report. Parent and Headmaster are notified, Admin optional',
    category: 'academic',
    recipientRoles: ['parent', 'headmaster', 'admin'],
    emailEnabled: false,
    smsEnabled: false,
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isHeadmaster = user?.role === UserRole.HEAD_MASTER;

  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'channels'>('email');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    enabled: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    useTLS: true,
    useSSL: false,
  });
  const [smsConfig, setSMSConfig] = useState<SMSConfig>({
    enabled: false,
    provider: 'twilio',
    apiKey: '',
    apiSecret: '',
    senderId: '',
    endpoint: '',
  });
  const [channels, setChannels] = useState<NotificationChannel[]>(NOTIFICATION_CHANNELS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'email' | 'sms' | null; success: boolean; message: string }>({
    type: null,
    success: false,
    message: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRoleTab, setSelectedRoleTab] = useState<'teacher' | 'headmaster' | 'parent' | 'admin' | 'all'>('all');

  useEffect(() => {
    // Load saved configurations
    const loadConfig = () => {
      try {
        const savedEmailConfig = localStorage.getItem('emailConfig');
        const savedSMSConfig = localStorage.getItem('smsConfig');
        const savedChannels = localStorage.getItem('notificationChannels');

        if (savedEmailConfig) {
          setEmailConfig(JSON.parse(savedEmailConfig));
        }
        if (savedSMSConfig) {
          setSMSConfig(JSON.parse(savedSMSConfig));
        }
        if (savedChannels) {
          setChannels(JSON.parse(savedChannels));
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };

    loadConfig();
  }, []);

  const handleEmailConfigChange = (field: keyof EmailConfig, value: any) => {
    setEmailConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSMSConfigChange = (field: keyof SMSConfig, value: any) => {
    setSMSConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelToggle = (channelId: string, type: 'email' | 'sms') => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId
          ? { ...channel, [`${type}Enabled`]: !channel[`${type}Enabled`] }
          : channel
      )
    );
  };

  const handleSaveEmailConfig = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
      alert('Email configuration saved successfully!');
    } catch (error) {
      alert('Failed to save email configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSMSConfig = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('smsConfig', JSON.stringify(smsConfig));
      alert('SMS configuration saved successfully!');
    } catch (error) {
      alert('Failed to save SMS configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChannels = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('notificationChannels', JSON.stringify(channels));
      alert('Notification channels saved successfully!');
    } catch (error) {
      alert('Failed to save notification channels.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    setTestResult({ type: null, success: false, message: '' });
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult({
        type: 'email',
        success: true,
        message: 'Test email sent successfully! Please check your inbox.',
      });
    } catch (error) {
      setTestResult({
        type: 'email',
        success: false,
        message: 'Failed to send test email. Please check your configuration.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSMS = async () => {
    setLoading(true);
    setTestResult({ type: null, success: false, message: '' });
    try {
      // Simulate SMS test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult({
        type: 'sms',
        success: true,
        message: 'Test SMS sent successfully! Please check your phone.',
      });
    } catch (error) {
      setTestResult({
        type: 'sms',
        success: false,
        message: 'Failed to send test SMS. Please check your configuration.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
    const matchesRole = selectedRoleTab === 'all' || 
      (channel.recipientRoles && channel.recipientRoles.includes(selectedRoleTab));
    return matchesSearch && matchesCategory && matchesRole;
  });

  const categoryCounts = {
    all: channels.length,
    academic: channels.filter(c => c.category === 'academic').length,
    attendance: channels.filter(c => c.category === 'attendance').length,
    financial: channels.filter(c => c.category === 'financial').length,
    system: channels.filter(c => c.category === 'system').length,
    user: channels.filter(c => c.category === 'user').length,
    communication: channels.filter(c => c.category === 'communication').length,
    student: channels.filter(c => c.category === 'student').length,
  };

  if (!isAdmin && !isHeadmaster) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            <p className="font-medium">Access Denied</p>
          </div>
          <p className="text-red-600 mt-2">You do not have permission to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure email, SMS, and notification channels</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('email')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail size={18} />
              Email Configuration
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Phone size={18} />
              SMS Configuration
            </div>
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'channels'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ICONS.Bell />
              Notification Channels
            </div>
          </button>
        </nav>
      </div>

      {/* Email Configuration Tab */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
              <p className="text-gray-600 text-sm mt-1">Configure SMTP settings for sending emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailConfig.enabled}
                onChange={(e) => handleEmailConfigChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {emailConfig.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {emailConfig.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host *
                  </label>
                  <input
                    type="text"
                    value={emailConfig.smtpHost}
                    onChange={(e) => handleEmailConfigChange('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port *
                  </label>
                  <input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => handleEmailConfigChange('smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username *
                  </label>
                  <input
                    type="text"
                    value={emailConfig.smtpUsername}
                    onChange={(e) => handleEmailConfigChange('smtpUsername', e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password *
                  </label>
                  <input
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={(e) => handleEmailConfigChange('smtpPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email *
                  </label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => handleEmailConfigChange('fromEmail', e.target.value)}
                    placeholder="noreply@school.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name *
                  </label>
                  <input
                    type="text"
                    value={emailConfig.fromName}
                    onChange={(e) => handleEmailConfigChange('fromName', e.target.value)}
                    placeholder="St. Peter's International School"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailConfig.useTLS}
                    onChange={(e) => handleEmailConfigChange('useTLS', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Use TLS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailConfig.useSSL}
                    onChange={(e) => handleEmailConfigChange('useSSL', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Use SSL</span>
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveEmailConfig}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
                <button
                  onClick={handleTestEmail}
                  disabled={loading || !emailConfig.smtpHost || !emailConfig.smtpUsername}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TestTube size={18} />
                  {loading ? 'Testing...' : 'Send Test Email'}
                </button>
              </div>

              {testResult.type === 'email' && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    testResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                  ) : (
                    <XCircle size={20} className="text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        testResult.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {testResult.success ? 'Test Successful' : 'Test Failed'}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        testResult.success ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {testResult.message}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SMS Configuration Tab */}
      {activeTab === 'sms' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">SMS Settings</h2>
              <p className="text-gray-600 text-sm mt-1">Configure SMS gateway settings for sending text messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsConfig.enabled}
                onChange={(e) => handleSMSConfigChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {smsConfig.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {smsConfig.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMS Provider *
                  </label>
                  <select
                    value={smsConfig.provider}
                    onChange={(e) => handleSMSConfigChange('provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="africas-talking">Africa's Talking</option>
                    <option value="nexmo">Nexmo (Vonage)</option>
                    <option value="custom">Custom API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender ID *
                  </label>
                  <input
                    type="text"
                    value={smsConfig.senderId}
                    onChange={(e) => handleSMSConfigChange('senderId', e.target.value)}
                    placeholder="SCHOOL"
                    maxLength={11}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 11 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key / Account SID *
                  </label>
                  <input
                    type="text"
                    value={smsConfig.apiKey}
                    onChange={(e) => handleSMSConfigChange('apiKey', e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret / Auth Token *
                  </label>
                  <input
                    type="password"
                    value={smsConfig.apiSecret}
                    onChange={(e) => handleSMSConfigChange('apiSecret', e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {smsConfig.provider === 'custom' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom API Endpoint
                    </label>
                    <input
                      type="url"
                      value={smsConfig.endpoint || ''}
                      onChange={(e) => handleSMSConfigChange('endpoint', e.target.value)}
                      placeholder="https://api.example.com/sms/send"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Provider Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {smsConfig.provider === 'twilio' && (
                    <>
                      <li>• Get credentials from: <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">twilio.com</a></li>
                      <li>• Account SID goes in API Key field</li>
                      <li>• Auth Token goes in API Secret field</li>
                    </>
                  )}
                  {smsConfig.provider === 'africas-talking' && (
                    <>
                      <li>• Get credentials from: <a href="https://africastalking.com" target="_blank" rel="noopener noreferrer" className="underline">africastalking.com</a></li>
                      <li>• API Key goes in API Key field</li>
                      <li>• Username goes in API Secret field</li>
                    </>
                  )}
                  {smsConfig.provider === 'nexmo' && (
                    <>
                      <li>• Get credentials from: <a href="https://www.vonage.com" target="_blank" rel="noopener noreferrer" className="underline">vonage.com</a></li>
                      <li>• API Key goes in API Key field</li>
                      <li>• API Secret goes in API Secret field</li>
                    </>
                  )}
                  {smsConfig.provider === 'custom' && (
                    <li>• Configure your custom API endpoint and ensure it accepts POST requests with message data</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveSMSConfig}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
                <button
                  onClick={handleTestSMS}
                  disabled={loading || !smsConfig.apiKey || !smsConfig.apiSecret}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TestTube size={18} />
                  {loading ? 'Testing...' : 'Send Test SMS'}
                </button>
              </div>

              {testResult.type === 'sms' && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    testResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                  ) : (
                    <XCircle size={20} className="text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        testResult.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {testResult.success ? 'Test Successful' : 'Test Failed'}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        testResult.success ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {testResult.message}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Notification Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          {/* Role Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-4">
                <button
                  onClick={() => setSelectedRoleTab('all')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    selectedRoleTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Roles ({channels.length})
                </button>
                <button
                  onClick={() => setSelectedRoleTab('teacher')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    selectedRoleTab === 'teacher'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Teacher ({channels.filter(c => c.recipientRoles?.includes('teacher')).length})
                </button>
                <button
                  onClick={() => setSelectedRoleTab('headmaster')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    selectedRoleTab === 'headmaster'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Headmaster ({channels.filter(c => c.recipientRoles?.includes('headmaster')).length})
                </button>
                <button
                  onClick={() => setSelectedRoleTab('parent')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    selectedRoleTab === 'parent'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Parent ({channels.filter(c => c.recipientRoles?.includes('parent')).length})
                </button>
                <button
                  onClick={() => setSelectedRoleTab('admin')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    selectedRoleTab === 'admin'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Admin ({channels.filter(c => c.recipientRoles?.includes('admin')).length})
                </button>
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Channels</label>
                <div className="relative">
                  <ICONS.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories ({categoryCounts.all})</option>
                  <option value="academic">Academic ({categoryCounts.academic})</option>
                  <option value="attendance">Attendance ({categoryCounts.attendance})</option>
                  <option value="financial">Financial ({categoryCounts.financial})</option>
                  <option value="system">System ({categoryCounts.system})</option>
                  <option value="user">User Management ({categoryCounts.user})</option>
                  <option value="communication">Communication ({categoryCounts.communication})</option>
                  <option value="student">Student ({categoryCounts.student})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Channels List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Notification Channels</h2>
                <button
                  onClick={handleSaveChannels}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {filteredChannels.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No channels found matching your search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredChannels.map((channel) => (
                    <div key={channel.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">{channel.name}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              {channel.category}
                            </span>
                            {channel.recipientRoles && channel.recipientRoles.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {channel.recipientRoles.map((role) => (
                                  <span
                                    key={role}
                                    className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={channel.emailEnabled}
                                onChange={() => handleChannelToggle(channel.id, 'email')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-700">Email</span>
                              </div>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={channel.smsEnabled}
                                onChange={() => handleChannelToggle(channel.id, 'sms')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-700">SMS</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-900">Email Enabled</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {channels.filter(c => c.emailEnabled).length}
                </p>
                <p className="text-sm text-blue-700 mt-1">out of {channels.length} channels</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={20} className="text-green-600" />
                  <span className="font-medium text-green-900">SMS Enabled</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {channels.filter(c => c.smsEnabled).length}
                </p>
                <p className="text-sm text-green-700 mt-1">out of {channels.length} channels</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ICONS.Bell className="text-purple-600" />
                  <span className="font-medium text-purple-900">Both Enabled</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {channels.filter(c => c.emailEnabled && c.smsEnabled).length}
                </p>
                <p className="text-sm text-purple-700 mt-1">channels with both enabled</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
