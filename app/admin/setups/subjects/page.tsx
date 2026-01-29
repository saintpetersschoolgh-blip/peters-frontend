'use client';
import React, { useState, useEffect } from 'react';
import { Subject, SubjectFormData } from './types';
import { subjectService } from './services/subjectService';
import SubjectTable from './components/SubjectTable';
import SubjectForm from './components/SubjectForm';
import { ICONS } from '../../../../constants';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      setError('Failed to load subjects. Please try again.');
      console.error('Error loading subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedSubject) {
        const updated = await subjectService.update(selectedSubject.id, data);
        setSubjects(prev => prev.map(s => s.id === selectedSubject.id ? updated : s));
      } else {
        const newSubject = await subjectService.create(data);
        setSubjects(prev => [...prev, newSubject]);
      }
      setShowFormModal(false);
      setSelectedSubject(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save subject. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;

    setIsSubmitting(true);
    try {
      await subjectService.remove(selectedSubject.id);
      setSubjects(prev => prev.filter(s => s.id !== selectedSubject.id));
      setShowDeleteModal(false);
      setSelectedSubject(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subject. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Subject Setup</h1>
          <p className="text-gray-600 mt-1">Manage subject configurations</p>
        </div>
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Subject
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
                placeholder="Search by name, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredSubjects.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{subjects.length}</span> subjects
            </div>
          </div>
        </div>
      </div>

      <SubjectTable
        subjects={filteredSubjects}
        onEdit={handleEditSubject}
        onDelete={handleDeleteSubject}
      />

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSubject ? 'Edit Subject' : 'Add New Subject'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSubject ? 'Update the subject details' : 'Create a new subject record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedSubject(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-6">
              <SubjectForm
                subject={selectedSubject}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowFormModal(false);
                  setSelectedSubject(null);
                  setError(null);
                }}
                isSubmitting={isSubmitting}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delete Subject</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSubject(null);
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
                    Are you sure you want to delete <strong className="text-gray-900">{selectedSubject.name}</strong>?
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
                    setSelectedSubject(null);
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
                    'Delete Subject'
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
