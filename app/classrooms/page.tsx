'use client';
import React, { useState, useEffect } from 'react';
import { Classroom, Subject, Teacher } from '../../types';
import { ICONS } from '../../constants';

interface ClassroomFormData {
  name: string;
  academicYear: string;
  classMasterId: string;
  capacity: number;
}

export default function ClassroomsManagementPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  // Form state
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: '',
    academicYear: '2024-2025',
    classMasterId: '',
    capacity: 40,
  });

  const [formErrors, setFormErrors] = useState<Partial<ClassroomFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
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
        qualifications: ['B.Ed', 'M.Ed'],
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
        qualifications: ['B.Sc', 'M.Sc'],
        dateOfBirth: '1982-08-22',
      },
    ];

    const mockClassrooms: Classroom[] = [
      {
        id: 'c001',
        name: 'Grade 10A',
        academicYear: '2024-2025',
        classMasterId: 't001',
        classMaster: mockTeachers[0],
        capacity: 40,
        currentStudents: 35,
        subjects: [],
        teachers: [mockTeachers[0], mockTeachers[1]],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'c002',
        name: 'Grade 11B',
        academicYear: '2024-2025',
        classMasterId: 't002',
        classMaster: mockTeachers[1],
        capacity: 35,
        currentStudents: 32,
        subjects: [],
        teachers: [mockTeachers[1]],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setTeachers(mockTeachers);
      setClassrooms(mockClassrooms);
      setLoading(false);
    }, 200);
  }, []);

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.classMaster?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.classMaster?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedAcademicYear === 'ALL' || classroom.academicYear === selectedAcademicYear;
    return matchesSearch && matchesYear;
  });

  const getUniqueAcademicYears = () => {
    const years = [...new Set(classrooms.map(c => c.academicYear))];
    return years.sort().reverse();
  };

  // Form validation
  const validateForm = (data: ClassroomFormData): Partial<ClassroomFormData> => {
    const errors: Partial<ClassroomFormData> = {};

    if (!data.name.trim()) errors.name = 'Classroom name is required';
    if (!data.academicYear) errors.academicYear = 'Academic year is required';
    if (!data.classMasterId) errors.classMasterId = 'Class master is required';
    if (data.capacity <= 0) errors.capacity = 'Capacity must be greater than 0';

    return errors;
  };

  // Modal handlers
  const handleAddClassroom = () => {
    setFormData({
      name: '',
      academicYear: '2024-2025',
      classMasterId: '',
      capacity: 40,
    });
    setFormErrors({});
    setSelectedClassroom(null);
    setShowCreateModal(true);
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setFormData({
      name: classroom.name,
      academicYear: classroom.academicYear,
      classMasterId: classroom.classMasterId || '',
      capacity: classroom.capacity,
    });
    setFormErrors({});
    setSelectedClassroom(classroom);
    setShowEditModal(true);
  };

  const handleDeleteClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
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
      if (selectedClassroom) {
        // Update existing classroom
        const selectedTeacher = teachers.find(t => t.id === formData.classMasterId);
        const updatedClassroom: Classroom = {
          ...selectedClassroom,
          name: formData.name,
          academicYear: formData.academicYear,
          classMasterId: formData.classMasterId,
          classMaster: selectedTeacher,
          capacity: formData.capacity,
          updatedAt: new Date().toISOString(),
        };
        setClassrooms(prev => prev.map(c => c.id === selectedClassroom.id ? updatedClassroom : c));
        setShowEditModal(false);
      } else {
        // Add new classroom
        const selectedTeacher = teachers.find(t => t.id === formData.classMasterId);
        const newClassroom: Classroom = {
          id: String(classrooms.length + 1),
          name: formData.name,
          academicYear: formData.academicYear,
          classMasterId: formData.classMasterId,
          classMaster: selectedTeacher,
          capacity: formData.capacity,
          currentStudents: 0,
          subjects: [],
          teachers: selectedTeacher ? [selectedTeacher] : [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setClassrooms(prev => [...prev, newClassroom]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error saving classroom:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClassroom) return;

    setIsSubmitting(true);
    try {
      setClassrooms(prev => prev.filter(c => c.id !== selectedClassroom.id));
      setShowDeleteModal(false);
      setSelectedClassroom(null);
    } catch (error) {
      console.error('Error deleting classroom:', error);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
          <p className="text-gray-600 mt-1">Manage classrooms, subjects, and class masters</p>
        </div>
        <button
          onClick={handleAddClassroom}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Classroom
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by classroom name or class master..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Years</option>
              {getUniqueAcademicYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassrooms.map((classroom) => (
          <div key={classroom.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">{classroom.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{classroom.academicYear}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                  classroom.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {classroom.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">{ICONS.User}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Class Master</p>
                    <p className="text-sm text-gray-600 truncate">
                      {classroom.classMaster?.firstName} {classroom.classMaster?.lastName || 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">{ICONS.Students}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Students</p>
                    <p className="text-sm text-gray-600">
                      {classroom.currentStudents}/{classroom.capacity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">{ICONS.BookOpen}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Subjects</p>
                    <p className="text-sm text-gray-600">{classroom.subjects.length} subjects</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600">{ICONS.Teachers}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Teachers</p>
                    <p className="text-sm text-gray-600">{classroom.teachers.length} assigned</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => handleEditClassroom(classroom)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClassroom(classroom)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg">No classrooms found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria or create a new classroom</p>
          </div>
        </div>
      )}

      {/* Add Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Classroom</h2>
                <p className="text-sm text-gray-600 mt-1">Create a new classroom configuration</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classroom Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="e.g., Grade 10A"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
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
                    value={formData.academicYear}
                    onChange={(e) => {
                      setFormData({ ...formData, academicYear: e.target.value });
                      if (formErrors.academicYear) setFormErrors({ ...formErrors, academicYear: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.academicYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                  {formErrors.academicYear && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.academicYear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Master <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classMasterId}
                    onChange={(e) => {
                      setFormData({ ...formData, classMasterId: e.target.value });
                      if (formErrors.classMasterId) setFormErrors({ ...formErrors, classMasterId: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.classMasterId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} ({teacher.staffNumber})
                      </option>
                    ))}
                  </select>
                  {formErrors.classMasterId && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.classMasterId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => {
                      setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 });
                      if (formErrors.capacity) setFormErrors({ ...formErrors, capacity: undefined });
                    }}
                    placeholder="40"
                    min="1"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.capacity && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    {ICONS.Add}
                    Add Classroom
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Classroom Modal */}
      {showEditModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Classroom</h2>
                <p className="text-sm text-gray-600 mt-1">Update classroom information</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classroom Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="e.g., Grade 10A"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
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
                    value={formData.academicYear}
                    onChange={(e) => {
                      setFormData({ ...formData, academicYear: e.target.value });
                      if (formErrors.academicYear) setFormErrors({ ...formErrors, academicYear: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.academicYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                  {formErrors.academicYear && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.academicYear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Master <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classMasterId}
                    onChange={(e) => {
                      setFormData({ ...formData, classMasterId: e.target.value });
                      if (formErrors.classMasterId) setFormErrors({ ...formErrors, classMasterId: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.classMasterId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} ({teacher.staffNumber})
                      </option>
                    ))}
                  </select>
                  {formErrors.classMasterId && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.classMasterId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => {
                      setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 });
                      if (formErrors.capacity) setFormErrors({ ...formErrors, capacity: undefined });
                    }}
                    placeholder="40"
                    min="1"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.capacity && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Classroom'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-red-600">Delete Classroom</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this classroom? This action cannot be undone and will affect all enrolled students.
              </p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">
                  {selectedClassroom.name}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{selectedClassroom.academicYear} • {selectedClassroom.currentStudents} students</p>
                  <p>Class Master: {selectedClassroom.classMaster?.firstName} {selectedClassroom.classMaster?.lastName || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Classroom'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}