'use client';
import React, { useState, useEffect } from 'react';
import { Student, Classroom, StudentFormData, Parent } from '../../types';
import { ICONS } from '../../constants';

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data
    const mockClassrooms: Classroom[] = [
      {
        id: 'class001',
        name: 'Grade 10A',
        academicYear: '2024-2025',
        capacity: 40,
        currentStudents: 38,
        classMasterId: 'teacher001',
        classMasterName: 'Sarah Johnson',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
      {
        id: 'class002',
        name: 'Grade 10B',
        academicYear: '2024-2025',
        capacity: 40,
        currentStudents: 35,
        classMasterId: 'teacher002',
        classMasterName: 'Michael Brown',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
    ];

    const mockParents: Parent[] = [
      {
        id: 'parent001',
        firstName: 'Robert',
        lastName: 'Doe',
        email: 'robert.doe@example.com',
        phoneNumber: '+233507654321',
        address: '123 Main St, Accra',
        relationship: 'FATHER',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        students: [],
      },
      {
        id: 'parent002',
        firstName: 'Mary',
        lastName: 'Smith',
        email: 'mary.smith@example.com',
        phoneNumber: '+233507654322',
        address: '456 Oak St, Accra',
        relationship: 'MOTHER',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        students: [],
      },
    ];

    const mockStudents: Student[] = [
      {
        id: 'student001',
        admissionNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2008-05-15',
        gender: 'MALE',
        address: '123 Main St, Accra',
        phoneNumber: '+233501234567',
        emergencyContact: '+233507654321',
        parentId: 'parent001',
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'student002',
        admissionNumber: 'STU002',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2008-03-22',
        gender: 'FEMALE',
        address: '456 Oak St, Accra',
        phoneNumber: '+233501234568',
        emergencyContact: '+233507654322',
        parentId: 'parent002',
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setClassrooms(mockClassrooms);
      setParents(mockParents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassroom = selectedClassroom === 'ALL' || student.classroomId === selectedClassroom;
    return matchesSearch && matchesClassroom;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student records, profiles, and academic information</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add} Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or admission number..."
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
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classroom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.admissionNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.classroom?.name}</div>
                    <div className="text-sm text-gray-500">{student.classroom?.academicYear}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View Profile</button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <span
                          onClick={() => {
                            setStudents(prev =>
                              prev.map(s =>
                                s.id === student.id
                                  ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() }
                                  : s
                              )
                            );
                          }}
                        >
                          {student.isActive ? 'Deactivate' : 'Activate'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showCreateModal && (
        <AddStudentModal
          classrooms={classrooms}
          parents={parents}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (formData) => {
            setIsSubmitting(true);
            try {
              // Generate a new student ID and admission number
              const newId = `student${String(students.length + 1).padStart(3, '0')}`;
              const newAdmissionNumber = `STU${String(students.length + 1).padStart(3, '0')}`;
              
              // Find selected classroom
              const selectedClassroom = classrooms.find(c => c.id === formData.classroomId);
              
              const newStudent: Student = {
                id: newId,
                admissionNumber: formData.admissionNumber || newAdmissionNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                emergencyContact: formData.emergencyContact,
                email: formData.email,
                parentId: formData.parentId,
                classroomId: formData.classroomId,
                classroom: selectedClassroom,
                isActive: true,
                enrolledAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 500));
              
              setStudents([...students, newStudent]);
              setShowCreateModal(false);
            } catch (error) {
              console.error('Error adding student:', error);
              alert('Failed to add student. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {showEditModal && selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          classrooms={classrooms}
          parents={parents}
          isSubmitting={isSubmitting}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          onSubmit={async (data) => {
            setIsSubmitting(true);
            try {
              const selectedClassroom = classrooms.find(c => c.id === data.classroomId);
              await new Promise(resolve => setTimeout(resolve, 400));
              setStudents(prev =>
                prev.map(s =>
                  s.id === selectedStudent.id
                    ? {
                        ...s,
                        ...data,
                        classroom: selectedClassroom,
                        updatedAt: new Date().toISOString(),
                      }
                    : s
                )
              );
              setShowEditModal(false);
              setSelectedStudent(null);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}
    </div>
  );
}

interface EditStudentModalProps {
  student: Student;
  classrooms: Classroom[];
  parents: Parent[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
}

function EditStudentModal({ student, classrooms, parents, isSubmitting, onClose, onSubmit }: EditStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    admissionNumber: student.admissionNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    address: student.address,
    phoneNumber: student.phoneNumber,
    emergencyContact: student.emergencyContact,
    email: student.email,
    parentId: student.parentId,
    classroomId: student.classroomId,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof StudentFormData, string>> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.emergencyContact.trim()) errors.emergencyContact = 'Emergency contact is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.parentId) errors.parentId = 'Please select a parent/guardian';
    if (!formData.classroomId) errors.classroomId = 'Please select a classroom';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof StudentFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) setFormErrors({ ...formErrors, [field]: undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Student</h2>
            <p className="text-sm text-gray-600 mt-1">
              {student.firstName} {student.lastName} • {student.admissionNumber}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isSubmitting}>
            {ICONS.Close}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.firstName && <p className="text-red-600 text-xs mt-1">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.lastName && <p className="text-red-600 text-xs mt-1">{formErrors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{formErrors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.address && <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.phoneNumber && <p className="text-red-600 text-xs mt-1">{formErrors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.emergencyContact ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.emergencyContact && <p className="text-red-600 text-xs mt-1">{formErrors.emergencyContact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classroom <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => handleChange('classroomId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.classroomId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Classroom...</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.academicYear})
                    </option>
                  ))}
                </select>
                {formErrors.classroomId && <p className="text-red-600 text-xs mt-1">{formErrors.classroomId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => handleChange('parentId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.parentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select Parent/Guardian...</option>
                  {parents.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.relationship})
                    </option>
                  ))}
                </select>
                {formErrors.parentId && <p className="text-red-600 text-xs mt-1">{formErrors.parentId}</p>}
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Student Modal Component
interface AddStudentModalProps {
  classrooms: Classroom[];
  parents: Parent[];
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  isSubmitting: boolean;
}

function AddStudentModal({ classrooms, parents, onClose, onSubmit, isSubmitting }: AddStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    phoneNumber: '',
    emergencyContact: '',
    email: '',
    parentId: '',
    classroomId: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 3 || age > 25) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.emergencyContact.trim()) {
      errors.emergencyContact = 'Emergency contact is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.emergencyContact.replace(/\s/g, ''))) {
      errors.emergencyContact = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.parentId) {
      errors.parentId = 'Please select a parent/guardian';
    }

    if (!formData.classroomId) {
      errors.classroomId = 'Please select a classroom';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof StudentFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the student information below</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            {ICONS.Close}
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Number
                  </label>
                  <input
                    type="text"
                    value={formData.admissionNumber}
                    onChange={(e) => handleChange('admissionNumber', e.target.value.toUpperCase())}
                    placeholder="Auto-generated if left empty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="student@example.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.address && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="+233501234567"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="+233507654321"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.emergencyContact ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.emergencyContact && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.emergencyContact}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classroom <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classroomId}
                    onChange={(e) => handleChange('classroomId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.classroomId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select Classroom...</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name} ({classroom.academicYear})
                      </option>
                    ))}
                  </select>
                  {formErrors.classroomId && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.classroomId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => handleChange('parentId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.parentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select Parent/Guardian...</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.firstName} {parent.lastName} ({parent.relationship}) - {parent.phoneNumber}
                      </option>
                    ))}
                  </select>
                  {formErrors.parentId && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      {ICONS.Alert}
                      {formErrors.parentId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Adding Student...
              </>
            ) : (
              <>
                {ICONS.Add}
                Add Student
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}