/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';

type StaffStatus = 'ACTIVE' | 'INACTIVE';

interface HeadMasterRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

interface HeadMasterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: StaffStatus;
}

type SidebarConfig = {
  enabled: boolean;
  allowed: string[];
};

const SIDEBAR_CONFIG_KEY = 'headMasterSidebarConfig';

const SIDEBAR_SECTIONS = [
  {
    title: 'Dashboard',
    items: [{ path: '/head-master', label: 'Dashboard' }],
  },
  {
    title: 'Approvals',
    items: [{ path: '/head-master/approvals/exam-results', label: 'Exam Approvals' }],
  },
  {
    title: 'User Management',
    items: [
      { path: '/users', label: 'User Management' },
      { path: '/students', label: 'Student Management' },
      { path: '/admin/users/teachers', label: 'Teacher Management' },
      { path: '/admin/users/head-masters', label: 'Head Master Management' },
      { path: '/admin/users/parents', label: 'Parent Management' },
    ],
  },
  {
    title: 'Academic Management',
    items: [
      { path: '/classrooms', label: 'Classrooms' },
      { path: '/subjects', label: 'Subjects' },
      { path: '/academic/exams', label: 'Exams' },
      { path: '/academic/results', label: 'Exam Results' },
    ],
  },
  {
    title: 'Attendance Management',
    items: [
      { path: '/attendance/students', label: 'Student Attendance' },
      { path: '/attendance/teachers', label: 'Teacher Attendance' },
    ],
  },
  {
    title: 'Financial Management',
    items: [
      { path: '/finance/fees', label: 'Fee Structure' },
      { path: '/finance/payments', label: 'Fee Payments' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { path: '/notifications/send', label: 'Send Notifications' },
      { path: '/notifications/flagged', label: 'Flagged Items' },
    ],
  },
  {
    title: 'Setups',
    items: [
      { path: '/admin/setups/academic-year', label: 'Academic Year' },
      { path: '/admin/setups/terms', label: 'Term' },
      { path: '/admin/setups/classrooms', label: 'ClassRoom' },
      { path: '/admin/setups/subjects', label: 'Subject' },
      { path: '/admin/setups/periods', label: 'Period' },
      { path: '/admin/setups/grade-levels', label: 'Grade Level' },
    ],
  },
];

const ALL_HEADMASTER_PATHS = SIDEBAR_SECTIONS.flatMap((section) => section.items.map((item) => item.path));

export default function HeadMasterManagementPage() {
  const [headMasters, setHeadMasters] = useState<HeadMasterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | 'ALL'>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<HeadMasterRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<HeadMasterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: 'ACTIVE',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof HeadMasterFormData, string>>>({});
  const [selectedAccessEmail, setSelectedAccessEmail] = useState<string>('');
  const [sidebarAccess, setSidebarAccess] = useState<SidebarConfig>({ enabled: false, allowed: ALL_HEADMASTER_PATHS });

  useEffect(() => {
    const mock: HeadMasterRecord[] = [
      {
        id: 'hm001',
        firstName: 'Head',
        lastName: 'Master',
        email: 'headmaster@school.com',
        phoneNumber: '+233501000001',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'hm002',
        firstName: 'Patricia',
        lastName: 'Owusu',
        email: 'patricia.owusu@school.com',
        phoneNumber: '+233501000002',
        status: 'INACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setHeadMasters(mock);
      setSelectedAccessEmail(mock[0]?.email || '');
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!selectedAccessEmail) return;
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, SidebarConfig>) : {};
      const current = map[selectedAccessEmail] || { enabled: false, allowed: ALL_HEADMASTER_PATHS };
      setSidebarAccess({
        enabled: Boolean(current.enabled),
        allowed: current.allowed?.length ? current.allowed : ALL_HEADMASTER_PATHS,
      });
    } catch {
      setSidebarAccess({ enabled: false, allowed: ALL_HEADMASTER_PATHS });
    }
  }, [selectedAccessEmail]);

  const filtered = useMemo(() => {
    return headMasters.filter((h) => {
      const matchesSearch = `${h.firstName} ${h.lastName} ${h.email}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || h.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [headMasters, searchTerm, selectedStatus]);

  const validate = (data: HeadMasterFormData) => {
    const errors: Partial<Record<keyof HeadMasterFormData, string>> = {};
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.email.includes('@')) errors.email = 'Invalid email address';
    if (!data.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    return errors;
  };

  const openAdd = () => {
    setSelected(null);
    setFormErrors({});
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', status: 'ACTIVE' });
    setShowAddModal(true);
  };

  const openEdit = (record: HeadMasterRecord) => {
    setSelected(record);
    setFormErrors({});
    setFormData({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      status: record.status,
    });
    setShowEditModal(true);
  };

  const openDelete = (record: HeadMasterRecord) => {
    setSelected(record);
    setShowDeleteModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (selected) {
        const updated: HeadMasterRecord = { ...selected, ...formData, updatedAt: new Date().toISOString() };
        setHeadMasters((prev) => prev.map((x) => (x.id === selected.id ? updated : x)));
        setShowEditModal(false);
      } else {
        const created: HeadMasterRecord = {
          id: `hm${String(headMasters.length + 1).padStart(3, '0')}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setHeadMasters((prev) => [created, ...prev]);
        setShowAddModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = (record: HeadMasterRecord) => {
    const next: StaffStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setHeadMasters((prev) =>
      prev.map((x) => (x.id === record.id ? { ...x, status: next, updatedAt: new Date().toISOString() } : x)),
    );
  };

  const saveSidebarAccess = (next: SidebarConfig) => {
    if (!selectedAccessEmail) return;
    setSidebarAccess(next);
    try {
      const raw = localStorage.getItem(SIDEBAR_CONFIG_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, SidebarConfig>) : {};
      map[selectedAccessEmail] = next;
      localStorage.setItem(SIDEBAR_CONFIG_KEY, JSON.stringify(map));
      window.dispatchEvent(new Event('headmaster-sidebar-updated'));
    } catch {
      // ignore storage errors
    }
  };

  const toggleAccessItem = (path: string) => {
    const exists = sidebarAccess.allowed.includes(path);
    const next = exists
      ? sidebarAccess.allowed.filter((p) => p !== path)
      : [...sidebarAccess.allowed, path];
    saveSidebarAccess({ ...sidebarAccess, allowed: next });
  };

  const toggleAccessSection = (sectionTitle: string) => {
    const section = SIDEBAR_SECTIONS.find((s) => s.title === sectionTitle);
    if (!section) return;

    const sectionPaths = section.items.map((item) => item.path);
    const allChecked = sectionPaths.every((path) => sidebarAccess.allowed.includes(path));

    let next: string[];
    if (allChecked) {
      // Uncheck parent: remove all children
      next = sidebarAccess.allowed.filter((p) => !sectionPaths.includes(p));
    } else {
      // Check parent: add all children
      const newPaths = sectionPaths.filter((p) => !sidebarAccess.allowed.includes(p));
      next = [...sidebarAccess.allowed, ...newPaths];
    }
    saveSidebarAccess({ ...sidebarAccess, allowed: next });
  };

  const toggleAccessEnabled = (enabled: boolean) => {
    const allowed = sidebarAccess.allowed.length ? sidebarAccess.allowed : ALL_HEADMASTER_PATHS;
    saveSidebarAccess({ enabled, allowed });
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setHeadMasters((prev) => prev.filter((x) => x.id !== selected.id));
      setShowDeleteModal(false);
      setSelected(null);
    } finally {
      setIsSubmitting(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Head Master Management</h1>
          <p className="text-gray-600 mt-1">Manage head-master records and status</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Head Master
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StaffStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Headmaster Sidebar Access</h3>
            <p className="text-sm text-gray-600">Select what appears on the headmaster sidebar.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={sidebarAccess.enabled}
              onChange={(e) => toggleAccessEnabled(e.target.checked)}
            />
            Enable custom sidebar
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Headmaster</label>
            <select
              value={selectedAccessEmail}
              onChange={(e) => setSelectedAccessEmail(e.target.value)}
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
          {SIDEBAR_SECTIONS.map((section) => {
            const sectionPaths = section.items.map((item) => item.path);
            const allChecked = sectionPaths.every((path) => sidebarAccess.allowed.includes(path));
            const someChecked = sectionPaths.some((path) => sidebarAccess.allowed.includes(path));

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
                    onChange={() => toggleAccessSection(section.title)}
                  />
                  {section.title}
                </label>
                <div className="space-y-2 ml-6">
                  {section.items.map((item) => (
                    <label key={item.path} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={sidebarAccess.allowed.includes(item.path)}
                        onChange={() => toggleAccessItem(item.path)}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Head Masters ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Head Master
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`https://picsum.photos/seed/${h.id}/40/40`}
                          alt={`${h.firstName} ${h.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {h.firstName} {h.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{h.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{h.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        h.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openEdit(h)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(h)} className="text-amber-600 hover:text-amber-900">
                        {h.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openDelete(h)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No head masters found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {(showAddModal || (showEditModal && selected)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{selected ? 'Edit Head Master' : 'Add Head Master'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : selected ? 'Update Head Master' : 'Add Head Master'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Head Master</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this record?</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selected.firstName} {selected.lastName}
                </p>
                <p className="text-sm text-gray-600">{selected.email}</p>
                <p className="text-sm text-gray-600">{selected.phoneNumber}</p>
              </div>
              <p className="text-red-600 text-sm mt-3">This action cannot be undone.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

