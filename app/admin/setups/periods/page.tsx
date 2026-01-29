'use client';
import React, { useState, useEffect } from 'react';
import { Period, PeriodFormData } from '../../../../types';
import { periodService } from '../../../../lib/services/periodService';
import { ICONS } from '../../../../constants';

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<PeriodFormData>({
    name: '',
    startTime: '',
    endTime: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PeriodFormData, string>>>({});

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await periodService.getAll();
      setPeriods(data.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      setError('Failed to load periods. Please try again.');
      console.error('Error loading periods:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkOverlap = (startTime: string, endTime: string, excludeId?: string): boolean => {
    return periods.some(p => {
      if (p.id === excludeId) return false;
      const pStart = p.startTime;
      const pEnd = p.endTime;
      return (startTime >= pStart && startTime < pEnd) || (endTime > pStart && endTime <= pEnd) || (startTime <= pStart && endTime >= pEnd);
    });
  };

  const validateForm = (data: PeriodFormData): Partial<Record<keyof PeriodFormData, string>> => {
    const errors: Partial<Record<keyof PeriodFormData, string>> = {};

    if (!data.name.trim()) errors.name = 'Period name is required';
    if (!data.startTime) errors.startTime = 'Start time is required';
    if (!data.endTime) errors.endTime = 'End time is required';

    if (data.startTime && data.endTime) {
      if (data.startTime >= data.endTime) {
        errors.endTime = 'End time must be after start time';
      } else if (checkOverlap(data.startTime, data.endTime, selectedPeriod?.id)) {
        errors.endTime = 'This period overlaps with an existing period';
      }
    }

    return errors;
  };

  const handleAddPeriod = () => {
    setFormData({ name: '', startTime: '', endTime: '' });
    setFormErrors({});
    setSelectedPeriod(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditPeriod = (period: Period) => {
    setFormData({
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
    });
    setFormErrors({});
    setSelectedPeriod(period);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeletePeriod = (period: Period) => {
    setSelectedPeriod(period);
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
      if (selectedPeriod) {
        const updated = await periodService.update(selectedPeriod.id, formData);
        setPeriods(prev => prev.map(p => p.id === selectedPeriod.id ? updated : p).sort((a, b) => a.startTime.localeCompare(b.startTime)));
      } else {
        const newPeriod = await periodService.create(formData);
        setPeriods(prev => [...prev, newPeriod].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      }
      setShowFormModal(false);
      setSelectedPeriod(null);
      setFormData({ name: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save period. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPeriod) return;
    setIsSubmitting(true);
    try {
      await periodService.remove(selectedPeriod.id);
      setPeriods(prev => prev.filter(p => p.id !== selectedPeriod.id));
      setShowDeleteModal(false);
      setSelectedPeriod(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete period. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPeriods = periods.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
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
          <h1 className="text-3xl font-bold text-gray-900">Period Setup</h1>
          <p className="text-gray-600 mt-1">Manage class periods and schedules</p>
        </div>
        <button
          onClick={handleAddPeriod}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Period
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
                placeholder="Search by period name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredPeriods.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{periods.length}</span> periods
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Periods ({filteredPeriods.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPeriods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-gray-400">{ICONS.Clock}</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">No periods found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Click "Add Period" to create your first period'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPeriods.map((period) => {
                  const [startH, startM] = period.startTime.split(':').map(Number);
                  const [endH, endM] = period.endTime.split(':').map(Number);
                  const startMinutes = startH * 60 + startM;
                  const endMinutes = endH * 60 + endM;
                  const duration = endMinutes - startMinutes;
                  const hours = Math.floor(duration / 60);
                  const minutes = duration % 60;
                  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                  return (
                    <tr key={period.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="text-blue-600">{ICONS.Clock}</div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{period.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(period.startTime)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(period.endTime)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{durationText}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditPeriod(period)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePeriod(period)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
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

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedPeriod ? 'Edit Period' : 'Add New Period'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPeriod ? 'Update the period details' : 'Create a new period record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedPeriod(null);
                  setFormData({ name: '', startTime: '', endTime: '' });
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
                    Period Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="e.g., Period 1"
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
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        setFormData({ ...formData, startTime: e.target.value });
                        if (formErrors.startTime) setFormErrors({ ...formErrors, startTime: undefined });
                      }}
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.startTime && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {ICONS.Alert}
                        {formErrors.startTime}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => {
                        setFormData({ ...formData, endTime: e.target.value });
                        if (formErrors.endTime) setFormErrors({ ...formErrors, endTime: undefined });
                      }}
                      min={formData.startTime || undefined}
                      className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.endTime && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        {ICONS.Alert}
                        {formErrors.endTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormModal(false);
                      setSelectedPeriod(null);
                      setFormData({ name: '', startTime: '', endTime: '' });
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
                        {selectedPeriod ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      selectedPeriod ? 'Update Period' : 'Add Period'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedPeriod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Period</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPeriod(null);
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
                    Are you sure you want to delete <strong className="text-gray-900">{selectedPeriod.name}</strong>?
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
                    setSelectedPeriod(null);
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
                    'Delete Period'
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
