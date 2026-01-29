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
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // State for expanded submenus (supports nested expansion)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'admin-users': pathname === '/users' || pathname === '/students' || pathname.startsWith('/admin/users'),
    'admin-academic': pathname === '/classrooms' || pathname === '/subjects' || pathname.startsWith('/academic'),
    'admin-attendance': pathname.startsWith('/attendance'),
    'admin-finance': pathname.startsWith('/finance'),
    'admin-communication': pathname.startsWith('/notifications'),
    'admin-setups': pathname.startsWith('/admin/setups'),
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
      'admin-users': pathname === '/users' || pathname === '/students' || pathname.startsWith('/admin/users'),
      'admin-academic': pathname === '/classrooms' || pathname === '/subjects' || pathname.startsWith('/academic'),
      'admin-attendance': pathname.startsWith('/attendance'),
      'admin-finance': pathname.startsWith('/finance'),
      'admin-communication': pathname.startsWith('/notifications'),
      'admin-setups': pathname.startsWith('/admin/setups'),
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
        { path: '/classrooms', label: 'Classrooms', icon: ICONS.LayoutGrid },
        { path: '/subjects', label: 'Subjects', icon: ICONS.BookOpen },
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
      label: 'Setups',
      icon: ICONS.Settings,
      key: 'admin-setups',
      roles: [UserRole.ADMIN],
      submenu: [
        { path: '/admin/setups/academic-year', label: 'Academic Year', icon: ICONS.Calendar },
        { path: '/admin/setups/terms', label: 'Term', icon: ICONS.Calendar },
        { path: '/admin/setups/classrooms', label: 'ClassRoom', icon: ICONS.LayoutGrid },
        { path: '/admin/setups/subjects', label: 'Subject', icon: ICONS.BookOpen },
        { path: '/admin/setups/periods', label: 'Period', icon: ICONS.Clock },
        { path: '/admin/setups/grade-levels', label: 'Grade Level', icon: ICONS.Cap },
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

  const canSeeItem = (item: any): boolean => {
    if (!isAuthenticated || !user) return false;
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  };

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
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
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
            {ICONS.Close}
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin pb-4 overflow-x-hidden">
          {navigationItems.filter(canSeeItem).map((item, index) => {
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
                      {item.icon}
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
                        {item.icon}
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
                        <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          {ICONS.ChevronDown}
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
                                {subItem.icon}
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
                                    {subItem.icon}
                                  </span>
                                  <span>{subItem.label}</span>
                                </div>
                                <span className={`transition-transform duration-200 text-xs ${isSubExpanded ? 'rotate-90' : ''}`}>
                                  {ICONS.ChevronRight}
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
                                      {subSubItem.icon}
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
                {ICONS.Logout}
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