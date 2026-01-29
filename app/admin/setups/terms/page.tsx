'use client';
import React, { useState, useEffect } from 'react';
import { Term, TermFormData, AcademicYear } from '../../../../types';
import { termService } from '../../../../lib/services/termService';
import { academicYearService } from '../../../../lib/services/academicYearService';
import { ICONS } from '../../../../constants';

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<TermFormData>({
    name: '',
    academicYearId: '',
    startDate: '',
    endDate: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TermFormData, string>>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [termsData, yearsData] = await Promise.all([
        termService.getAll(),
        academicYearService.getAll(),
      ]);
      setTerms(termsData);
      setAcademicYears(yearsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data: TermFormData): Partial<Record<keyof TermFormData, string>> => {
    const errors: Partial<Record<keyof TermFormData, string>> = {};

    if (!data.name.trim()) errors.name = 'Term name is required';
    if (!data.academicYearId) errors.academicYearId = 'Academic year is required';
    if (!data.startDate) errors.startDate = 'Start date is required';
    if (!data.endDate) errors.endDate = 'End date is required';

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }

      if (data.academicYearId) {
        const academicYear = academicYears.find(ay => ay.id === data.academicYearId);
        if (academicYear) {
          const yearStart = new Date(academicYear.startDate);
          const yearEnd = new Date(academicYear.endDate);
          if (start < yearStart || start > yearEnd) {
            errors.startDate = 'Start date must be within academic year range';
          }
          if (end < yearStart || end > yearEnd) {
            errors.endDate = 'End date must be within academic year range';
          }
        }
      }
    }

    return errors;
  };

  const handleAddTerm = () => {
    setFormData({ name: '', academicYearId: '', startDate: '', endDate: '' });
    setFormErrors({});
    setSelectedTerm(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditTerm = (term: Term) => {
    setFormData({
      name: term.name,
      academicYearId: term.academicYearId,
      startDate: term.startDate.split('T')[0],
      endDate: term.endDate.split('T')[0],
    });
    setFormErrors({});
    setSelectedTerm(term);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeleteTerm = (term: Term) => {
    setSelectedTerm(term);
    setShowDeleteModal(true);
  };

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
      if (selectedTerm) {
        const updated = await termService.update(selectedTerm.id, formData);
        setTerms(prev => prev.map(t => t.id === selectedTerm.id ? updated : t));
      } else {
        const newTerm = await termService.create(formData);
        setTerms(prev => [...prev, newTerm]);
      }
      setShowFormModal(false);
      setSelectedTerm(null);
      setFormData({ name: '', academicYearId: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save term. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTerm) return;
    setIsSubmitting(true);
    try {
      await termService.remove(selectedTerm.id);
      setTerms(prev => prev.filter(t => t.id !== selectedTerm.id));
      setShowDeleteModal(false);
      setSelectedTerm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete term. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTerms = terms.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.academicYear?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Term Setup</h1>
          <p className="text-gray-600 mt-1">Manage academic terms and schedules</p>
        </div>
        <button
          onClick={handleAddTerm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Term
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            {ICONS.Alert}
            <span>{error}</span>
          </div>
        </div>
      )}

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
                placeholder="Search by term name or academic year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredTerms.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{terms.length}</span> terms
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Terms ({filteredTerms.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTerms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-gray-400">{ICONS.Calendar}</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">No terms found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Click "Add Term" to create your first term'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTerms.map((term) => (
                  <tr key={term.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="text-blue-600">{ICONS.Calendar}</div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{term.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{term.academicYear?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(term.startDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(term.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditTerm(term)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTerm(term)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTerm ? 'Edit Term' : 'Add New Term'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTerm ? 'Update the term details' : 'Create a new term record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedTerm(null);
                  setFormData({ name: '', academicYearId: '', startDate: '', endDate: '' });
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
                    Term Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="e.g., First Term"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.academicYearId}
                    onChange={(e) => {
                      setFormData({ ...formData, academicYearId: e.target.value });
                      if (formErrors.academicYearId) setFormErrors({ ...formErrors, academicYearId: undefined });
                    }}
                    className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      formErrors.academicYearId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Academic Year...</option>
                    {academicYears.map(ay => (
                      <option key={ay.id} value={ay.id}>{ay.name}</option>
                    ))}
                  </select>
                  {formErrors.academicYearId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.academicYearId}
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
                        if (formErrors.startDate) setFormErrors({ ...formErrors, startDate: undefined });
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
                        if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: undefined });
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
                      setSelectedTerm(null);
                      setFormData({ name: '', academicYearId: '', startDate: '', endDate: '' });
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
                        {selectedTerm ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      selectedTerm ? 'Update Term' : 'Add Term'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Term</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTerm(null);
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
                    Are you sure you want to delete <strong className="text-gray-900">{selectedTerm.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone. All associated data may be affected.
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
                    setSelectedTerm(null);
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
                    'Delete Term'
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
