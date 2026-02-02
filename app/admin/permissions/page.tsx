/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../constants';

type SidebarConfig = {
  enabled: boolean;
  allowed: string[];
};

const SIDEBAR_CONFIG_KEY = 'sidebarPermissionsConfig';

const HEADMASTER_SECTIONS = [
  {
    title: 'Dashboard',
    items: [{ path: '/head-master', label: 'Dashboard' }],
  },
  {
    title: 'Students',
    items: [
      { path: '/students', label: 'All Students' },
      { path: '/attendance/students', label: 'Student Attendance' },
    ],
  },
  {
    title: 'Staff',
    items: [
      { path: '/admin/users/teachers', label: 'Teaching Staff' },
      { path: '/attendance/teachers', label: 'Staff Attendance' },
    ],
  },
  {
    title: 'Academics',
    items: [
      { path: '/classrooms', label: 'Classes & Arms' },
      { path: '/subjects', label: 'Subjects' },
      { path: '/teachers/timetable', label: 'Timetable' },
    ],
  },
  {
    title: 'Exams & Results',
    items: [
      { path: '/academic/exams', label: 'Exams Management' },
      { path: '/academic/results', label: 'Results Review & Approval' },
    ],
  },
  {
    title: 'Reports & Analytics',
    items: [
      { path: '/reports/performance/best-worst-subjects', label: 'Best & Worst Performing Subjects' },
      { path: '/reports/performance/best-worst-students', label: 'Best & Worst Performing Students' },
      { path: '/reports/performance/most-improved-subjects', label: 'Most Improved Subjects' },
      { path: '/reports/performance/most-improved-students', label: 'Most Improved Students' },
      { path: '/reports/performance/teacher-targets', label: 'Teacher Target Tracking' },
      { path: '/reports/trends/subject-performance', label: 'Subject Performance Trend' },
      { path: '/reports/trends/student-performance', label: 'Student Performance Trend' },
      { path: '/reports/trends/class-performance', label: 'Class Performance Trend' },
      { path: '/reports/risk/at-risk-students', label: 'At-Risk Students Report' },
      { path: '/reports/risk/at-risk-subjects', label: 'At-Risk Subjects' },
      { path: '/reports/risk/teacher-performance-risk', label: 'Teacher Performance Risk' },
      { path: '/reports/risk/exam-failure-forecast', label: 'Exam Failure Probability Forecast' },
      { path: '/reports/teacher/teacher-vs-subject', label: 'Teacher vs Subject Performance' },
      { path: '/reports/teacher/teacher-consistency', label: 'Teacher Consistency Report' },
      { path: '/reports/teacher/syllabus-coverage', label: 'Syllabus Coverage vs Results' },
      { path: '/reports/teacher/teacher-load', label: 'Teacher Load vs Performance' },
      { path: '/reports/assessment/ca-vs-exam-variance', label: 'CA vs Exam Variance Report' },
      { path: '/reports/assessment/result-distribution', label: 'Result Distribution Report' },
      { path: '/reports/assessment/topical-performance', label: 'Topical Performance Analysis' },
      { path: '/reports/attendance/student-attendance-performance', label: 'Student Attendance vs Performance' },
      { path: '/reports/attendance/teacher-attendance-results', label: 'Teacher Attendance vs Results' },
      { path: '/reports/attendance/class-attendance-impact', label: 'Class Attendance Impact Report' },
      { path: '/reports/forecast/school-wide-targets', label: 'School-Wide Target Achievement' },
      { path: '/reports/forecast/subject-target-forecast', label: 'Subject Target Forecast' },
      { path: '/reports/forecast/promotion-readiness', label: 'Promotion Readiness Report' },
      { path: '/reports/forecast/exam-readiness-index', label: 'Exam Readiness Index' },
      { path: '/reports/comparisons/class-to-class', label: 'Class-to-Class Comparison' },
      { path: '/reports/comparisons/teacher-to-teacher', label: 'Teacher-to-Teacher Comparison' },
      { path: '/reports/comparisons/term-to-term', label: 'Term-to-Term Comparison' },
      { path: '/reports/comparisons/internal-benchmark', label: 'Internal Benchmark Report' },
      { path: '/reports/exports/inspection-reports', label: 'Inspection-Ready Reports' },
      { path: '/reports/exports/export-reports', label: 'Export Reports (PDF/Excel)' },
      { path: '/reports/exports/audit-trail', label: 'Audit Trail Report' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { path: '/finance/fees', label: 'Fees Structure' },
      { path: '/finance/payments', label: 'Fee Collection Summary' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { path: '/notifications/send', label: 'Announcements & Notices' },
      { path: '/notifications/flagged', label: 'Flagged Items' },
    ],
  },
  {
    title: 'Approvals & Reviews',
    items: [
      { path: '/head-master/approvals/exam-results', label: 'Result Approval' },
      { path: '/head-master/approvals/syllabus-submissions', label: 'Syllabus Submissions' },
    ],
  },
  {
    title: 'Settings & Administration',
    items: [
      { path: '/users', label: 'User Management' },
      { path: '/admin/permissions', label: 'Roles & Permissions' },
      { path: '/admin/setups/academic-year', label: 'Academic Year / Term Setup' },
    ],
  },
];

const TEACHER_SECTIONS = [
  {
    title: 'Dashboard',
    items: [{ path: '/teacher', label: 'Dashboard' }],
  },
  {
    title: 'Students',
    items: [
      { path: '/teacher/students/list', label: 'My Students' },
      { path: '/teacher/classrooms', label: 'ClassRoom' },
      { path: '/teacher/subjects', label: 'Subject' },
    ],
  },
  {
    title: 'Syllabus',
    items: [{ path: '/teachers/syllabus', label: 'Syllabus' }],
  },
  {
    title: 'Assessments',
    items: [
      { path: '/teacher/assessments/exam-results', label: 'Exams Result' },
      { path: '/teacher/assignments/submissions', label: 'Assignment' },
    ],
  },
  {
    title: 'Attendance',
    items: [{ path: '/attendance/students', label: 'Attendance' }],
  },
  {
    title: 'Schedule',
    items: [
      { path: '/teachers/timetable', label: 'Timetable' },
      { path: '/teacher/schedule/events-exams', label: 'Exams Schedule' },
    ],
  },
];

const PARENT_SECTIONS = [
  {
    title: 'Dashboard',
    items: [{ path: '/parent', label: 'Dashboard' }],
  },
  {
    title: 'Child Information',
    items: [
      { path: '/students/profile', label: 'Child Profile' },
      { path: '/students/attendance', label: 'Child Attendance' },
    ],
  },
  {
    title: 'Academic',
    items: [{ path: '/academic/results', label: 'Academic Progress' }],
  },
  {
    title: 'Finance',
    items: [{ path: '/students/fees', label: 'Fee Payments' }],
  },
  {
    title: 'Communication',
    items: [{ path: '/notifications/send', label: 'Messages' }],
  },
];

const ALL_HEADMASTER_PATHS = HEADMASTER_SECTIONS.flatMap((section) => section.items.map((item) => item.path));
const ALL_TEACHER_PATHS = TEACHER_SECTIONS.flatMap((section) => section.items.map((item) => item.path));
const ALL_PARENT_PATHS = PARENT_SECTIONS.flatMap((section) => section.items.map((item) => item.path));

type TabType = 'headmaster' | 'teacher' | 'parent';

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('headmaster');
  const [loading, setLoading] = useState(true);

  // Headmaster state
  const [headMasters, setHeadMasters] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);
  const [selectedHeadmasterEmail, setSelectedHeadmasterEmail] = useState<string>('');
  const [headmasterAccess, setHeadmasterAccess] = useState<SidebarConfig>({ enabled: false, allowed: ALL_HEADMASTER_PATHS });

  // Teacher state
  const [teachers, setTeachers] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);
  const [selectedTeacherEmail, setSelectedTeacherEmail] = useState<string>('');
  const [teacherAccess, setTeacherAccess] = useState<SidebarConfig>({ enabled: false, allowed: ALL_TEACHER_PATHS });

  // Parent state
  const [parents, setParents] = useState<Array<{ id: string; firstName: string; lastName: string; email: string }>>([]);
  const [selectedParentEmail, setSelectedParentEmail] = useState<string>('');
  const [parentAccess, setParentAccess] = useState<SidebarConfig>({ enabled: false, allowed: ALL_PARENT_PATHS });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockHeadMasters = [
      { id: 'hm001', firstName: 'Head', lastName: 'Master', email: 'headmaster@school.com' },
      { id: 'hm002', firstName: 'Patricia', lastName: 'Owusu', email: 'patricia.owusu@school.com' },
    ];

    const mockTeachers = [
      { id: 't001', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@school.com' },
      { id: 't002', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@school.com' },
    ];

    const mockParents = [
      { id: 'p001', firstName: 'John', lastName: 'Doe', email: 'john.doe@parent.com' },
      { id: 'p002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@parent.com' },
    ];

    setTimeout(() => {
      setHeadMasters(mockHeadMasters);
      setTeachers(mockTeachers);
      setParents(mockParents);
      if (mockHeadMasters.length > 0) {
        setSelectedHeadmasterEmail(mockHeadMasters[0].email);
        loadHeadmasterAccess(mockHeadMasters[0].email);
      }
      if (mockTeachers.length > 0) {
        setSelectedTeacherEmail(mockTeachers[0].email);
        loadTeacherAccess(mockTeachers[0].email);
      }
      if (mockParents.length > 0) {
        setSelectedParentEmail(mockParents[0].email);
        loadParentAccess(mockParents[0].email);
      }
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (selectedHeadmasterEmail) loadHeadmasterAccess(selectedHeadmasterEmail);
  }, [selectedHeadmasterEmail]);

  useEffect(() => {
    if (selectedTeacherEmail) loadTeacherAccess(selectedTeacherEmail);
  }, [selectedTeacherEmail]);

  useEffect(() => {
    if (selectedParentEmail) loadParentAccess(selectedParentEmail);
  }, [selectedParentEmail]);

  const loadHeadmasterAccess = (email: string) => {
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, Record<string, SidebarConfig>>) : {};
      const config = map.headmaster?.[email] || { enabled: false, allowed: ALL_HEADMASTER_PATHS };
      setHeadmasterAccess(config);
    } catch {
      setHeadmasterAccess({ enabled: false, allowed: ALL_HEADMASTER_PATHS });
    }
  };

  const loadTeacherAccess = (email: string) => {
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, Record<string, SidebarConfig>>) : {};
      const config = map.teacher?.[email] || { enabled: false, allowed: ALL_TEACHER_PATHS };
      setTeacherAccess(config);
    } catch {
      setTeacherAccess({ enabled: false, allowed: ALL_TEACHER_PATHS });
    }
  };

  const loadParentAccess = (email: string) => {
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, Record<string, SidebarConfig>>) : {};
      const config = map.parent?.[email] || { enabled: false, allowed: ALL_PARENT_PATHS };
      setParentAccess(config);
    } catch {
      setParentAccess({ enabled: false, allowed: ALL_PARENT_PATHS });
    }
  };

  const saveAccess = (role: 'headmaster' | 'teacher' | 'parent', email: string, config: SidebarConfig) => {
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, Record<string, SidebarConfig>>) : {};
      if (!map[role]) map[role] = {};
      map[role][email] = config;
      localStorage.setItem(SIDEBAR_CONFIG_KEY, JSON.stringify(map));
      window.dispatchEvent(new Event('sidebar-permissions-updated'));
    } catch {
      // ignore storage errors
    }
  };

  const toggleHeadmasterItem = (path: string) => {
    const exists = headmasterAccess.allowed.includes(path);
    const next = exists
      ? headmasterAccess.allowed.filter((p) => p !== path)
      : [...headmasterAccess.allowed, path];
    const updated = { ...headmasterAccess, allowed: next };
    setHeadmasterAccess(updated);
    saveAccess('headmaster', selectedHeadmasterEmail, updated);
  };

  const toggleHeadmasterSection = (sectionTitle: string) => {
    const section = HEADMASTER_SECTIONS.find((s) => s.title === sectionTitle);
    if (!section) return;
    const sectionPaths = section.items.map((item) => item.path);
    const allChecked = sectionPaths.every((path) => headmasterAccess.allowed.includes(path));
    let next: string[];
    if (allChecked) {
      next = headmasterAccess.allowed.filter((p) => !sectionPaths.includes(p));
    } else {
      const newPaths = sectionPaths.filter((p) => !headmasterAccess.allowed.includes(p));
      next = [...headmasterAccess.allowed, ...newPaths];
    }
    const updated = { ...headmasterAccess, allowed: next };
    setHeadmasterAccess(updated);
    saveAccess('headmaster', selectedHeadmasterEmail, updated);
  };

  const toggleTeacherItem = (path: string) => {
    const exists = teacherAccess.allowed.includes(path);
    const next = exists
      ? teacherAccess.allowed.filter((p) => p !== path)
      : [...teacherAccess.allowed, path];
    const updated = { ...teacherAccess, allowed: next };
    setTeacherAccess(updated);
    saveAccess('teacher', selectedTeacherEmail, updated);
  };

  const toggleTeacherSection = (sectionTitle: string) => {
    const section = TEACHER_SECTIONS.find((s) => s.title === sectionTitle);
    if (!section) return;
    const sectionPaths = section.items.map((item) => item.path);
    const allChecked = sectionPaths.every((path) => teacherAccess.allowed.includes(path));
    let next: string[];
    if (allChecked) {
      next = teacherAccess.allowed.filter((p) => !sectionPaths.includes(p));
    } else {
      const newPaths = sectionPaths.filter((p) => !teacherAccess.allowed.includes(p));
      next = [...teacherAccess.allowed, ...newPaths];
    }
    const updated = { ...teacherAccess, allowed: next };
    setTeacherAccess(updated);
    saveAccess('teacher', selectedTeacherEmail, updated);
  };

  const toggleParentItem = (path: string) => {
    const exists = parentAccess.allowed.includes(path);
    const next = exists
      ? parentAccess.allowed.filter((p) => p !== path)
      : [...parentAccess.allowed, path];
    const updated = { ...parentAccess, allowed: next };
    setParentAccess(updated);
    saveAccess('parent', selectedParentEmail, updated);
  };

  const toggleParentSection = (sectionTitle: string) => {
    const section = PARENT_SECTIONS.find((s) => s.title === sectionTitle);
    if (!section) return;
    const sectionPaths = section.items.map((item) => item.path);
    const allChecked = sectionPaths.every((path) => parentAccess.allowed.includes(path));
    let next: string[];
    if (allChecked) {
      next = parentAccess.allowed.filter((p) => !sectionPaths.includes(p));
    } else {
      const newPaths = sectionPaths.filter((p) => !parentAccess.allowed.includes(p));
      next = [...parentAccess.allowed, ...newPaths];
    }
    const updated = { ...parentAccess, allowed: next };
    setParentAccess(updated);
    saveAccess('parent', selectedParentEmail, updated);
  };

  const toggleAccessEnabled = (role: 'headmaster' | 'teacher' | 'parent', email: string, enabled: boolean) => {
    if (role === 'headmaster') {
      const allowed = headmasterAccess.allowed.length ? headmasterAccess.allowed : ALL_HEADMASTER_PATHS;
      const updated = { enabled, allowed };
      setHeadmasterAccess(updated);
      saveAccess('headmaster', email, updated);
    } else if (role === 'teacher') {
      const allowed = teacherAccess.allowed.length ? teacherAccess.allowed : ALL_TEACHER_PATHS;
      const updated = { enabled, allowed };
      setTeacherAccess(updated);
      saveAccess('teacher', email, updated);
    } else if (role === 'parent') {
      const allowed = parentAccess.allowed.length ? parentAccess.allowed : ALL_PARENT_PATHS;
      const updated = { enabled, allowed };
      setParentAccess(updated);
      saveAccess('parent', email, updated);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderHeadmasterTab = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Headmaster Sidebar Permissions</h3>
          <p className="text-sm text-gray-600">Select what appears on the headmaster sidebar.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={headmasterAccess.enabled}
            onChange={(e) => toggleAccessEnabled('headmaster', selectedHeadmasterEmail, e.target.checked)}
          />
          Enable custom sidebar
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Headmaster</label>
          <select
            value={selectedHeadmasterEmail}
            onChange={(e) => setSelectedHeadmasterEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {headMasters.map((h) => (
              <option key={h.id} value={h.email}>
                {h.firstName} {h.lastName} ({h.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HEADMASTER_SECTIONS.map((section) => {
          const sectionPaths = section.items.map((item) => item.path);
          const allChecked = sectionPaths.every((path) => headmasterAccess.allowed.includes(path));
          const someChecked = sectionPaths.some((path) => headmasterAccess.allowed.includes(path));

          return (
            <div key={section.title} className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allChecked}
                  ref={(input) => {
                    if (input) input.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={() => toggleHeadmasterSection(section.title)}
                />
                {section.title}
              </label>
              <div className="space-y-2 ml-6">
                {section.items.map((item) => (
                  <label key={item.path} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={headmasterAccess.allowed.includes(item.path)}
                      onChange={() => toggleHeadmasterItem(item.path)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTeacherTab = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Teacher Sidebar Permissions</h3>
          <p className="text-sm text-gray-600">Select what appears on the teacher sidebar.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={teacherAccess.enabled}
            onChange={(e) => toggleAccessEnabled('teacher', selectedTeacherEmail, e.target.checked)}
          />
          Enable custom sidebar
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
          <select
            value={selectedTeacherEmail}
            onChange={(e) => setSelectedTeacherEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.email}>
                {t.firstName} {t.lastName} ({t.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEACHER_SECTIONS.map((section) => {
          const sectionPaths = section.items.map((item) => item.path);
          const allChecked = sectionPaths.every((path) => teacherAccess.allowed.includes(path));
          const someChecked = sectionPaths.some((path) => teacherAccess.allowed.includes(path));

          return (
            <div key={section.title} className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allChecked}
                  ref={(input) => {
                    if (input) input.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={() => toggleTeacherSection(section.title)}
                />
                {section.title}
              </label>
              <div className="space-y-2 ml-6">
                {section.items.map((item) => (
                  <label key={item.path} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={teacherAccess.allowed.includes(item.path)}
                      onChange={() => toggleTeacherItem(item.path)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderParentTab = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Parent Sidebar Permissions</h3>
          <p className="text-sm text-gray-600">Select what appears on the parent sidebar.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={parentAccess.enabled}
            onChange={(e) => toggleAccessEnabled('parent', selectedParentEmail, e.target.checked)}
          />
          Enable custom sidebar
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parent</label>
          <select
            value={selectedParentEmail}
            onChange={(e) => setSelectedParentEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {parents.map((p) => (
              <option key={p.id} value={p.email}>
                {p.firstName} {p.lastName} ({p.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PARENT_SECTIONS.map((section) => {
          const sectionPaths = section.items.map((item) => item.path);
          const allChecked = sectionPaths.every((path) => parentAccess.allowed.includes(path));
          const someChecked = sectionPaths.some((path) => parentAccess.allowed.includes(path));

          return (
            <div key={section.title} className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allChecked}
                  ref={(input) => {
                    if (input) input.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={() => toggleParentSection(section.title)}
                />
                {section.title}
              </label>
              <div className="space-y-2 ml-6">
                {section.items.map((item) => (
                  <label key={item.path} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={parentAccess.allowed.includes(item.path)}
                      onChange={() => toggleParentItem(item.path)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
          <p className="text-gray-600 mt-1">Manage sidebar permissions for headmasters, teachers, and parents</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('headmaster')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'headmaster'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Headmaster Permissions
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'teacher'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Teacher Permissions
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'parent'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parent Permissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'headmaster' && renderHeadmasterTab()}
          {activeTab === 'teacher' && renderTeacherTab()}
          {activeTab === 'parent' && renderParentTab()}
        </div>
      </div>
    </div>
  );
}
