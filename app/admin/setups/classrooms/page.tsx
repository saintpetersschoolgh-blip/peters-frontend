'use client';
import React, { useState, useEffect } from 'react';
import { ClassRoom, ClassRoomFormData } from './types';
import { classroomService } from './services/classroomService';
import ClassRoomTable from './components/ClassRoomTable';
import ClassRoomForm from './components/ClassRoomForm';
import { ICONS } from '../../../../constants';

export default function ClassRoomsPage() {
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<ClassRoom | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classroomService.getAll();
      setClassrooms(data);
    } catch (err) {
      setError('Failed to load classrooms. Please try again.');
      console.error('Error loading classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClassroom = () => {
    setSelectedClassroom(null);
    setError(null);
    setShowFormModal(true);
  };

  const handleEditClassroom = (classroom: ClassRoom) => {
    setSelectedClassroom(classroom);
    setError(null);
    setShowFormModal(true);
  };

  const handleDeleteClassroom = (classroom: ClassRoom) => {
    setSelectedClassroom(classroom);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (data: ClassRoomFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedClassroom) {
        const updated = await classroomService.update(selectedClassroom.id, data);
        setClassrooms(prev => prev.map(c => c.id === selectedClassroom.id ? updated : c));
      } else {
        const newClassroom = await classroomService.create(data);
        setClassrooms(prev => [...prev, newClassroom]);
      }
      setShowFormModal(false);
      setSelectedClassroom(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save classroom. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClassroom) return;

    setIsSubmitting(true);
    try {
      await classroomService.remove(selectedClassroom.id);
      setClassrooms(prev => prev.filter(c => c.id !== selectedClassroom.id));
      setShowDeleteModal(false);
      setSelectedClassroom(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete classroom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClassrooms = classrooms.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.gradeLevel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.academicYear?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">ClassRoom Setup</h1>
          <p className="text-sm text-slate-600 mt-1">Manage classroom configurations and settings</p>
        </div>
        <button
          onClick={handleAddClassroom}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="text-white">{ICONS.Add}</span>
          Add ClassRoom
        </button>
      </div>

      {error && !showFormModal && (
        <div className="card p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800 text-sm">
            <span className="text-red-600">{ICONS.Alert}</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="label">Search</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <span className="text-slate-400">{ICONS.Search}</span>
              </span>
              <input
                type="text"
                placeholder="Search by name, code, grade level, or academic year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium text-slate-900">{filteredClassrooms.length}</span> of{' '}
            <span className="font-medium text-slate-900">{classrooms.length}</span> classrooms
          </div>
        </div>
      </div>

      <ClassRoomTable
        classrooms={filteredClassrooms}
        onEdit={handleEditClassroom}
        onDelete={handleDeleteClassroom}
      />

      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-start bg-white">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedClassroom ? 'Edit ClassRoom' : 'Add New ClassRoom'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedClassroom ? 'Update the classroom details' : 'Create a new classroom record'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedClassroom(null);
                  setError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting}
                aria-label="Close modal"
              >
                <span className="text-slate-400">{ICONS.Close}</span>
              </button>
            </div>

            <div className="px-6 py-6 overflow-y-auto flex-1">
              <ClassRoomForm
                classroom={selectedClassroom}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowFormModal(false);
                  setSelectedClassroom(null);
                  setError(null);
                }}
                isSubmitting={isSubmitting}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedClassroom && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="card w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Delete ClassRoom</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedClassroom(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <span className="text-red-600">{ICONS.AlertTriangle}</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium mb-1">
                    Are you sure you want to delete <strong>{selectedClassroom.name}</strong>?
                  </p>
                  <p className="text-sm text-slate-600">
                    This action cannot be undone. All associated data may be affected.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
                  <span className="text-red-600">{ICONS.Alert}</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedClassroom(null);
                    setError(null);
                  }}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete ClassRoom'
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
