'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, Link } from '../lib/navigation';
// Authentication removed for navigation testing
import { useAuth } from '../lib/auth-context';
import { UserRole } from '../types';
import { ICONS } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  width = 256
}) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [headMasterAccess, setHeadMasterAccess] = useState<{ enabled: boolean; allowed: string[] } | null>(null);
  const [teacherAccess, setTeacherAccess] = useState<{ enabled: boolean; allowed: string[] } | null>(null);
  const [parentAccess, setParentAccess] = useState<{ enabled: boolean; allowed: string[] } | null>(null);
  const [accessKey, setAccessKey] = useState(0); // Force re-render key

  useEffect(() => {
    if (!user) {
      setHeadMasterAccess(null);
      setTeacherAccess(null);
      setParentAccess(null);
      return;
    }

    const loadAccess = () => {
      try {
        const raw = localStorage.getItem('sidebarPermissionsConfig');
        const map = raw ? (JSON.parse(raw) as Record<string, Record<string, { enabled: boolean; allowed: string[] }>>) : {};
        const key = user.email || user.username || '';
        
        if (user.role === UserRole.HEAD_MASTER) {
          const config = map.headmaster?.[key] || null;
          setHeadMasterAccess(config);
        } else if (user.role === UserRole.TEACHER) {
          const config = map.teacher?.[key] || null;
          setTeacherAccess(config);
        } else if (user.role === UserRole.PARENT) {
          const config = map.parent?.[key] || null;
          setParentAccess(config);
        }
        
        setAccessKey(prev => prev + 1); // Force re-render
      } catch {
        setHeadMasterAccess(null);
        setTeacherAccess(null);
        setParentAccess(null);
      }
    };

    loadAccess();
    
    // Listen for storage events (cross-tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sidebarPermissionsConfig') loadAccess();
    };
    
    // Listen for custom events (same-tab)
    const onCustom = () => loadAccess();
    
    // Poll for changes (fallback)
    const pollInterval = setInterval(loadAccess, 500);
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('sidebar-permissions-updated', onCustom as EventListener);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sidebar-permissions-updated', onCustom as EventListener);
      clearInterval(pollInterval);
    };
  }, [user]);

  // State for expanded submenus (supports nested expansion)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    // Headmaster menus
    'headmaster-students': pathname === '/students' || pathname.startsWith('/attendance/students'),
    'headmaster-staff': pathname.startsWith('/admin/users/teachers') || pathname.startsWith('/attendance/teachers'),
    'headmaster-academics': pathname === '/classrooms' || pathname === '/subjects' || pathname.startsWith('/teachers/syllabus') || pathname.startsWith('/teachers/timetable'),
    'headmaster-exams': pathname.startsWith('/academic/exams') || pathname.startsWith('/academic/results'),
    'headmaster-reports': pathname.startsWith('/reports') || pathname.startsWith('/academic/results'),
    'headmaster-finance': pathname.startsWith('/finance'),
    'headmaster-communication': pathname.startsWith('/notifications'),
    'headmaster-settings': pathname.startsWith('/settings'),
      'headmaster-approvals': pathname.startsWith('/head-master/approvals') || pathname.startsWith('/teachers/syllabus'),
      // Admin menus
      'admin-users': pathname === '/users' || pathname === '/students' || pathname.startsWith('/admin/users'),
      'admin-academic': pathname.startsWith('/academic'),
      'admin-attendance': pathname.startsWith('/attendance'),
      'admin-finance': pathname.startsWith('/finance'),
      'admin-communication': pathname.startsWith('/notifications'),
      'admin-staff': pathname.startsWith('/admin/users/teachers') || pathname.startsWith('/admin/users/head-masters') || pathname.startsWith('/attendance/teachers'),
      'admin-reports': pathname.startsWith('/academic/results') || pathname.startsWith('/attendance/students') || pathname.startsWith('/attendance/teachers'),
      'admin-approvals': pathname.startsWith('/head-master/approvals') || pathname.startsWith('/teachers/syllabus'),
      'admin-settings': pathname.startsWith('/settings') || pathname.startsWith('/admin/permissions') || pathname.startsWith('/admin/setups'),
    // Teacher menus
    teacher: pathname.startsWith('/teacher') || pathname.startsWith('/teachers'),
    'teacher-overview': pathname === '/teacher' || pathname.startsWith('/teacher/overview'),
    'teacher-classes': pathname.startsWith('/teacher/classes'),
    'teacher-students': pathname.startsWith('/teacher/students'),
    'teacher-attendance': pathname.startsWith('/teacher/attendance') || pathname === '/attendance/students',
    'teacher-assessments': pathname.startsWith('/teacher/assessments'),
    'teacher-grading': pathname.startsWith('/teacher/grading'),
    'teacher-assignments': pathname.startsWith('/teacher/assignments'),
    'teacher-communication': pathname.startsWith('/teacher/communication') || pathname.startsWith('/notifications'),
    'teacher-materials': pathname.startsWith('/teacher/materials'),
    'teacher-schedule': pathname.startsWith('/teacher/schedule') || pathname.startsWith('/teachers/timetable'),
    'teacher-discipline': pathname.startsWith('/teacher/discipline'),
    'teacher-settings': pathname.startsWith('/teacher/settings') || pathname === '/account' || pathname === '/settings',
  });

  // Update expanded state when pathname changes
  useEffect(() => {
    setExpandedMenus(prev => ({
      ...prev,
      // Headmaster menus
      'headmaster-students': pathname === '/students' || pathname.startsWith('/attendance/students'),
      'headmaster-staff': pathname.startsWith('/admin/users/teachers') || pathname.startsWith('/attendance/teachers'),
      'headmaster-academics': pathname === '/classrooms' || pathname === '/subjects' || pathname.startsWith('/teachers/timetable'),
      'headmaster-exams': pathname.startsWith('/academic/exams') || pathname.startsWith('/academic/results'),
      'headmaster-reports': pathname.startsWith('/reports') || pathname.startsWith('/academic/results'),
      'headmaster-finance': pathname.startsWith('/finance'),
      'headmaster-communication': pathname.startsWith('/notifications'),
      'headmaster-approvals': pathname.startsWith('/head-master/approvals') || pathname.startsWith('/teachers/syllabus'),
      // Admin menus
      'admin-users': pathname === '/users' || pathname === '/students' || pathname.startsWith('/admin/users'),
      'admin-academic': pathname.startsWith('/academic'),
      'admin-attendance': pathname.startsWith('/attendance'),
      'admin-finance': pathname.startsWith('/finance'),
      'admin-communication': pathname.startsWith('/notifications'),
      'admin-staff': pathname.startsWith('/admin/users/teachers') || pathname.startsWith('/admin/users/head-masters') || pathname.startsWith('/attendance/teachers'),
      'admin-reports': pathname.startsWith('/reports') || pathname.startsWith('/academic/results') || pathname.startsWith('/attendance/students') || pathname.startsWith('/attendance/teachers'),
      'admin-approvals': pathname.startsWith('/head-master/approvals') || pathname.startsWith('/teachers/syllabus'),
      'admin-settings': pathname.startsWith('/settings') || pathname.startsWith('/admin/permissions') || pathname.startsWith('/admin/setups'),
      // Teacher menus
      teacher: pathname.startsWith('/teacher') || pathname.startsWith('/teachers'),
      'teacher-overview': pathname === '/teacher' || pathname.startsWith('/teacher/overview'),
      'teacher-classes': pathname.startsWith('/teacher/classes'),
      'teacher-students': pathname.startsWith('/teacher/students'),
      'teacher-attendance': pathname.startsWith('/teacher/attendance') || pathname === '/attendance/students',
      'teacher-assessments': pathname.startsWith('/teacher/assessments'),
      'teacher-grading': pathname.startsWith('/teacher/grading'),
      'teacher-assignments': pathname.startsWith('/teacher/assignments'),
      'teacher-communication': pathname.startsWith('/teacher/communication') || pathname.startsWith('/notifications'),
      'teacher-materials': pathname.startsWith('/teacher/materials'),
      'teacher-schedule': pathname.startsWith('/teacher/schedule') || pathname.startsWith('/teachers/timetable'),
      'teacher-discipline': pathname.startsWith('/teacher/discipline'),
      'teacher-settings': pathname.startsWith('/teacher/settings') || pathname === '/account' || pathname === '/settings',
    }));
  }, [pathname]);

  const toggleSubmenu = (menuKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isCollapsed && onToggleCollapse) {
      onToggleCollapse();
    }
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  // Navigation structure with submenus for each dashboard
  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      icon: ICONS.Home,
      roles: [UserRole.ADMIN, UserRole.HEAD_MASTER, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    },
    {
      path: '/admin',
      label: 'Dashboard',
      icon: ICONS.Dashboard,
      roles: [UserRole.ADMIN],
    },
    {
      path: '/head-master',
      label: 'Dashboard',
      icon: ICONS.Dashboard,
      roles: [UserRole.HEAD_MASTER],
    },
    {
      // Teacher menu (simplified as requested)
      path: '/teacher',
      label: 'Dashboard',
      icon: ICONS.Dashboard,
      roles: [UserRole.TEACHER],
    },
    { path: '/teacher/students/list', label: 'My Student', icon: ICONS.Students, roles: [UserRole.TEACHER] },
    { path: '/teacher/classrooms', label: 'ClassRoom', icon: ICONS.LayoutGrid, roles: [UserRole.TEACHER] },
    { path: '/teacher/subjects', label: 'Subject', icon: ICONS.BookOpen, roles: [UserRole.TEACHER] },
    {
      // Teacher menu (simplified as requested)
      path: '/teachers/syllabus',
      label: 'Syllabus',
      icon: ICONS.Book,
      roles: [UserRole.TEACHER],
    },
    {
      path: '/student',
      label: 'Dashboard',
      icon: ICONS.Dashboard,
      roles: [UserRole.STUDENT],
    },
    {
      path: '/parent',
      label: 'Dashboard',
      icon: ICONS.Dashboard,
      roles: [UserRole.PARENT],
    },
    // Headmaster Navigation - Reorganized
    {
      label: 'Students',
      icon: ICONS.Students,
      key: 'headmaster-students',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/students', label: 'All Students', icon: ICONS.Students },
        { path: '/attendance/students', label: 'Student Attendance', icon: ICONS.UserCheck },
      ],
    },
    {
      label: 'Staff',
      icon: ICONS.Teachers,
      key: 'headmaster-staff',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/admin/users/teachers', label: 'Teaching Staff', icon: ICONS.Teachers },
        { path: '/attendance/teachers', label: 'Staff Attendance', icon: ICONS.UserCheck },
      ],
    },
    {
      label: 'Academics',
      icon: ICONS.BookOpen,
      key: 'headmaster-academics',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/classrooms', label: 'Classes & Arms', icon: ICONS.LayoutGrid },
        { path: '/subjects', label: 'Subjects', icon: ICONS.BookOpen },
        { path: '/teachers/timetable', label: 'Timetable', icon: ICONS.Calendar },
      ],
    },
    {
      label: 'Exams & Results',
      icon: ICONS.Trophy,
      key: 'headmaster-exams',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/academic/exams', label: 'Exams Management', icon: ICONS.Book },
        { path: '/academic/results', label: 'Results Review & Approval', icon: ICONS.Trophy },
      ],
    },
    {
      label: 'Reports & Analytics',
      icon: ICONS.BarChart,
      key: 'headmaster-reports',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        {
          label: 'Performance Overview',
          key: 'reports-performance',
          icon: ICONS.Trophy,
          subsubmenu: [
            { path: '/reports/performance/best-worst-subjects', label: 'Best & Worst Performing Subjects', icon: ICONS.BarChart },
            { path: '/reports/performance/best-worst-students', label: 'Best & Worst Performing Students', icon: ICONS.Students },
            { path: '/reports/performance/most-improved-subjects', label: 'Most Improved Subjects', icon: ICONS.Trending },
            { path: '/reports/performance/most-improved-students', label: 'Most Improved Students', icon: ICONS.Trending },
            { path: '/reports/performance/teacher-targets', label: 'Teacher Target Tracking', icon: ICONS.Target },
          ],
        },
        {
          label: 'Trends & Growth',
          key: 'reports-trends',
          icon: ICONS.Trending,
          subsubmenu: [
            { path: '/reports/trends/subject-performance', label: 'Subject Performance Trend', icon: ICONS.LineChart },
            { path: '/reports/trends/student-performance', label: 'Student Performance Trend', icon: ICONS.LineChart },
            { path: '/reports/trends/class-performance', label: 'Class Performance Trend', icon: ICONS.LineChart },
          ],
        },
        {
          label: 'Risk & Alerts',
          key: 'reports-risk',
          icon: ICONS.AlertTriangle,
          subsubmenu: [
            { path: '/reports/risk/at-risk-students', label: 'At-Risk Students Report', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/at-risk-subjects', label: 'At-Risk Subjects', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/teacher-performance-risk', label: 'Teacher Performance Risk', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/exam-failure-forecast', label: 'Exam Failure Probability Forecast', icon: ICONS.Activity },
          ],
        },
        {
          label: 'Teacher Effectiveness',
          key: 'reports-teacher',
          icon: ICONS.Teachers,
          subsubmenu: [
            { path: '/reports/teacher/teacher-vs-subject', label: 'Teacher vs Subject Performance', icon: ICONS.BarChart },
            { path: '/reports/teacher/teacher-consistency', label: 'Teacher Consistency Report', icon: ICONS.Activity },
            { path: '/reports/teacher/syllabus-coverage', label: 'Syllabus Coverage vs Results', icon: ICONS.Book },
            { path: '/reports/teacher/teacher-load', label: 'Teacher Load vs Performance', icon: ICONS.Briefcase },
          ],
        },
        {
          label: 'Assessment Quality',
          key: 'reports-assessment',
          icon: ICONS.FileText,
          subsubmenu: [
            { path: '/reports/assessment/ca-vs-exam-variance', label: 'CA vs Exam Variance Report', icon: ICONS.BarChart },
            { path: '/reports/assessment/result-distribution', label: 'Result Distribution Report', icon: ICONS.BarChart },
            { path: '/reports/assessment/topical-performance', label: 'Topical Performance Analysis', icon: ICONS.Book },
          ],
        },
        {
          label: 'Attendance Impact',
          key: 'reports-attendance',
          icon: ICONS.UserCheck,
          subsubmenu: [
            { path: '/reports/attendance/student-attendance-performance', label: 'Student Attendance vs Performance', icon: ICONS.UserCheck },
            { path: '/reports/attendance/teacher-attendance-results', label: 'Teacher Attendance vs Results', icon: ICONS.UserCheck },
            { path: '/reports/attendance/class-attendance-impact', label: 'Class Attendance Impact Report', icon: ICONS.UserCheck },
          ],
        },
        {
          label: 'Forecast & Targets',
          key: 'reports-forecast',
          icon: ICONS.Target,
          subsubmenu: [
            { path: '/reports/forecast/school-wide-targets', label: 'School-Wide Target Achievement', icon: ICONS.Target },
            { path: '/reports/forecast/subject-target-forecast', label: 'Subject Target Forecast', icon: ICONS.Target },
            { path: '/reports/forecast/promotion-readiness', label: 'Promotion Readiness Report', icon: ICONS.Cap },
            { path: '/reports/forecast/exam-readiness-index', label: 'Exam Readiness Index', icon: ICONS.Book },
          ],
        },
        {
          label: 'Comparisons',
          key: 'reports-comparisons',
          icon: ICONS.Compare,
          subsubmenu: [
            { path: '/reports/comparisons/class-to-class', label: 'Class-to-Class Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/teacher-to-teacher', label: 'Teacher-to-Teacher Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/term-to-term', label: 'Term-to-Term Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/internal-benchmark', label: 'Internal Benchmark Report', icon: ICONS.BarChart },
          ],
        },
        {
          label: 'Exports & Audit',
          key: 'reports-exports',
          icon: ICONS.Download,
          subsubmenu: [
            { path: '/reports/exports/inspection-reports', label: 'Inspection-Ready Reports', icon: ICONS.FileText },
            { path: '/reports/exports/export-reports', label: 'Export Reports (PDF/Excel)', icon: ICONS.Download },
            { path: '/reports/exports/audit-trail', label: 'Audit Trail Report', icon: ICONS.FileSearch },
          ],
        },
      ],
    },
    {
      label: 'Finance',
      icon: ICONS.CreditCard,
      key: 'headmaster-finance',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/finance/fees', label: 'Fees Structure', icon: ICONS.CreditCard },
        { path: '/finance/payments', label: 'Fee Collection Summary', icon: ICONS.CreditCard },
      ],
    },
    {
      label: 'Communication',
      icon: ICONS.Bell,
      key: 'headmaster-communication',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/notifications/send', label: 'Announcements & Notices', icon: ICONS.Bell },
        { path: '/notifications/flagged', label: 'Flagged Items', icon: ICONS.AlertTriangle },
      ],
    },
    {
      label: 'Settings',
      icon: ICONS.Settings,
      key: 'headmaster-settings',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/settings', label: 'Email & SMS Settings', icon: ICONS.Settings },
      ],
    },
    {
      label: 'Approvals & Reviews',
      icon: ICONS.Check,
      key: 'headmaster-approvals',
      roles: [UserRole.HEAD_MASTER],
      submenu: [
        { path: '/head-master/approvals/exam-results', label: 'Result Approval', icon: ICONS.Check },
        { path: '/head-master/approvals/syllabus-submissions', label: 'Syllabus Submissions', icon: ICONS.Book },
      ],
    },
    // Admin Navigation (keep existing structure)
    {
      label: 'User Management',
      icon: ICONS.Users,
      key: 'admin-users',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/users', label: 'User Management', icon: ICONS.User },
        { path: '/students', label: 'Student Management', icon: ICONS.Students },
        { path: '/admin/users/teachers', label: 'Teacher Management', icon: ICONS.Teachers },
        { path: '/admin/users/head-masters', label: 'Head Master Management', icon: ICONS.Award },
        { path: '/admin/users/parents', label: 'Parent Management', icon: ICONS.Users },
      ],
    },
    {
      label: 'Academic Management',
      icon: ICONS.BookOpen,
      key: 'admin-academic',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/academic/exams', label: 'Exams', icon: ICONS.Book },
        { path: '/academic/results', label: 'Exam Results', icon: ICONS.Trophy },
      ],
    },
    {
      label: 'Attendance Management',
      icon: ICONS.UserCheck,
      key: 'admin-attendance',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/attendance/students', label: 'Student Attendance', icon: ICONS.UserCheck },
        { path: '/attendance/teachers', label: 'Teacher Attendance', icon: ICONS.UserCheck },
      ],
    },
    {
      label: 'Financial Management',
      icon: ICONS.CreditCard,
      key: 'admin-finance',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/finance/fees', label: 'Fee Structure', icon: ICONS.CreditCard },
        { path: '/finance/payments', label: 'Fee Payments', icon: ICONS.CreditCard },
      ],
    },
    {
      label: 'Communication',
      icon: ICONS.Bell,
      key: 'admin-communication',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/notifications/send', label: 'Send Notifications', icon: ICONS.Bell },
        { path: '/notifications/flagged', label: 'Flagged Items', icon: ICONS.AlertTriangle },
      ],
    },
    {
      label: 'Staff',
      icon: ICONS.Teachers,
      key: 'admin-staff',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/admin/users/teachers', label: 'Teaching Staff', icon: ICONS.Teachers },
        { path: '/admin/users/head-masters', label: 'Head Master Management', icon: ICONS.Award },
        { path: '/attendance/teachers', label: 'Staff Attendance', icon: ICONS.UserCheck },
      ],
    },
    {
      label: 'Reports & Analytics',
      icon: ICONS.BarChart,
      key: 'admin-reports',
      roles: [UserRole.ADMIN],
      submenu: [
        {
          label: 'Performance Overview',
          key: 'reports-performance',
          icon: ICONS.Trophy,
          subsubmenu: [
            { path: '/reports/performance/best-worst-subjects', label: 'Best & Worst Performing Subjects', icon: ICONS.BarChart },
            { path: '/reports/performance/best-worst-students', label: 'Best & Worst Performing Students', icon: ICONS.Students },
            { path: '/reports/performance/most-improved-subjects', label: 'Most Improved Subjects', icon: ICONS.Trending },
            { path: '/reports/performance/most-improved-students', label: 'Most Improved Students', icon: ICONS.Trending },
            { path: '/reports/performance/teacher-targets', label: 'Teacher Target Tracking', icon: ICONS.Target },
          ],
        },
        {
          label: 'Trends & Growth',
          key: 'reports-trends',
          icon: ICONS.Trending,
          subsubmenu: [
            { path: '/reports/trends/subject-performance', label: 'Subject Performance Trend', icon: ICONS.LineChart },
            { path: '/reports/trends/student-performance', label: 'Student Performance Trend', icon: ICONS.LineChart },
            { path: '/reports/trends/class-performance', label: 'Class Performance Trend', icon: ICONS.LineChart },
          ],
        },
        {
          label: 'Risk & Alerts',
          key: 'reports-risk',
          icon: ICONS.AlertTriangle,
          subsubmenu: [
            { path: '/reports/risk/at-risk-students', label: 'At-Risk Students Report', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/at-risk-subjects', label: 'At-Risk Subjects', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/teacher-performance-risk', label: 'Teacher Performance Risk', icon: ICONS.AlertTriangle },
            { path: '/reports/risk/exam-failure-forecast', label: 'Exam Failure Probability Forecast', icon: ICONS.Activity },
          ],
        },
        {
          label: 'Teacher Effectiveness',
          key: 'reports-teacher',
          icon: ICONS.Teachers,
          subsubmenu: [
            { path: '/reports/teacher/teacher-vs-subject', label: 'Teacher vs Subject Performance', icon: ICONS.BarChart },
            { path: '/reports/teacher/teacher-consistency', label: 'Teacher Consistency Report', icon: ICONS.Activity },
            { path: '/reports/teacher/syllabus-coverage', label: 'Syllabus Coverage vs Results', icon: ICONS.Book },
            { path: '/reports/teacher/teacher-load', label: 'Teacher Load vs Performance', icon: ICONS.Briefcase },
          ],
        },
        {
          label: 'Assessment Quality',
          key: 'reports-assessment',
          icon: ICONS.FileText,
          subsubmenu: [
            { path: '/reports/assessment/ca-vs-exam-variance', label: 'CA vs Exam Variance Report', icon: ICONS.BarChart },
            { path: '/reports/assessment/result-distribution', label: 'Result Distribution Report', icon: ICONS.BarChart },
            { path: '/reports/assessment/topical-performance', label: 'Topical Performance Analysis', icon: ICONS.Book },
          ],
        },
        {
          label: 'Attendance Impact',
          key: 'reports-attendance',
          icon: ICONS.UserCheck,
          subsubmenu: [
            { path: '/reports/attendance/student-attendance-performance', label: 'Student Attendance vs Performance', icon: ICONS.UserCheck },
            { path: '/reports/attendance/teacher-attendance-results', label: 'Teacher Attendance vs Results', icon: ICONS.UserCheck },
            { path: '/reports/attendance/class-attendance-impact', label: 'Class Attendance Impact Report', icon: ICONS.UserCheck },
          ],
        },
        {
          label: 'Forecast & Targets',
          key: 'reports-forecast',
          icon: ICONS.Target,
          subsubmenu: [
            { path: '/reports/forecast/school-wide-targets', label: 'School-Wide Target Achievement', icon: ICONS.Target },
            { path: '/reports/forecast/subject-target-forecast', label: 'Subject Target Forecast', icon: ICONS.Target },
            { path: '/reports/forecast/promotion-readiness', label: 'Promotion Readiness Report', icon: ICONS.Cap },
            { path: '/reports/forecast/exam-readiness-index', label: 'Exam Readiness Index', icon: ICONS.Book },
          ],
        },
        {
          label: 'Comparisons',
          key: 'reports-comparisons',
          icon: ICONS.Compare,
          subsubmenu: [
            { path: '/reports/comparisons/class-to-class', label: 'Class-to-Class Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/teacher-to-teacher', label: 'Teacher-to-Teacher Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/term-to-term', label: 'Term-to-Term Comparison', icon: ICONS.Compare },
            { path: '/reports/comparisons/internal-benchmark', label: 'Internal Benchmark Report', icon: ICONS.BarChart },
          ],
        },
        {
          label: 'Exports & Audit',
          key: 'reports-exports',
          icon: ICONS.Download,
          subsubmenu: [
            { path: '/reports/exports/inspection-reports', label: 'Inspection-Ready Reports', icon: ICONS.FileText },
            { path: '/reports/exports/export-reports', label: 'Export Reports (PDF/Excel)', icon: ICONS.Download },
            { path: '/reports/exports/audit-trail', label: 'Audit Trail Report', icon: ICONS.FileSearch },
          ],
        },
      ],
    },
    {
      label: 'Approvals & Reviews',
      icon: ICONS.Check,
      key: 'admin-approvals',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/head-master/approvals/exam-results', label: 'Result Approval', icon: ICONS.Check },
        { path: '/head-master/approvals/syllabus-submissions', label: 'Syllabus Submissions', icon: ICONS.Book },
        { path: '/teachers/syllabus', label: 'Syllabus View', icon: ICONS.BookOpen },
      ],
    },
    {
      label: 'Setups',
      icon: ICONS.Settings,
      key: 'admin-setups',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/admin/setups/academic-year', label: 'Academic Year', icon: ICONS.Calendar },
        { path: '/admin/setups/terms', label: 'Term', icon: ICONS.Calendar },
        { path: '/classrooms', label: 'ClassRoom', icon: ICONS.LayoutGrid },
        { path: '/subjects', label: 'Subject', icon: ICONS.BookOpen },
        { path: '/admin/setups/periods', label: 'Period', icon: ICONS.Clock },
        { path: '/admin/setups/grade-levels', label: 'Grade Level', icon: ICONS.Cap },
      ],
    },
    {
      label: 'Settings & Administration',
      icon: ICONS.Settings,
      key: 'admin-settings',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/settings', label: 'Email & SMS Settings', icon: ICONS.Settings },
        { path: '/admin/permissions', label: 'Roles & Permissions', icon: ICONS.Settings },
      ],
    },
    { path: '/teacher/assessments/exam-results', label: 'Exams Result', icon: ICONS.Trophy, roles: [UserRole.TEACHER] },
    { path: '/teacher/assignments/submissions', label: 'Assignment', icon: ICONS.FileText, roles: [UserRole.TEACHER] },
    { path: '/attendance/students', label: 'Attendance', icon: ICONS.UserCheck, roles: [UserRole.TEACHER] },
    { path: '/teachers/timetable', label: 'Timetable', icon: ICONS.Calendar, roles: [UserRole.TEACHER] },
    { path: '/teacher/schedule/events-exams', label: 'Exams Schedule', icon: ICONS.Clock, roles: [UserRole.TEACHER] },

    // Student links (top-level)
    { path: '/students/profile', label: 'My Profile', icon: ICONS.User, roles: [UserRole.STUDENT] },
    { path: '/students/attendance', label: 'My Attendance', icon: ICONS.UserCheck, roles: [UserRole.STUDENT] },
    { path: '/students/classwork', label: 'Class Work', icon: ICONS.Book, roles: [UserRole.STUDENT] },
    { path: '/students/homework', label: 'Homework', icon: ICONS.PenTool, roles: [UserRole.STUDENT] },
    { path: '/students/exams', label: 'Exams', icon: ICONS.Book, roles: [UserRole.STUDENT] },
    { path: '/students/fees', label: 'Fee Status', icon: ICONS.CreditCard, roles: [UserRole.STUDENT] },

    // Parent links (top-level)
    { path: '/students/profile', label: 'Child Profile', icon: ICONS.User, roles: [UserRole.PARENT] },
    { path: '/students/attendance', label: 'Child Attendance', icon: ICONS.UserCheck, roles: [UserRole.PARENT] },
    { path: '/academic/results', label: 'Academic Progress', icon: ICONS.Trophy, roles: [UserRole.PARENT] },
    { path: '/students/fees', label: 'Fee Payments', icon: ICONS.CreditCard, roles: [UserRole.PARENT] },
    { path: '/notifications/send', label: 'Messages', icon: ICONS.Bell, roles: [UserRole.PARENT] },
  ];

  // Parent-child mapping for headmaster and admin menus
  const parentChildMap = React.useMemo(() => {
    const map: Record<string, string[]> = {
      // Headmaster menus
      'headmaster-students': ['/students', '/attendance/students'],
      'headmaster-staff': ['/admin/users/teachers', '/attendance/teachers'],
      'headmaster-academics': ['/classrooms', '/subjects', '/teachers/timetable'],
      'headmaster-exams': ['/academic/exams', '/academic/results'],
      'headmaster-reports': [
        '/reports/performance/best-worst-subjects',
        '/reports/performance/best-worst-students',
        '/reports/performance/most-improved-subjects',
        '/reports/performance/most-improved-students',
        '/reports/performance/teacher-targets',
        '/reports/trends/subject-performance',
        '/reports/trends/student-performance',
        '/reports/trends/class-performance',
        '/reports/risk/at-risk-students',
        '/reports/risk/at-risk-subjects',
        '/reports/risk/teacher-performance-risk',
        '/reports/risk/exam-failure-forecast',
        '/reports/teacher/teacher-vs-subject',
        '/reports/teacher/teacher-consistency',
        '/reports/teacher/syllabus-coverage',
        '/reports/teacher/teacher-load',
        '/reports/assessment/ca-vs-exam-variance',
        '/reports/assessment/result-distribution',
        '/reports/assessment/topical-performance',
        '/reports/attendance/student-attendance-performance',
        '/reports/attendance/teacher-attendance-results',
        '/reports/attendance/class-attendance-impact',
        '/reports/forecast/school-wide-targets',
        '/reports/forecast/subject-target-forecast',
        '/reports/forecast/promotion-readiness',
        '/reports/forecast/exam-readiness-index',
        '/reports/comparisons/class-to-class',
        '/reports/comparisons/teacher-to-teacher',
        '/reports/comparisons/term-to-term',
        '/reports/comparisons/internal-benchmark',
        '/reports/exports/inspection-reports',
        '/reports/exports/export-reports',
        '/reports/exports/audit-trail',
      ],
      'headmaster-finance': ['/finance/fees', '/finance/payments'],
      'headmaster-communication': ['/notifications/send', '/notifications/flagged'],
      'headmaster-approvals': ['/head-master/approvals/exam-results', '/head-master/approvals/syllabus-submissions'],
      // Admin menus
      'admin-users': ['/users', '/students', '/admin/users/teachers', '/admin/users/head-masters', '/admin/users/parents'],
      'admin-academic': ['/academic/exams', '/academic/results'],
      'admin-attendance': ['/attendance/students', '/attendance/teachers'],
      'admin-finance': ['/finance/fees', '/finance/payments'],
      'admin-communication': ['/notifications/send', '/notifications/flagged'],
      'admin-staff': ['/admin/users/teachers', '/admin/users/head-masters', '/attendance/teachers'],
      'admin-reports': [
        '/reports/performance/best-worst-subjects',
        '/reports/performance/best-worst-students',
        '/reports/performance/most-improved-subjects',
        '/reports/performance/most-improved-students',
        '/reports/performance/teacher-targets',
        '/reports/trends/subject-performance',
        '/reports/trends/student-performance',
        '/reports/trends/class-performance',
        '/reports/risk/at-risk-students',
        '/reports/risk/at-risk-subjects',
        '/reports/risk/teacher-performance-risk',
        '/reports/risk/exam-failure-forecast',
        '/reports/teacher/teacher-vs-subject',
        '/reports/teacher/teacher-consistency',
        '/reports/teacher/syllabus-coverage',
        '/reports/teacher/teacher-load',
        '/reports/assessment/ca-vs-exam-variance',
        '/reports/assessment/result-distribution',
        '/reports/assessment/topical-performance',
        '/reports/attendance/student-attendance-performance',
        '/reports/attendance/teacher-attendance-results',
        '/reports/attendance/class-attendance-impact',
        '/reports/forecast/school-wide-targets',
        '/reports/forecast/subject-target-forecast',
        '/reports/forecast/promotion-readiness',
        '/reports/forecast/exam-readiness-index',
        '/reports/comparisons/class-to-class',
        '/reports/comparisons/teacher-to-teacher',
        '/reports/comparisons/term-to-term',
        '/reports/comparisons/internal-benchmark',
        '/reports/exports/inspection-reports',
        '/reports/exports/export-reports',
        '/reports/exports/audit-trail',
      ],
      'admin-approvals': ['/head-master/approvals/exam-results', '/head-master/approvals/syllabus-submissions', '/teachers/syllabus'],
      'admin-setups': ['/admin/setups/academic-year', '/admin/setups/terms', '/classrooms', '/subjects', '/admin/setups/periods', '/admin/setups/grade-levels'],
      'admin-settings': ['/settings', '/admin/permissions'],
    };
    return map;
  }, []);

  const canSeeItem = React.useCallback((item: any): boolean => {
    if (!isAuthenticated || !user) return false;
    if (!item.roles) return true;
    if (!item.roles.includes(user.role)) return false;
    
    // Check permissions based on role
    if (user.role === UserRole.HEAD_MASTER) {
      if (!headMasterAccess || !headMasterAccess.enabled) return true;
      const allowed = new Set(headMasterAccess.allowed || []);
      if (item.key && parentChildMap[item.key]) {
        const children = parentChildMap[item.key];
        return children.some(childPath => allowed.has(childPath));
      }
      if (item.path) return allowed.has(item.path);
      if (item.submenu) {
        return item.submenu.some((sub: any) => sub.path && allowed.has(sub.path));
      }
      return true;
    } else if (user.role === UserRole.TEACHER) {
      if (!teacherAccess || !teacherAccess.enabled) return true;
      const allowed = new Set(teacherAccess.allowed || []);
      if (item.path) return allowed.has(item.path);
      if (item.submenu) {
        return item.submenu.some((sub: any) => sub.path && allowed.has(sub.path));
      }
      return true;
    } else if (user.role === UserRole.PARENT) {
      if (!parentAccess || !parentAccess.enabled) return true;
      const allowed = new Set(parentAccess.allowed || []);
      if (item.path) return allowed.has(item.path);
      if (item.submenu) {
        return item.submenu.some((sub: any) => sub.path && allowed.has(sub.path));
      }
      return true;
    }
    
    return true;
  }, [isAuthenticated, user, headMasterAccess, teacherAccess, parentAccess, parentChildMap]);

  const visibleItems = React.useMemo(() => {
    const base = navigationItems.filter(canSeeItem);
    if (!user) return base;
    
    // Filter items based on role-specific permissions
    if (user.role === UserRole.HEAD_MASTER) {
      if (!headMasterAccess || !headMasterAccess.enabled) return base;
      const allowed = new Set(headMasterAccess.allowed || []);
      return base
        .map((item: any) => {
          if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((sub: any) => sub.path && allowed.has(sub.path));
            return filteredSubmenu.length > 0 ? { ...item, submenu: filteredSubmenu } : null;
          }
          if (item.path) return allowed.has(item.path) ? item : null;
          return item;
        })
        .filter(Boolean);
    } else if (user.role === UserRole.TEACHER) {
      if (!teacherAccess || !teacherAccess.enabled) return base;
      const allowed = new Set(teacherAccess.allowed || []);
      return base
        .map((item: any) => {
          if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((sub: any) => sub.path && allowed.has(sub.path));
            return filteredSubmenu.length > 0 ? { ...item, submenu: filteredSubmenu } : null;
          }
          if (item.path) return allowed.has(item.path) ? item : null;
          return item;
        })
        .filter(Boolean);
    } else if (user.role === UserRole.PARENT) {
      if (!parentAccess || !parentAccess.enabled) return base;
      const allowed = new Set(parentAccess.allowed || []);
      return base
        .map((item: any) => {
          if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((sub: any) => sub.path && allowed.has(sub.path));
            return filteredSubmenu.length > 0 ? { ...item, submenu: filteredSubmenu } : null;
          }
          if (item.path) return allowed.has(item.path) ? item : null;
          return item;
        })
        .filter(Boolean);
    }
    
    return base;
  }, [navigationItems, user, headMasterAccess, teacherAccess, parentAccess, canSeeItem, parentChildMap, accessKey]);

  const isActivePath = (path?: string): boolean => {
    if (!path) return false;
    return pathname === path;
  };

  const isActiveGroup = (item: any): boolean => {
    if (!item?.submenu) return false;
    return item.submenu.some((sub: any) => {
      if (sub.path && isActivePath(sub.path)) return true;
      if (sub.subsubmenu?.some((subsub: any) => isActivePath(subsub.path))) return true;
      return false;
    });
  };

  const navItemClass = (path: string) => {
    const isActive = pathname === path;
    return `
      w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 group
      ${isActive ? 'bg-black text-white font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
    `;
  };

  const navGroupClass = (active: boolean) => {
    return `
      w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 group
      ${active ? 'bg-black text-white font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
    `;
  };

  const subItemClass = (path: string) => {
    const isActive = pathname === path;
    return `
      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
      ${isActive ? 'text-slate-900 font-medium bg-slate-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
    `;
  };

  const subGroupClass = (active: boolean) => {
    return `
      w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200
      ${active ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
    `;
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Main Sidebar Panel */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-[70] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
      >
        {/* Sidebar Brand Header */}
        <div className={`px-6 py-5 bg-slate-900 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} shrink-0 overflow-hidden`}>
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-lg tracking-tight whitespace-nowrap" onClick={onClose}>
            <img 
              src="/logo.png" 
              alt="St. Peter's International school Logo" 
              className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'} object-contain transition-all duration-300`}
            />
            {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">St. Peter's International</span>}
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close Sidebar">
            {ICONS.Close()}
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin pb-4 overflow-x-hidden">
          {visibleItems.map((item, index) => {
            if (item.path) {
              // Single navigation item
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={navItemClass(item.path)}
                  onClick={onClose}
                  title={isCollapsed ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transition-colors ${isCollapsed ? 'scale-110' : ''}`}>
                      {item.icon?.()}
                    </span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            } else if (item.submenu) {
              // Navigation item with submenu (supports nested sub-menus)
              const menuKey = item.key || item.label.toLowerCase();
              const isExpanded = expandedMenus[menuKey] || false;
              const hasActiveSubItem = isActiveGroup(item);
              const defaultPath =
                (item.submenu?.find((s: any) => !!s.path)?.path as string | undefined) ||
                (item.submenu?.find((s: any) => s.subsubmenu?.length)?.subsubmenu?.[0]?.path as string | undefined);

              return (
                <div key={item.label}>
                  <div className={navGroupClass(hasActiveSubItem)} title={isCollapsed ? item.label : ""}>
                    <Link
                      href={defaultPath || '/'}
                      className={`flex items-center gap-3 flex-1 ${isCollapsed ? 'justify-center' : ''}`}
                      onClick={onClose}
                    >
                      <span className={`transition-colors ${isCollapsed ? 'scale-110' : ''}`}>
                        {item.icon?.()}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                    {!isCollapsed && (
                      <button
                        onClick={(e) => toggleSubmenu(menuKey, e)}
                        className="p-1 rounded-md hover:bg-white/10"
                        aria-label={`Toggle ${item.label}`}
                        type="button"
                      >
                        <span className="transition-all duration-200">
                          {isExpanded ? ICONS.ChevronDown() : ICONS.ChevronRight()}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Submenu items with nested sub-sub-menus */}
                  {!isCollapsed && isExpanded && item.submenu && (
                    <div className="ml-4 mt-2 space-y-0.5 border-l border-slate-200 pl-3 bg-slate-50 rounded-lg p-2">
                      {item.submenu.map((subItem) => {
                        // One-level submenu: direct links
                        if (subItem.path) {
                          const active = pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={subItemClass(subItem.path)}
                              onClick={onClose}
                            >
                              <span className={`transition-colors ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                                {subItem.icon?.()}
                              </span>
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        }

                        const subMenuKey = subItem.key;
                        const isSubExpanded = expandedMenus[subMenuKey] || false;
                        const hasActiveSubSubItem = subItem.subsubmenu?.some(subsub => pathname === subsub.path);

                        return (
                          <div key={subItem.label}>
                            <button
                              onClick={(e) => toggleSubmenu(subMenuKey, e)}
                              className={subGroupClass(!!hasActiveSubSubItem)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2.5">
                                  <span className={`transition-colors ${hasActiveSubSubItem ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {subItem.icon?.()}
                                  </span>
                                  <span>{subItem.label}</span>
                                </div>
                                <span className={`transition-transform duration-200 text-xs ${isSubExpanded ? 'rotate-90' : ''}`}>
                                  {ICONS.ChevronRight()}
                                </span>
                              </div>
                            </button>

                            {/* Sub-sub-menu items */}
                            {isSubExpanded && subItem.subsubmenu && (
                              <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3 bg-slate-50 rounded-lg p-2">
                                {subItem.subsubmenu.map((subSubItem) => (
                                  (() => {
                                    const active = pathname === subSubItem.path;
                                    return (
                                  <Link
                                    key={subSubItem.path}
                                    href={subSubItem.path}
                                    className={subItemClass(subSubItem.path)}
                                    onClick={onClose}
                                  >
                                    <span className={`transition-colors ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                                      {subSubItem.icon?.()}
                                    </span>
                                    <span>{subSubItem.label}</span>
                                  </Link>
                                    );
                                  })()
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>

        {/* Sidebar Footer Logout & Collapse */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          {isAuthenticated && user && (
            <div className={`mb-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
              <button
                onClick={() => logout()}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm`}
                title="Logout"
              >
                {ICONS.Logout()}
                {!isCollapsed && <span className="text-xs font-medium">Logout</span>}
              </button>
            </div>
          )}
          {onToggleCollapse && (
            <button 
              onClick={onToggleCollapse} 
              className={`hidden lg:flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-sm`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : (
                <>
                  <ChevronLeft size={16} />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;