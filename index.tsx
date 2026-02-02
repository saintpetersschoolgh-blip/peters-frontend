import React from 'react';
import { createRoot } from 'react-dom/client';
import { PathProvider, usePathname } from './lib/navigation';
import { AuthProvider, useAuth } from './lib/auth-context';
import RootLayout from './app/layout';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './app/page';
import AdminDashboardPage from './app/admin/dashboard/page';
import HeadMasterDashboardPage from './app/head-master/page';
import HeadMasterExamApprovalsPage from './app/head-master/approvals/exam-results/page';
import HeadMasterSyllabusApprovalsPage from './app/head-master/approvals/syllabus-submissions/page';
import TeacherDashboardPage from './app/teacher/dashboard/page';
import StudentDashboardPage from './app/student/dashboard/page';
import ParentDashboardPage from './app/parent/dashboard/page';
import StudentsManagementPage from './app/students/page';

// Developed Pages
import UsersPage from './app/users/page';
import ClassroomsManagementPage from './app/classrooms/page';
import SubjectsManagementPage from './app/subjects/page';
import StudentAttendancePage from './app/attendance/students/page';
import TeacherAttendancePage from './app/attendance/teachers/page';
import StudentProfilePage from './app/students/profile/page';
import StudentAttendanceViewPage from './app/students/attendance/page';
import FeesPage from './app/students/fees/page';
import ExamsManagementPage from './app/academic/exams/page';
import ExamResultsPage from './app/academic/results/page';
import FeeStructurePage from './app/finance/fees/page';
import FeePaymentsPage from './app/finance/payments/page';
import SendNotificationsPage from './app/notifications/send/page';
import FlaggedNotificationsPage from './app/notifications/flagged/page';
import AccountPage from './app/account/page';
import SettingsPage from './app/settings/page';
import AcademicYearPage from './app/admin/setups/academic-year/page';
import TermsPage from './app/admin/setups/terms/page';
import GradeLevelsPage from './app/admin/setups/grade-levels/page';
import ClassroomsSetupPage from './app/admin/setups/classrooms/page';
import SubjectsSetupPage from './app/admin/setups/subjects/page';
import PeriodsPage from './app/admin/setups/periods/page';
import LoginPage from './app/login/page';
import ForgotPasswordPage from './app/forgot-password/page';
import ResetPasswordPage from './app/reset-password/page';
import SessionExpiredPage from './app/session-expired/page';
import { UserRole } from './types';
import TeacherManagementPage from './app/admin/users/teachers/page';
import HeadMasterManagementPage from './app/admin/users/head-masters/page';
import ParentManagementPage from './app/admin/users/parents/page';
import TeacherFeaturePage from './app/teacher/feature-page';
import TeacherSyllabusPage from './app/teachers/syllabus/page';
import SyllabusProgressPage from './app/teachers/syllabus/progress/page';
import SubmitSyllabusPage from './app/teachers/syllabus/submit/page';
import SubmissionStatusPage from './app/teachers/syllabus/status/page';
import CreateSubjectSyllabusPage from './app/teachers/syllabus/create/page';
import TeacherTimetablePage from './app/teachers/timetable/page';
import PermissionsPage from './app/admin/permissions/page';

// Reports & Analytics Pages
import BestWorstSubjectsPage from './app/reports/performance/best-worst-subjects/page';
import BestWorstStudentsPage from './app/reports/performance/best-worst-students/page';
import MostImprovedSubjectsPage from './app/reports/performance/most-improved-subjects/page';
import MostImprovedStudentsPage from './app/reports/performance/most-improved-students/page';
import TeacherTargetsPage from './app/reports/performance/teacher-targets/page';
import SubjectPerformanceTrendPage from './app/reports/trends/subject-performance/page';
import StudentPerformanceTrendPage from './app/reports/trends/student-performance/page';
import ClassPerformanceTrendPage from './app/reports/trends/class-performance/page';
import AtRiskStudentsPage from './app/reports/risk/at-risk-students/page';
import AtRiskSubjectsPage from './app/reports/risk/at-risk-subjects/page';
import TeacherPerformanceRiskPage from './app/reports/risk/teacher-performance-risk/page';
import ExamFailureForecastPage from './app/reports/risk/exam-failure-forecast/page';
import TeacherVsSubjectPage from './app/reports/teacher/teacher-vs-subject/page';
import TeacherConsistencyPage from './app/reports/teacher/teacher-consistency/page';
import SyllabusCoveragePage from './app/reports/teacher/syllabus-coverage/page';
import TeacherLoadPage from './app/reports/teacher/teacher-load/page';
import CAVsExamVariancePage from './app/reports/assessment/ca-vs-exam-variance/page';
import ResultDistributionPage from './app/reports/assessment/result-distribution/page';
import TopicalPerformancePage from './app/reports/assessment/topical-performance/page';
import StudentAttendancePerformancePage from './app/reports/attendance/student-attendance-performance/page';
import TeacherAttendanceResultsPage from './app/reports/attendance/teacher-attendance-results/page';
import ClassAttendanceImpactPage from './app/reports/attendance/class-attendance-impact/page';
import SchoolWideTargetsPage from './app/reports/forecast/school-wide-targets/page';
import SubjectTargetForecastPage from './app/reports/forecast/subject-target-forecast/page';
import PromotionReadinessPage from './app/reports/forecast/promotion-readiness/page';
import ExamReadinessIndexPage from './app/reports/forecast/exam-readiness-index/page';
import ClassToClassPage from './app/reports/comparisons/class-to-class/page';
import TeacherToTeacherPage from './app/reports/comparisons/teacher-to-teacher/page';
import TermToTermPage from './app/reports/comparisons/term-to-term/page';
import InternalBenchmarkPage from './app/reports/comparisons/internal-benchmark/page';
import InspectionReportsPage from './app/reports/exports/inspection-reports/page';
import ExportReportsPage from './app/reports/exports/export-reports/page';
import AuditTrailPage from './app/reports/exports/audit-trail/page';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">
            An error occurred while loading this page. Please try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
            <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto">
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Placeholder Pages for remaining routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">
      This page is under development. Full functionality coming soon.
    </p>
  </div>
);

/**
 * NEXT.JS SIMULATED ROUTER - NO AUTHENTICATION
 * Direct access to all dashboards and pages
 */
const AppRouter = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/session-expired';

  const getDefaultRouteForRole = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.HEAD_MASTER:
        return '/head-master';
      case UserRole.TEACHER:
        return '/teacher';
      case UserRole.STUDENT:
        return '/student';
      case UserRole.PARENT:
        return '/parent';
      default:
        return '/';
    }
  };

  const hasAccess = (path: string): boolean => {
    if (!user) return false;

    // Shared pages (all authenticated users)
    if (path === '/' || path === '/account') return true;
    
    // Settings - only Admin and Headmaster
    if (path === '/settings') {
      return user.role === UserRole.ADMIN || user.role === UserRole.HEAD_MASTER;
    }

    // Notifications - allow parents to send messages
    if (path === '/notifications/send') {
      return (
        user.role === UserRole.ADMIN ||
        user.role === UserRole.HEAD_MASTER ||
        user.role === UserRole.TEACHER ||
        user.role === UserRole.PARENT
      );
    }
    if (path.startsWith('/notifications')) {
      return user.role === UserRole.ADMIN || user.role === UserRole.HEAD_MASTER;
    }

    // Admin + Head-master area
    if (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      path === '/users' ||
      path === '/classrooms' ||
      path === '/subjects' ||
      path === '/attendance/teachers' ||
      path.startsWith('/finance') ||
      path === '/students'
    ) {
      return user.role === UserRole.ADMIN || user.role === UserRole.HEAD_MASTER;
    }

    // Teacher can access student attendance + student profiles
    if (path === '/attendance/students') {
      return (
        user.role === UserRole.TEACHER ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.HEAD_MASTER
      );
    }

    // Head-master route (but allow admin to access approvals)
    if (path === '/head-master') {
      return user.role === UserRole.HEAD_MASTER;
    }
    if (path.startsWith('/head-master/approvals/')) {
      return user.role === UserRole.HEAD_MASTER || user.role === UserRole.ADMIN;
    }
    if (path.startsWith('/head-master/')) {
      return user.role === UserRole.HEAD_MASTER;
    }

    // Teacher area (but allow headmasters and admins to access timetable and syllabus)
    if (path === '/teachers/timetable') {
      return user.role === UserRole.TEACHER || user.role === UserRole.HEAD_MASTER || user.role === UserRole.ADMIN;
    }
    if (path === '/teachers/syllabus' || path.startsWith('/teachers/syllabus/')) {
      return user.role === UserRole.TEACHER || user.role === UserRole.HEAD_MASTER || user.role === UserRole.ADMIN;
    }
    if (path === '/teacher' || path.startsWith('/teacher') || path.startsWith('/teachers/')) {
      return user.role === UserRole.TEACHER;
    }

    // Student dashboard route
    if (path === '/student' || path.startsWith('/student/')) {
      return user.role === UserRole.STUDENT;
    }

    // Shared "student pages" paths for student/parent/teacher (depending on page)
    if (path === '/students/profile') {
      return user.role === UserRole.STUDENT || user.role === UserRole.PARENT || user.role === UserRole.TEACHER;
    }
    if (path === '/students/attendance') {
      return user.role === UserRole.STUDENT || user.role === UserRole.PARENT;
    }
    if (path === '/students/fees') {
      return user.role === UserRole.STUDENT || user.role === UserRole.PARENT;
    }
    if (path === '/students/classwork' || path === '/students/homework' || path === '/students/exams') {
      return user.role === UserRole.STUDENT;
    }

    // Parent area
    if (path === '/parent' || path.startsWith('/parent/')) {
      return user.role === UserRole.PARENT;
    }

    // Academic results can be seen by student + parent (and admins/head-master)
    if (path === '/academic/results') {
      return (
        user.role === UserRole.STUDENT ||
        user.role === UserRole.PARENT ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.HEAD_MASTER
      );
    }

    // Exams page: admins + head-master + teachers
    if (path === '/academic/exams') {
      return (
        user.role === UserRole.TEACHER ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.HEAD_MASTER
      );
    }

    // Reports & Analytics: Admin and Headmaster only
    if (path.startsWith('/reports/')) {
      return user.role === UserRole.ADMIN || user.role === UserRole.HEAD_MASTER;
    }

    // Unknown path: allow for now if authenticated (will render placeholder)
    return true;
  };

  // Auth gate: if not authenticated, force login (except public routes)
  if (!isAuthenticated && !isPublicRoute) {
    return <LoginPage />;
  }

  // If authenticated and trying to view auth pages, bounce to their dashboard.
  if (isAuthenticated && user && isPublicRoute) {
    const home = getDefaultRouteForRole(user.role);
    window.location.hash = `#${home}`;
    return null;
  }

  // If authenticated but not authorized for this path, show a friendly message.
  if (isAuthenticated && user && !isPublicRoute && !hasAccess(pathname)) {
    const home = getDefaultRouteForRole(user.role);
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h1>
          <p className="text-gray-600 mb-4">
            Your account ({user.username}) does not have access to <code>{pathname}</code>.
          </p>
          <button
            onClick={() => (window.location.hash = `#${home}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to my dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Home page with dashboard links
  if (pathname === '/') {
    return (
      <DashboardLayout>
        <HomePage />
      </DashboardLayout>
    );
  }

  // Auth pages
  if (pathname === '/login') return <LoginPage />;
  if (pathname === '/forgot-password') return <ForgotPasswordPage />;
  if (pathname === '/reset-password') return <ResetPasswordPage />;
  if (pathname === '/session-expired') return <SessionExpiredPage />;

  // Direct dashboard access
  if (pathname === '/admin') {
    return (
      <DashboardLayout>
        <AdminDashboardPage />
      </DashboardLayout>
    );
  }

  if (pathname === '/head-master') {
    return (
      <DashboardLayout>
        <HeadMasterDashboardPage />
      </DashboardLayout>
    );
  }

  if (pathname === '/head-master/approvals/exam-results') {
    return (
      <DashboardLayout>
        <ErrorBoundary><HeadMasterExamApprovalsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/head-master/approvals/syllabus-submissions') {
    return (
      <DashboardLayout>
        <ErrorBoundary><HeadMasterSyllabusApprovalsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teacher') {
    return (
      <DashboardLayout>
        <TeacherDashboardPage />
      </DashboardLayout>
    );
  }

  // Teacher feature routes
  if (pathname.startsWith('/teacher/')) {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherFeaturePage pathname={pathname} /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Teacher standalone pages (legacy /teachers/* routes)
  if (pathname === '/teachers/syllabus') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherSyllabusPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teachers/syllabus/progress') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SyllabusProgressPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teachers/syllabus/create') {
    return (
      <DashboardLayout>
        <ErrorBoundary><CreateSubjectSyllabusPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teachers/syllabus/submit') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SubmitSyllabusPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teachers/syllabus/status') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SubmissionStatusPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/teachers/timetable') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherTimetablePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/student') {
    return (
      <DashboardLayout>
        <StudentDashboardPage />
      </DashboardLayout>
    );
  }

  if (pathname === '/parent') {
    return (
      <DashboardLayout>
        <ParentDashboardPage />
      </DashboardLayout>
    );
  }

  // Student management page
  if (pathname === '/students') {
    return (
      <DashboardLayout>
        <StudentsManagementPage />
      </DashboardLayout>
    );
  }

  // Developed Admin Pages
  if (pathname === '/users') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <UsersPage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/classrooms') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <ClassroomsManagementPage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/subjects') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <SubjectsManagementPage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Admin - User Management sub-pages
  if (pathname === '/admin/users/teachers') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherManagementPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/users/head-masters') {
    return (
      <DashboardLayout>
        <ErrorBoundary><HeadMasterManagementPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/users/parents') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ParentManagementPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Attendance Pages
  if (pathname === '/attendance/students') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <StudentAttendancePage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/attendance/teachers') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <TeacherAttendancePage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Student Pages (shared with parents)
  if (pathname === '/students/profile') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <StudentProfilePage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/students/attendance') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <StudentAttendanceViewPage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/students/fees') {
    return (
      <DashboardLayout>
        <ErrorBoundary>
          <FeesPage />
        </ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Academic Pages
  if (pathname === '/academic/exams') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ExamsManagementPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/academic/results') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ExamResultsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Finance Pages
  if (pathname === '/finance/fees') {
    return (
      <DashboardLayout>
        <ErrorBoundary><FeeStructurePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/finance/payments') {
    return (
      <DashboardLayout>
        <ErrorBoundary><FeePaymentsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Notification Pages
  if (pathname === '/notifications/send') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SendNotificationsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/notifications/flagged') {
    return (
      <DashboardLayout>
        <ErrorBoundary><FlaggedNotificationsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Account Page
  if (pathname === '/account') {
    return (
      <DashboardLayout>
        <ErrorBoundary><AccountPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Settings Page
  if (pathname === '/settings') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SettingsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Admin Setups Pages
  if (pathname === '/admin/setups/academic-year') {
    return (
      <DashboardLayout>
        <ErrorBoundary><AcademicYearPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/setups/terms') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TermsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/setups/grade-levels') {
    return (
      <DashboardLayout>
        <ErrorBoundary><GradeLevelsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/setups/classrooms') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ClassroomsSetupPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/setups/subjects') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SubjectsSetupPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  if (pathname === '/admin/setups/periods') {
    return (
      <DashboardLayout>
        <ErrorBoundary><PeriodsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Admin Permissions Page
  if (pathname === '/admin/permissions') {
    return (
      <DashboardLayout>
        <ErrorBoundary><PermissionsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Performance Overview
  if (pathname === '/reports/performance/best-worst-subjects') {
    return (
      <DashboardLayout>
        <ErrorBoundary><BestWorstSubjectsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/performance/best-worst-students') {
    return (
      <DashboardLayout>
        <ErrorBoundary><BestWorstStudentsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/performance/most-improved-subjects') {
    return (
      <DashboardLayout>
        <ErrorBoundary><MostImprovedSubjectsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/performance/most-improved-students') {
    return (
      <DashboardLayout>
        <ErrorBoundary><MostImprovedStudentsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/performance/teacher-targets') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherTargetsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Trends & Growth
  if (pathname === '/reports/trends/subject-performance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SubjectPerformanceTrendPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/trends/student-performance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><StudentPerformanceTrendPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/trends/class-performance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ClassPerformanceTrendPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Risk & Alerts
  if (pathname === '/reports/risk/at-risk-students') {
    return (
      <DashboardLayout>
        <ErrorBoundary><AtRiskStudentsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/risk/at-risk-subjects') {
    return (
      <DashboardLayout>
        <ErrorBoundary><AtRiskSubjectsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/risk/teacher-performance-risk') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherPerformanceRiskPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/risk/exam-failure-forecast') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ExamFailureForecastPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Teacher Effectiveness
  if (pathname === '/reports/teacher/teacher-vs-subject') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherVsSubjectPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/teacher/teacher-consistency') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherConsistencyPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/teacher/syllabus-coverage') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SyllabusCoveragePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/teacher/teacher-load') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherLoadPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Assessment Quality
  if (pathname === '/reports/assessment/ca-vs-exam-variance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><CAVsExamVariancePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/assessment/result-distribution') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ResultDistributionPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/assessment/topical-performance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TopicalPerformancePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Attendance Impact
  if (pathname === '/reports/attendance/student-attendance-performance') {
    return (
      <DashboardLayout>
        <ErrorBoundary><StudentAttendancePerformancePage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/attendance/teacher-attendance-results') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherAttendanceResultsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/attendance/class-attendance-impact') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ClassAttendanceImpactPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Forecast & Targets
  if (pathname === '/reports/forecast/school-wide-targets') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SchoolWideTargetsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/forecast/subject-target-forecast') {
    return (
      <DashboardLayout>
        <ErrorBoundary><SubjectTargetForecastPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/forecast/promotion-readiness') {
    return (
      <DashboardLayout>
        <ErrorBoundary><PromotionReadinessPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/forecast/exam-readiness-index') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ExamReadinessIndexPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Comparisons
  if (pathname === '/reports/comparisons/class-to-class') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ClassToClassPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/comparisons/teacher-to-teacher') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TeacherToTeacherPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/comparisons/term-to-term') {
    return (
      <DashboardLayout>
        <ErrorBoundary><TermToTermPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/comparisons/internal-benchmark') {
    return (
      <DashboardLayout>
        <ErrorBoundary><InternalBenchmarkPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Reports & Analytics Routes - Exports & Audit
  if (pathname === '/reports/exports/inspection-reports') {
    return (
      <DashboardLayout>
        <ErrorBoundary><InspectionReportsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/exports/export-reports') {
    return (
      <DashboardLayout>
        <ErrorBoundary><ExportReportsPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }
  if (pathname === '/reports/exports/audit-trail') {
    return (
      <DashboardLayout>
        <ErrorBoundary><AuditTrailPage /></ErrorBoundary>
      </DashboardLayout>
    );
  }

  // Handle remaining routes with dashboard layout (for future development)
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {pathname.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page'}
        </h1>
        <p className="text-gray-600">
          This page is under development. Path: {pathname}
        </p>
      </div>
    </DashboardLayout>
  );
};

// Handle hot reloading properly
function initApp() {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root element not found');
    return;
  }

  // Clear any existing content to prevent hydration issues
  container.innerHTML = '';

  // Always create a new root for simplicity
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <PathProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </PathProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}