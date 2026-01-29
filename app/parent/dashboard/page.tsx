'use client';
import React, { useState, useEffect } from 'react';
import { Student, Parent, ExamResult, StudentAttendance } from '../../../types';
import { ICONS } from '../../../constants';

export default function ParentDashboardPage() {
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [selectedChild, setSelectedChild] = useState<Student | null>(null);
  const [childResults, setChildResults] = useState<ExamResult[]>([]);
  const [childAttendance, setChildAttendance] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for parent dashboard (simulating parent with one child)
    const mockParent: Parent = {
      id: 'parent001',
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '+233501234568',
      email: 'jane.doe@email.com',
      address: '123 Main St, Accra',
      relationship: 'Mother',
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
        parentId: 'parent001',
        classroomId: 'class001',
        classroom: {
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
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockResults: ExamResult[] = [
      {
        id: 'result001',
        examId: 'exam001',
        exam: {
          id: 'exam001',
          title: 'Mathematics Mid-Term',
          subjectId: 'subj001',
          subject: { name: 'Mathematics' },
          classroomId: 'class001',
          term: 'Mid-Term 1',
          date: '2024-01-20',
          totalScore: 100,
          isActive: true,
          status: 'GRADED',
        },
        studentId: 'student001',
        marksObtained: 85,
        grade: 'A-',
        percentage: 85,
        remarks: 'Good understanding of concepts',
        publishedBy: 'teacher001',
        publishedAt: '2024-01-25T00:00:00Z',
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
      },
      {
        id: 'result002',
        examId: 'exam002',
        exam: {
          id: 'exam002',
          title: 'English Mid-Term',
          subjectId: 'subj002',
          subject: { name: 'English' },
          classroomId: 'class001',
          term: 'Mid-Term 1',
          date: '2024-01-22',
          totalScore: 100,
          isActive: true,
          status: 'GRADED',
        },
        studentId: 'student001',
        marksObtained: 78,
        grade: 'B+',
        percentage: 78,
        remarks: 'Needs improvement in grammar',
        publishedBy: 'teacher002',
        publishedAt: '2024-01-27T00:00:00Z',
        createdAt: '2024-01-27T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z',
      },
    ];

    const mockAttendance: StudentAttendance[] = [
      { id: 'att001', studentId: 'student001', date: '2024-01-15', status: 'PRESENT', remarks: '' },
      { id: 'att002', studentId: 'student001', date: '2024-01-16', status: 'PRESENT', remarks: '' },
      { id: 'att003', studentId: 'student001', date: '2024-01-17', status: 'ABSENT', remarks: 'Medical leave' },
      { id: 'att004', studentId: 'student001', date: '2024-01-18', status: 'PRESENT', remarks: '' },
      { id: 'att005', studentId: 'student001', date: '2024-01-19', status: 'PRESENT', remarks: '' },
    ];

    setTimeout(() => {
      setParent(mockParent);
      setChildren(mockChildren);
      setSelectedChildId(mockChildren[0]?.id || '');
      setSelectedChild(mockChildren[0] || null);
      setChildResults(mockResults);
      setChildAttendance(mockAttendance);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      const child = children.find(c => c.id === selectedChildId);
      setSelectedChild(child || null);
      // In a real app, you would fetch data for the selected child here
    }
  }, [selectedChildId, children]);

  const calculateAttendanceRate = () => {
    if (childAttendance.length === 0) return 0;
    const presentCount = childAttendance.filter(att => att.status === 'PRESENT').length;
    return Math.round((presentCount / childAttendance.length) * 100);
  };

  const calculateAverageScore = () => {
    if (childResults.length === 0) return 0;
    const total = childResults.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / childResults.length);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your child's academic progress and school activities</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Teacher
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            View Report Card
          </button>
        </div>
      </div>

      {/* Child Selection (if multiple children) */}
      {children.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Child</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedChildId === child.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {child.firstName[0]}{child.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{child.firstName} {child.lastName}</p>
                    <p className="text-sm text-gray-600">{child.classroom?.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChild && (
        <>
          {/* Child Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-blue-600 font-bold">
                    {selectedChild.firstName[0]}{selectedChild.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedChild.admissionNumber} • {selectedChild.classroom?.name}</p>
                  <p className="text-sm text-gray-500">Class Master: {selectedChild.classroom?.classMasterName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Parent</div>
                <div className="font-medium">{parent?.firstName} {parent?.lastName}</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-600">{ICONS.Academics}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateAverageScore()}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <div className="text-green-600">{ICONS.CheckCircle}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateAttendanceRate()}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <div className="text-orange-600">{ICONS.Book}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published Results</p>
                  <p className="text-2xl font-bold text-gray-900">{childResults.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <div className="text-purple-600">{ICONS.CreditCard}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fee Status</p>
                  <p className="text-lg font-bold text-green-600">Paid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
              <p className="text-sm text-gray-600 mt-1">Latest exam results and grades</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {childResults.map((result) => (
                  <div key={result.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{result.exam?.title}</h4>
                      <p className="text-sm text-gray-600">{result.exam?.subject?.name} • {result.exam?.term}</p>
                      <p className="text-xs text-gray-500">
                        Exam Date: {new Date(result.exam?.date || '').toLocaleDateString()} •
                        Published: {new Date(result.publishedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mb-2 ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </div>
                      <p className="text-sm font-medium">{result.marksObtained}/{result.exam?.totalScore} ({result.percentage}%)</p>
                      {result.remarks && (
                        <p className="text-xs text-gray-600 mt-1">"{result.remarks}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Recent attendance record</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Attendance Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Days:</span>
                      <span className="font-medium">{childAttendance.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Present:</span>
                      <span className="font-medium text-green-600">
                        {childAttendance.filter(att => att.status === 'PRESENT').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Absent:</span>
                      <span className="font-medium text-red-600">
                        {childAttendance.filter(att => att.status === 'ABSENT').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Late:</span>
                      <span className="font-medium text-yellow-600">
                        {childAttendance.filter(att => att.status === 'LATE').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Recent Attendance</h4>
                  <div className="space-y-2">
                    {childAttendance.slice(-5).map((att) => (
                      <div key={att.id} className="flex justify-between text-sm">
                        <span>{new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className={`font-medium ${
                          att.status === 'PRESENT' ? 'text-green-600' :
                          att.status === 'ABSENT' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Parent Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-blue-600">{ICONS.MessageSquare}</div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Message Teacher</h4>
                <p className="text-sm text-gray-600">Send a message to class master</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-green-600">{ICONS.Download}</div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Download Report</h4>
                <p className="text-sm text-gray-600">Get academic report</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="text-purple-600">{ICONS.CreditCard}</div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Fee History</h4>
                <p className="text-sm text-gray-600">View payment records</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}