'use client';
import React, { useState, useEffect } from 'react';
import { AcademicYear, AcademicYearFormData } from '../../../../types';
import { academicYearService } from '../../../../lib/services/academicYearService';
import { ICONS } from '../../../../constants';

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState<AcademicYearFormData>({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AcademicYearFormData, string>>>({});

  // Load academic years on mount
  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await academicYearService.getAll();
      setAcademicYears(data);
    } catch (err) {
      setError('Failed to load academic years. Please try again.');
      console.error('Error loading academic years:', err);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = (data: AcademicYearFormData): Partial<Record<keyof AcademicYearFormData, string>> => {
    const errors: Partial<Record<keyof AcademicYearFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = 'Academic year name is required';
    }

    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }
    }

    return errors;
  };

  // Modal handlers
  const handleAddAcademicYear = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
    });
    setFormErrors({});
    setSelectedAcademicYear(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditAcademicYear = (academicYear: AcademicYear) => {
    setFormData({
      name: academicYear.name,
      startDate: academicYear.startDate.split('T')[0], // Extract date part from ISO string
      endDate: academicYear.endDate.split('T')[0],
    });
    setFormErrors({});
    setSelectedAcademicYear(academicYear);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeleteAcademicYear = (academicYear: AcademicYear) => {
    setSelectedAcademicYear(academicYear);
    setShowDeleteModal(true);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedAcademicYear) {
        // Update existing academic year
        const updated = await academicYearService.update(selectedAcademicYear.id, formData);
        setAcademicYears(prev =>
          prev.map(ay => (ay.id === selectedAcademicYear.id ? updated : ay))
        );
      } else {
        // Create new academic year
        const newAcademicYear = await academicYearService.create(formData);
        setAcademicYears(prev => [...prev, newAcademicYear]);
      }

      setShowFormModal(false);
      setSelectedAcademicYear(null);
      setFormData({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save academic year. Please try again.');
      console.error('Error saving academic year:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedAcademicYear) return;

    setIsSubmitting(true);
    try {
      await academicYearService.remove(selectedAcademicYear.id);
      setAcademicYears(prev => prev.filter(ay => ay.id !== selectedAcademicYear.id));
      setShowDeleteModal(false);
      setSelectedAcademicYear(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete academic year. Please try again.');
      console.error('Error deleting academic year:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter academic years
  const filteredAcademicYears = academicYears.filter(ay =>
    ay.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get academic year status
  const getAcademicYearStatus = (academicYear: AcademicYear): 'current' | 'upcoming' | 'past' => {
    const now = new Date();
    const start = new Date(academicYear.startDate);
    const end = new Date(academicYear.endDate);

    if (now >= start && now <= end) return 'current';
    if (now < start) return 'upcoming';
    return 'past';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: 'current' | 'upcoming' | 'past') => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'past':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate duration in months
  const getDuration = (startDate: string, endDate: string): string => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return `${months} months`;
    } catch {
      return 'N/A';
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
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
          <h1 className="text-3xl font-bold text-gray-900">Academic Year Setup</h1>
          <p className="text-gray-600 mt-1">Manage academic year records and schedules</p>
        </div>
        <button
          onClick={handleAddAcademicYear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Academic Year
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {ICONS.Alert}
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Search/Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {ICONS.Search}
              </span>
              <input
                type="text"
                placeholder="Search by academic year name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredAcademicYears.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{academicYears.length}</span> academic years
            </div>
          </div>
        </div>
      </div>

      {/* Academic Years Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Academic Years ({filteredAcademicYears.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAcademicYears.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-gray-400">{ICONS.Calendar}</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">No academic years found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm
                            ? 'Try adjusting your search criteria'
                            : 'Click "Add Academic Year" to create your first academic year'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAcademicYears.map((academicYear) => {
                  const status = getAcademicYearStatus(academicYear);
                  return (
                    <tr key={academicYear.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="text-blue-600">{ICONS.Calendar}</div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{academicYear.name}</div>
                            <div className="text-xs text-gray-500">Academic Year</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(academicYear.startDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(academicYear.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {getDuration(academicYear.startDate, academicYear.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditAcademicYear(academicYear)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit academic year"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAcademicYear(academicYear)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete academic year"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal (Create/Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedAcademicYear ? 'Edit Academic Year' : 'Add New Academic Year'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAcademicYear ? 'Update the academic year details' : 'Create a new academic year record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedAcademicYear(null);
                  setFormData({ name: '', startDate: '', endDate: '' });
                  setFormErrors({});
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-6">

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  {ICONS.Alert}
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: undefined });
                      }
                    }}
                    placeholder="e.g., 2024-2025"
                    className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData({ ...formData, startDate: e.target.value });
                        if (formErrors.startDate) {
                          setFormErrors({ ...formErrors, startDate: undefined });
                        }
                        // Clear end date error if start date changes
                        if (formErrors.endDate && formData.endDate) {
                          const newEndDate = new Date(formData.endDate);
                          const newStartDate = new Date(e.target.value);
                          if (newStartDate < newEndDate) {
                            setFormErrors({ ...formErrors, endDate: undefined });
                          }
                        }
                      }}
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.startDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {ICONS.Alert}
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData({ ...formData, endDate: e.target.value });
                        if (formErrors.endDate) {
                          setFormErrors({ ...formErrors, endDate: undefined });
                        }
                      }}
                      min={formData.startDate || undefined}
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.endDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {ICONS.Alert}
                        {formErrors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormModal(false);
                      setSelectedAcademicYear(null);
                      setFormData({ name: '', startDate: '', endDate: '' });
                      setFormErrors({});
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {selectedAcademicYear ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {selectedAcademicYear ? 'Update Academic Year' : 'Add Academic Year'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAcademicYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Academic Year</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAcademicYear(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="text-red-600">{ICONS.AlertTriangle}</div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">
                    Are you sure you want to delete <strong className="text-gray-900">{selectedAcademicYear.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone. All associated data including classrooms, subjects, and academic records may be affected.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  {ICONS.Alert}
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAcademicYear(null);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Academic Year'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
