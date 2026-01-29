'use client';
import React, { useState, useEffect } from 'react';
import { StudentAttendance, AttendanceStatus, Classroom, Student } from '../../../types';
import { ICONS } from '../../../constants';

interface AttendanceFormData {
  studentId: string;
  status: AttendanceStatus;
  remarks: string;
}

export default function StudentAttendancePage() {
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('ALL');

  // Modal states
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClassroomForAttendance, setSelectedClassroomForAttendance] = useState<string>('');
  const [selectedAttendance, setSelectedAttendance] = useState<StudentAttendance | null>(null);

  // Attendance marking state
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [remarksData, setRemarksData] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<AttendanceFormData>({
    studentId: '',
    status: AttendanceStatus.PRESENT,
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
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

    const mockStudents: Student[] = [
      {
        id: 's001',
        admissionNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.com',
        classroomId: 'c001',
        isActive: true,
        enrolledAt: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        gender: 'MALE',
        dateOfBirth: '2008-05-15',
        phoneNumber: '+1234567890',
        address: '123 Main St',
        emergencyContact: 'Parent Contact',
      },
      {
        id: 's002',
        admissionNumber: 'STU002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@school.com',
        classroomId: 'c001',
        isActive: true,
        enrolledAt: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        gender: 'FEMALE',
        dateOfBirth: '2008-08-20',
        phoneNumber: '+1234567891',
        address: '456 Oak St',
        emergencyContact: 'Parent Contact',
      },
    ];

    const mockAttendances: StudentAttendance[] = [
      {
        id: 'a001',
        studentId: 's001',
        student: mockStudents[0],
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        date: selectedDate,
        status: AttendanceStatus.PRESENT,
        markedById: 'u001',
        isApproved: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'a002',
        studentId: 's002',
        student: mockStudents[1],
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        date: selectedDate,
        status: AttendanceStatus.ABSENT,
        markedById: 'u001',
        remarks: 'Medical leave',
        isApproved: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setClassrooms(mockClassrooms);
      setStudents(mockStudents);
      setAttendances(mockAttendances);
      setLoading(false);
    }, 200);
  }, [selectedDate]);

  const filteredAttendances = attendances.filter(attendance => {
    const matchesClassroom = selectedClassroom === 'ALL' || attendance.classroomId === selectedClassroom;
    return matchesClassroom;
  });

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-800';
      case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-800';
      case AttendanceStatus.LATE: return 'bg-yellow-100 text-yellow-800';
      case AttendanceStatus.PERMISSION: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return ICONS.Check;
      case AttendanceStatus.ABSENT: return ICONS.Alert;
      case AttendanceStatus.LATE: return ICONS.Clock;
      case AttendanceStatus.PERMISSION: return ICONS.UserCheck;
      default: return null;
    }
  };

  // Modal handlers
  const handleMarkAttendance = () => {
    setAttendanceData({});
    setRemarksData({});
    setSelectedClassroomForAttendance('');
    setShowMarkAttendance(true);
  };

  const handleEditAttendance = (attendance: StudentAttendance) => {
    setFormData({
      studentId: attendance.studentId,
      status: attendance.status,
      remarks: attendance.remarks || '',
    });
    setSelectedAttendance(attendance);
    setShowEditModal(true);
  };

  // Attendance marking handlers
  const handleAttendanceStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRemarksData(prev => ({ ...prev, [studentId]: remarks }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAttendance) {
      setFormData({
        studentId: selectedAttendance.studentId,
        status: selectedAttendance.status,
        remarks: selectedAttendance.remarks || '',
      });
    }
    setSelectedAttendance(null);
    setShowEditModal(true);
  };

  const handleBulkSaveAttendance = async () => {
    if (!selectedClassroomForAttendance) return;

    setIsSubmitting(true);
    try {
      const classroomStudents = students.filter(s => s.classroomId === selectedClassroomForAttendance);
      const selectedClassroomObj = classrooms.find(c => c.id === selectedClassroomForAttendance);

      const newAttendances: StudentAttendance[] = classroomStudents.map(student => {
        const status = attendanceData[student.id] || AttendanceStatus.PRESENT;
        const remarks = remarksData[student.id] || '';

        return {
          id: `attendance_${student.id}_${selectedDate}`,
          studentId: student.id,
          student,
          classroomId: selectedClassroomForAttendance,
          classroom: selectedClassroomObj!,
          date: selectedDate,
          status,
          remarks: remarks || undefined,
          markedById: 'current-user', // Would be current user ID
          isApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      // Update existing attendances or add new ones
      setAttendances(prev => {
        const filtered = prev.filter(a => !(a.date === selectedDate && a.classroomId === selectedClassroomForAttendance));
        return [...filtered, ...newAttendances];
      });

      setShowMarkAttendance(false);
      setAttendanceData({});
      setRemarksData({});
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAttendance = async () => {
    if (!selectedAttendance) return;

    setIsSubmitting(true);
    try {
      const updatedAttendance: StudentAttendance = {
        ...selectedAttendance,
        status: formData.status,
        remarks: formData.remarks || undefined,
        updatedAt: new Date().toISOString(),
      };

      setAttendances(prev => prev.map(a => a.id === selectedAttendance.id ? updatedAttendance : a));
      setShowEditModal(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error('Error updating attendance:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
          <p className="text-gray-600 mt-1">Mark and manage daily student attendance</p>
        </div>
        <button
          onClick={handleMarkAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Mark Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
          <div className="flex items-end">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                Export Report
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                Bulk Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Check}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAttendances.filter(a => a.status === AttendanceStatus.PRESENT).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <div className="text-red-600">{ICONS.Alert}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAttendances.filter(a => a.status === AttendanceStatus.ABSENT).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <div className="text-yellow-600">{ICONS.Clock}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAttendances.filter(a => a.status === AttendanceStatus.LATE).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.UserCheck}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permission</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAttendances.filter(a => a.status === AttendanceStatus.PERMISSION).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Attendance Records ({filteredAttendances.length})
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
                  Classroom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marked By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={attendance.student?.profileImage || `https://picsum.photos/seed/${attendance.studentId}/40/40`}
                          alt={`${attendance.student?.firstName} ${attendance.student?.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attendance.student?.firstName} {attendance.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attendance.student?.admissionNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendance.classroom?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {attendance.classroom?.academicYear}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                      <span className="mr-1">{getStatusIcon(attendance.status)}</span>
                      {attendance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendance.remarks || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendance.markedBy?.firstName} {attendance.markedBy?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAttendance(attendance)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {!attendance.isApproved && (
                        <button className="text-green-600 hover:text-green-900">
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No attendance records found</p>
              <p className="text-sm mt-1">Try adjusting your filters or mark attendance for today</p>
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      {showMarkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mark Attendance - {selectedDate}</h2>
              <button
                onClick={() => setShowMarkAttendance(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Classroom</label>
              <select
                value={selectedClassroomForAttendance}
                onChange={(e) => setSelectedClassroomForAttendance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a classroom...</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} ({classroom.academicYear})
                  </option>
                ))}
              </select>
            </div>

            {selectedClassroomForAttendance && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Students in {classrooms.find(c => c.id === selectedClassroomForAttendance)?.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {students.filter(s => s.classroomId === selectedClassroomForAttendance).length} students
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {students
                    .filter(student => student.classroomId === selectedClassroomForAttendance)
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profileImage || `https://picsum.photos/seed/${student.id}/40/40`}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Remarks (optional)"
                            value={remarksData[student.id] || ''}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded w-32"
                          />
                          <div className="flex gap-1">
                            {Object.values(AttendanceStatus).map(status => (
                              <button
                                key={status}
                                onClick={() => handleAttendanceStatusChange(student.id, status)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                  attendanceData[student.id] === status
                                    ? (status === AttendanceStatus.PRESENT ? 'bg-green-500 text-white' :
                                       status === AttendanceStatus.ABSENT ? 'bg-red-500 text-white' :
                                       status === AttendanceStatus.LATE ? 'bg-yellow-500 text-white' :
                                       'bg-blue-500 text-white')
                                    : (status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                       status === AttendanceStatus.ABSENT ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                       status === AttendanceStatus.LATE ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                       'bg-blue-100 text-blue-800 hover:bg-blue-200')
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowMarkAttendance(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkSaveAttendance}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </div>
            )}

            {!selectedClassroomForAttendance && (
              <div className="text-center py-12">
                <p className="text-gray-500">Select a classroom to start marking attendance</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditModal && selectedAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Attendance</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedAttendance.student?.firstName} {selectedAttendance.student?.lastName}</p>
              <p className="text-sm text-gray-600">{selectedAttendance.student?.admissionNumber} • {selectedAttendance.classroom?.name}</p>
              <p className="text-sm text-gray-600">Date: {selectedDate}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={AttendanceStatus.PRESENT}>Present</option>
                  <option value={AttendanceStatus.ABSENT}>Absent</option>
                  <option value={AttendanceStatus.LATE}>Late</option>
                  <option value={AttendanceStatus.PERMISSION}>Permission</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Optional remarks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  onClick={handleUpdateAttendance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}