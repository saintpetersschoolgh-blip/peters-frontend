'use client';
import React, { useState, useEffect } from 'react';
import { GradeLevel, GradeLevelFormData } from './types';
import { gradeLevelService } from './services/gradeLevelService';
import GradeLevelTable from './components/GradeLevelTable';
import GradeLevelForm from './components/GradeLevelForm';
import { ICONS } from '../../../../constants';

export default function GradeLevelsPage() {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<GradeLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGradeLevels();
  }, []);

  const loadGradeLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gradeLevelService.getAll();
      setGradeLevels(data);
    } catch (err) {
      setError('Failed to load grade levels. Please try again.');
      console.error('Error loading grade levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGradeLevel = () => {
    setSelectedGradeLevel(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditGradeLevel = (gradeLevel: GradeLevel) => {
    setSelectedGradeLevel(gradeLevel);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeleteGradeLevel = (gradeLevel: GradeLevel) => {
    setSelectedGradeLevel(gradeLevel);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (data: GradeLevelFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedGradeLevel) {
        const updated = await gradeLevelService.update(selectedGradeLevel.id, data);
        setGradeLevels(prev => prev.map(gl => gl.id === selectedGradeLevel.id ? updated : gl));
      } else {
        const newGradeLevel = await gradeLevelService.create(data);
        setGradeLevels(prev => [...prev, newGradeLevel]);
      }
      setShowFormModal(false);
      setSelectedGradeLevel(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save grade level. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGradeLevel) return;

    setIsSubmitting(true);
    try {
      await gradeLevelService.remove(selectedGradeLevel.id);
      setGradeLevels(prev => prev.filter(gl => gl.id !== selectedGradeLevel.id));
      setShowDeleteModal(false);
      setSelectedGradeLevel(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete grade level. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGradeLevels = gradeLevels.filter(gl =>
    gl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gl.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gl.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Grade Level Setup</h1>
          <p className="text-gray-600 mt-1">Manage grade level configurations</p>
        </div>
        <button
          onClick={handleAddGradeLevel}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Grade Level
        </button>
      </div>

      {error && !showFormModal && (
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
                placeholder="Search by name, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredGradeLevels.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{gradeLevels.length}</span> grade levels
            </div>
          </div>
        </div>
      </div>

      <GradeLevelTable
        gradeLevels={filteredGradeLevels}
        onEdit={handleEditGradeLevel}
        onDelete={handleDeleteGradeLevel}
      />

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedGradeLevel ? 'Edit Grade Level' : 'Add New Grade Level'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedGradeLevel ? 'Update the grade level details' : 'Create a new grade level record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedGradeLevel(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-6">
              <GradeLevelForm
                gradeLevel={selectedGradeLevel}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowFormModal(false);
                  setSelectedGradeLevel(null);
                  setError(null);
                }}
                isSubmitting={isSubmitting}
                error={error}
                existingGradeLevels={gradeLevels}
              />
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedGradeLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Grade Level</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGradeLevel(null);
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
                    Are you sure you want to delete <strong className="text-gray-900">{selectedGradeLevel.name}</strong>?
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
                    setSelectedGradeLevel(null);
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
                    'Delete Grade Level'
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
