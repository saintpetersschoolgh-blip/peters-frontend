'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { Student, Parent, UserRole } from '../types';
import { ICONS } from '../constants';

export default function StudentProfile() {
  const { user } = useAuth();
  const isParent = user?.role === UserRole.PARENT;
  const [student, setStudent] = useState<Student | null>(null);
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockParent: Parent = {
      id: 'parent001',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phoneNumber: '+233501234568',
      address: '123 Main St, Accra',
      relationship: 'MOTHER',
      students: [],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const mockChildren: Student[] = [
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
        email: 'john.doe@school.com',
        parentId: 'parent001',
        classroomId: 'class001',
        classroom: {
          id: 'class001',
          name: 'Grade 10A',
          academicYear: '2024-2025',
          classMasterId: 'teacher001',
          capacity: 40,
          currentStudents: 38,
          subjects: [],
          teachers: [],
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        isActive: true,
        enrolledAt: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      if (isParent) {
        setParent(mockParent);
        setChildren(mockChildren);
        setSelectedChildId(mockChildren[0]?.id || '');
        setStudent(mockChildren[0] || null);
      } else {
        // For student view
        setStudent({
          id: 'student001',
          admissionNumber: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2008-05-15',
          gender: 'MALE',
          address: '123 Main St, Accra',
          phoneNumber: '+233501234567',
          emergencyContact: '+233507654321',
          email: 'john.doe@school.com',
          parentId: 'parent001',
          classroomId: 'class001',
          classroom: {
            id: 'class001',
            name: 'Grade 10A',
            academicYear: '2024-2025',
            classMasterId: 'teacher001',
            capacity: 40,
            currentStudents: 38,
            subjects: [],
            teachers: [],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          isActive: true,
          enrolledAt: '2024-01-01',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        });
      }
      setLoading(false);
    }, 500);
  }, [isParent]);

  useEffect(() => {
    if (isParent && selectedChildId) {
      const child = children.find(c => c.id === selectedChildId);
      setStudent(child || null);
    }
  }, [selectedChildId, children, isParent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No student profile found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isParent ? 'Child Profile' : 'My Profile'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isParent ? 'View your child\'s profile information' : 'View and manage your profile'}
          </p>
        </div>
      </div>

      {/* Child Selection for Parents */}
      {isParent && children.length > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName} - {child.admissionNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl text-blue-600 font-bold">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-blue-100">{student.admissionNumber}</p>
              <p className="text-blue-100">{student.classroom?.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium">{student.gender}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{student.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">{student.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium text-right max-w-xs">{student.address}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Admission Number</span>
                  <span className="font-medium">{student.admissionNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Class</span>
                  <span className="font-medium">{student.classroom?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Academic Year</span>
                  <span className="font-medium">{student.classroom?.academicYear || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Enrollment Date</span>
                  <span className="font-medium">{new Date(student.enrolledAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${student.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isParent && parent && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{parent.firstName} {parent.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Relationship</span>
                  <span className="font-medium">{parent.relationship}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{parent.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">{parent.phoneNumber}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
