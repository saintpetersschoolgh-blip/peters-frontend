'use client';
import React, { useState, useEffect } from 'react';
import { Subject, Classroom, Teacher } from '../../types';
import { ICONS } from '../../constants';

interface SubjectFormData {
  name: string;
  code: string;
  description: string;
  classroomId: string;
  teacherIds: string[];
}

export default function SubjectsManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('ALL');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Form state
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    code: '',
    description: '',
    classroomId: '',
    teacherIds: [],
  });

  const [formErrors, setFormErrors] = useState<Partial<SubjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data
    const mockTeachers: Teacher[] = [
      {
        id: 't001',
        staffNumber: 'T001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@school.com',
        isActive: true,
        joinedAt: '2023-01-15',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
        subjects: [],
        classrooms: [],
        gender: 'FEMALE',
        phoneNumber: '+1234567890',
        address: '123 Main St',
        qualifications: ['B.Ed Mathematics'],
        dateOfBirth: '1985-05-15',
      },
      {
        id: 't002',
        staffNumber: 'T002',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@school.com',
        isActive: true,
        joinedAt: '2023-01-20',
        createdAt: '2023-01-20T00:00:00Z',
        updatedAt: '2023-01-20T00:00:00Z',
        subjects: [],
        classrooms: [],
        gender: 'MALE',
        phoneNumber: '+1234567891',
        address: '456 Oak St',
        qualifications: ['B.Sc Physics'],
        dateOfBirth: '1982-08-22',
      },
    ];

    const mockClassrooms: Classroom[] = [
      {
        id: 'c001',
        name: 'Grade 10A',
        academicYear: '2024-2025',
        capacity: 40,
        currentStudents: 35,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
    ];

    const mockSubjects: Subject[] = [
      {
        id: 's001',
        code: 'MATH101',
        name: 'Mathematics',
        description: 'Advanced Mathematics for Grade 10',
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        teachers: [mockTeachers[0]],
        totalTopics: 24,
        completedTopics: 12,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 's002',
        code: 'PHY101',
        name: 'Physics',
        description: 'Introduction to Physics',
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        teachers: [mockTeachers[1]],
        totalTopics: 20,
        completedTopics: 8,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setSubjects(mockSubjects);
      setClassrooms(mockClassrooms);
      setTeachers(mockTeachers);
      setLoading(false);
    }, 200);
  }, []);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassroom = selectedClassroom === 'ALL' || subject.classroomId === selectedClassroom;
    return matchesSearch && matchesClassroom;
  });

  // Form validation
  const validateForm = (data: SubjectFormData): Partial<SubjectFormData> => {
    const errors: Partial<SubjectFormData> = {};

    if (!data.name.trim()) errors.name = 'Subject name is required';
    if (!data.code.trim()) errors.code = 'Subject code is required';
    if (!data.classroomId) errors.classroomId = 'Classroom is required';
    if (data.teacherIds.length === 0) errors.teacherIds = 'At least one teacher is required';

    // Check for duplicate code
    const existingSubject = subjects.find(subject =>
      subject.code === data.code && subject.id !== selectedSubject?.id
    );
    if (existingSubject) errors.code = 'Subject code already exists';

    return errors;
  };

  // Modal handlers
  const handleAddSubject = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      classroomId: '',
      teacherIds: [],
    });
    setFormErrors({});
    setSelectedSubject(null);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      classroomId: subject.classroomId,
      teacherIds: subject.teachers?.map(t => t.id) || [],
    });
    setFormErrors({});
    setSelectedSubject(subject);
    setShowEditModal(true);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowDeleteModal(true);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedClassroomObj = classrooms.find(c => c.id === formData.classroomId);
      const selectedTeachers = teachers.filter(t => formData.teacherIds.includes(t.id));

      if (selectedSubject) {
        // Update existing subject
        const updatedSubject: Subject = {
          ...selectedSubject,
          name: formData.name,
          code: formData.code,
          description: formData.description,
          classroomId: formData.classroomId,
          classroom: selectedClassroomObj,
          teachers: selectedTeachers,
          updatedAt: new Date().toISOString(),
        };
        setSubjects(prev => prev.map(s => s.id === selectedSubject.id ? updatedSubject : s));
        setShowEditModal(false);
      } else {
        // Add new subject
        const newSubject: Subject = {
          id: String(subjects.length + 1),
          name: formData.name,
          code: formData.code,
          description: formData.description,
          classroomId: formData.classroomId,
          classroom: selectedClassroomObj,
          teachers: selectedTeachers,
          totalTopics: 0,
          completedTopics: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSubjects(prev => [...prev, newSubject]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving subject:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;

    setIsSubmitting(true);
    try {
      setSubjects(prev => prev.filter(s => s.id !== selectedSubject.id));
      setShowDeleteModal(false);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (subject: Subject, newStatus: boolean) => {
    try {
      const updatedSubject: Subject = {
        ...subject,
        isActive: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setSubjects(prev => prev.map(s => s.id === subject.id ? updatedSubject : s));
    } catch (error) {
      console.error('Error updating subject status:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-600 mt-1">Manage subjects, teachers, and syllabus tracking</p>
        </div>
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Subject
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classroom</label>
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Classrooms</option>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name} ({classroom.academicYear})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{subject.name}</h3>
                <p className="text-sm text-gray-600">{subject.code}</p>
                {subject.description && (
                  <p className="text-xs text-gray-400 mt-1">{subject.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {subject.teachers.map((teacher) => (
                    <span
                      key={teacher.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {teacher.firstName} {teacher.lastName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${subject.totalTopics > 0 ? (subject.completedTopics / subject.totalTopics) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {subject.completedTopics}/{subject.totalTopics}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  subject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subject.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusChange(subject, !subject.isActive)}
                    className={subject.isActive
                      ? "text-red-600 hover:text-red-900 text-sm"
                      : "text-green-600 hover:text-green-900 text-sm"
                    }
                  >
                    {subject.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredSubjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No subjects found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Subject</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="MATH101"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mathematics"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Advanced Mathematics for Grade 10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom *
                </label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.classroomId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a classroom...</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} ({classroom.academicYear})
                    </option>
                  ))}
                </select>
                {formErrors.classroomId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.classroomId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teachers *
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 p-3 rounded-md">
                  {teachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.teacherIds.includes(teacher.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              teacherIds: [...prev.teacherIds, teacher.id],
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              teacherIds: prev.teacherIds.filter(id => id !== teacher.id),
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        {teacher.firstName} {teacher.lastName} ({teacher.staffNumber})
                      </span>
                    </label>
                  ))}
                </div>
                {formErrors.teacherIds && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.teacherIds}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  {isSubmitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Subject</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="MATH101"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mathematics"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Advanced Mathematics for Grade 10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom *
                </label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.classroomId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a classroom...</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} ({classroom.academicYear})
                    </option>
                  ))}
                </select>
                {formErrors.classroomId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.classroomId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teachers *
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 p-3 rounded-md">
                  {teachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.teacherIds.includes(teacher.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              teacherIds: [...prev.teacherIds, teacher.id],
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              teacherIds: prev.teacherIds.filter(id => id !== teacher.id),
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        {teacher.firstName} {teacher.lastName} ({teacher.staffNumber})
                      </span>
                    </label>
                  ))}
                </div>
                {formErrors.teacherIds && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.teacherIds}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                  {isSubmitting ? 'Updating...' : 'Update Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Subject</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this subject?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedSubject.name} ({selectedSubject.code})
                </p>
                <p className="text-sm text-gray-600">
                  {selectedSubject.classroom?.name} • {selectedSubject.teachers?.length || 0} teachers assigned
                </p>
                {selectedSubject.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedSubject.description}</p>
                )}
              </div>
              <p className="text-red-600 text-sm mt-3">
                This action cannot be undone and will affect all enrolled students.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}