/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../../../constants';

type Relationship = 'FATHER' | 'MOTHER' | 'GUARDIAN';
type ParentStatus = 'ACTIVE' | 'INACTIVE';

interface ParentRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  relationship: Relationship;
  status: ParentStatus;
  createdAt: string;
  updatedAt: string;
}

interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  relationship: Relationship;
  status: ParentStatus;
}

export default function ParentManagementPage() {
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ParentStatus | 'ALL'>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<ParentRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ParentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    relationship: 'GUARDIAN',
    status: 'ACTIVE',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ParentFormData, string>>>({});

  useEffect(() => {
    const mock: ParentRecord[] = [
      {
        id: 'parent001',
        firstName: 'Robert',
        lastName: 'Doe',
        email: 'robert.doe@example.com',
        phoneNumber: '+233507654321',
        address: '123 Main St, Accra',
        relationship: 'FATHER',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'parent002',
        firstName: 'Mary',
        lastName: 'Smith',
        email: 'mary.smith@example.com',
        phoneNumber: '+233507654322',
        address: '456 Oak St, Accra',
        relationship: 'MOTHER',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'parent003',
        firstName: 'Kofi',
        lastName: 'Mensah',
        email: 'kofi.mensah@example.com',
        phoneNumber: '+233507654323',
        address: '789 Ring Rd, Accra',
        relationship: 'GUARDIAN',
        status: 'INACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setParents(mock);
      setLoading(false);
    }, 200);
  }, []);

  const filtered = useMemo(() => {
    return parents.filter((p) => {
      const matchesSearch = `${p.firstName} ${p.lastName} ${p.email} ${p.phoneNumber}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [parents, searchTerm, selectedStatus]);

  const validate = (data: ParentFormData) => {
    const errors: Partial<Record<keyof ParentFormData, string>> = {};
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.email.includes('@')) errors.email = 'Invalid email address';
    if (!data.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!data.address.trim()) errors.address = 'Address is required';
    return errors;
  };

  const openAdd = () => {
    setSelected(null);
    setFormErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      relationship: 'GUARDIAN',
      status: 'ACTIVE',
    });
    setShowAddModal(true);
  };

  const openEdit = (record: ParentRecord) => {
    setSelected(record);
    setFormErrors({});
    setFormData({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      address: record.address,
      relationship: record.relationship,
      status: record.status,
    });
    setShowEditModal(true);
  };

  const openDelete = (record: ParentRecord) => {
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
        const updated: ParentRecord = { ...selected, ...formData, updatedAt: new Date().toISOString() };
        setParents((prev) => prev.map((x) => (x.id === selected.id ? updated : x)));
        setShowEditModal(false);
      } else {
        const created: ParentRecord = {
          id: `parent${String(parents.length + 1).padStart(3, '0')}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setParents((prev) => [created, ...prev]);
        setShowAddModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = (record: ParentRecord) => {
    const next: ParentStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setParents((prev) =>
      prev.map((x) => (x.id === record.id ? { ...x, status: next, updatedAt: new Date().toISOString() } : x)),
    );
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setParents((prev) => prev.filter((x) => x.id !== selected.id));
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
          <h1 className="text-3xl font-bold text-gray-900">Parent Management</h1>
          <p className="text-gray-600 mt-1">Manage parent/guardian records and status</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Parent
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
              placeholder="Search by name, email, or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ParentStatus | 'ALL')}
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
          <h3 className="text-lg font-medium text-gray-900">Parents ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`https://picsum.photos/seed/${p.id}/40/40`}
                          alt={`${p.firstName} ${p.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {p.firstName} {p.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.relationship}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div>{p.phoneNumber}</div>
                    <div className="text-gray-500">{p.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(p)} className="text-amber-600 hover:text-amber-900">
                        {p.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openDelete(p)} className="text-red-600 hover:text-red-900">
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
            <p className="text-lg">No parents found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {(showAddModal || (showEditModal && selected)) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{selected ? 'Edit Parent' : 'Add Parent'}</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value as Relationship })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ParentStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
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
                  {isSubmitting ? 'Saving...' : selected ? 'Update Parent' : 'Add Parent'}
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
              <h2 className="text-xl font-semibold text-red-600">Delete Parent</h2>
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

