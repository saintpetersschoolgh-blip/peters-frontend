/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';

type StaffStatus = 'ACTIVE' | 'INACTIVE';

interface TeacherRecord {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subjectsCount: number;
  classroomsCount: number;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

interface TeacherFormData {
  staffNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subjectsCount: number;
  classroomsCount: number;
  status: StaffStatus;
}

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | 'ALL'>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<TeacherFormData>({
    staffNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subjectsCount: 0,
    classroomsCount: 0,
    status: 'ACTIVE',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});

  useEffect(() => {
    const mock: TeacherRecord[] = [
      {
        id: 't001',
        staffNumber: 'TCH001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'teacher@school.com',
        phoneNumber: '+233501234567',
        subjectsCount: 3,
        classroomsCount: 2,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 't002',
        staffNumber: 'TCH002',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@school.com',
        phoneNumber: '+233501234568',
        subjectsCount: 2,
        classroomsCount: 1,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 't003',
        staffNumber: 'TCH003',
        firstName: 'Grace',
        lastName: 'Mensah',
        email: 'grace.mensah@school.com',
        phoneNumber: '+233501234569',
        subjectsCount: 4,
        classroomsCount: 3,
        status: 'INACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setTeachers(mock);
      setLoading(false);
    }, 200);
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        `${t.firstName} ${t.lastName} ${t.staffNumber} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [teachers, searchTerm, selectedStatus]);

  const validate = (data: TeacherFormData) => {
    const errors: Partial<Record<keyof TeacherFormData, string>> = {};
    if (!data.staffNumber.trim()) errors.staffNumber = 'Staff number is required';
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.email.includes('@')) errors.email = 'Invalid email address';
    if (!data.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    return errors;
  };

  const openAdd = () => {
    setSelectedTeacher(null);
    setFormErrors({});
    setFormData({
      staffNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      subjectsCount: 0,
      classroomsCount: 0,
      status: 'ACTIVE',
    });
    setShowAddModal(true);
  };

  const openEdit = (teacher: TeacherRecord) => {
    setSelectedTeacher(teacher);
    setFormErrors({});
    setFormData({
      staffNumber: teacher.staffNumber,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      subjectsCount: teacher.subjectsCount,
      classroomsCount: teacher.classroomsCount,
      status: teacher.status,
    });
    setShowEditModal(true);
  };

  const openDelete = (teacher: TeacherRecord) => {
    setSelectedTeacher(teacher);
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

      if (selectedTeacher) {
        const updated: TeacherRecord = {
          ...selectedTeacher,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        setTeachers((prev) => prev.map((t) => (t.id === selectedTeacher.id ? updated : t)));
        setShowEditModal(false);
      } else {
        const newTeacher: TeacherRecord = {
          id: `t${String(teachers.length + 1).padStart(3, '0')}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTeachers((prev) => [newTeacher, ...prev]);
        setShowAddModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (teacher: TeacherRecord) => {
    const next: StaffStatus = teacher.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacher.id ? { ...t, status: next, updatedAt: new Date().toISOString() } : t)),
    );
  };

  const confirmDelete = async () => {
    if (!selectedTeacher) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setTeachers((prev) => prev.filter((t) => t.id !== selectedTeacher.id));
      setShowDeleteModal(false);
      setSelectedTeacher(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage teacher records and status</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Teacher
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
              placeholder="Search by name, staff number, or email..."
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Teachers ({filteredTeachers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignments
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
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`https://picsum.photos/seed/${t.id}/40/40`}
                          alt={`${t.firstName} ${t.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {t.firstName} {t.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.staffNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div>Subjects: {t.subjectsCount}</div>
                    <div className="text-gray-500">Classrooms: {t.classroomsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        t.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openEdit(t)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(t)} className="text-amber-600 hover:text-amber-900">
                        {t.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openDelete(t)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No teachers found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {(showAddModal || (showEditModal && selectedTeacher)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{selectedTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff Number *</label>
                  <input
                    value={formData.staffNumber}
                    onChange={(e) => setFormData({ ...formData, staffNumber: e.target.value.toUpperCase() })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.staffNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.staffNumber && <p className="text-red-500 text-xs mt-1">{formErrors.staffNumber}</p>}
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
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjects Count</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.subjectsCount}
                    onChange={(e) => setFormData({ ...formData, subjectsCount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classrooms Count</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.classroomsCount}
                    onChange={(e) => setFormData({ ...formData, classroomsCount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
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
                  {isSubmitting ? 'Saving...' : selectedTeacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Teacher</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this teacher record?</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedTeacher.firstName} {selectedTeacher.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedTeacher.staffNumber}</p>
                <p className="text-sm text-gray-600">{selectedTeacher.email}</p>
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

