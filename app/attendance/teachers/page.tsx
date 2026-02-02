'use client';
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { TeacherAttendance, AttendanceStatus, Teacher } from '../../../types';
import { ICONS } from '../../../constants';

interface AttendanceFormData {
  teacherId: string;
  status: AttendanceStatus;
  remarks: string;
}

export default function TeacherAttendancePage() {
  const [attendances, setAttendances] = useState<TeacherAttendance[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Modal states
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<TeacherAttendance | null>(null);

  // Attendance marking state
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [remarksData, setRemarksData] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<AttendanceFormData>({
    teacherId: '',
    status: AttendanceStatus.PRESENT,
    remarks: '',
  });

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

    const mockAttendances: TeacherAttendance[] = [
      {
        id: 'ta001',
        teacherId: 't001',
        teacher: mockTeachers[0],
        date: selectedDate,
        status: AttendanceStatus.PRESENT,
        markedById: 'u001',
        remarks: '',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ta002',
        teacherId: 't002',
        teacher: mockTeachers[1],
        date: selectedDate,
        status: AttendanceStatus.LATE,
        markedById: 'u001',
        remarks: 'Traffic delay',
        createdAt: new Date().toISOString(),
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setTeachers(mockTeachers);
      setAttendances(mockAttendances);
      setLoading(false);
    }, 200);
  }, [selectedDate]);

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

  const normalizeStatus = (value: string): AttendanceStatus => {
    const normalized = value.trim().toUpperCase();
    if (normalized.startsWith('P')) return AttendanceStatus.PRESENT;
    if (normalized.startsWith('A')) return AttendanceStatus.ABSENT;
    if (normalized.startsWith('L')) return AttendanceStatus.LATE;
    if (normalized.startsWith('PER')) return AttendanceStatus.PERMISSION;
    return AttendanceStatus.PRESENT;
  };

  const handleImportClick = () => {
    setImportError(null);
    importInputRef.current?.click();
  };

  const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet, { defval: '' });

        if (!rows.length) {
          setImportError('The import file is empty.');
          return;
        }

        const newAttendances: TeacherAttendance[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const staffNumber = String(row.staffNumber || row.StaffNumber || row.staff_no || row.StaffNo || '').trim();
          const teacherId = String(row.teacherId || row.TeacherId || row.teacherID || '').trim();
          const date = String(row.date || row.Date || row.attendanceDate || row.AttendanceDate || selectedDate).trim();
          const statusRaw = String(row.status || row.Status || row.attendance || row.Attendance || 'PRESENT').trim();
          const remarks = String(row.remarks || row.Remarks || row.note || row.Note || '').trim();

          const teacher =
            (teacherId && teachers.find(t => t.id === teacherId)) ||
            (staffNumber && teachers.find(t => t.staffNumber === staffNumber));

          if (!teacher) {
            errors.push(`Row ${index + 2}: teacher not found.`);
            return;
          }

          newAttendances.push({
            id: `import_${teacher.id}_${Date.now()}_${index}`,
            teacherId: teacher.id,
            teacher,
            date,
            status: normalizeStatus(statusRaw),
            remarks: remarks || undefined,
            markedById: 'hikvision-import',
            isApproved: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });

        if (errors.length) {
          setImportError(errors.slice(0, 3).join(' '));
          return;
        }

        setAttendances(prev => [...newAttendances, ...prev]);
      } catch (err) {
        setImportError('Failed to import file. Please verify the format.');
      } finally {
        if (importInputRef.current) importInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read the file.');
    };
    reader.readAsArrayBuffer(file);
  };

  // Modal handlers
  const handleMarkAttendance = () => {
    setAttendanceData({});
    setRemarksData({});
    setShowMarkAttendance(true);
  };

  const handleEditAttendance = (attendance: TeacherAttendance) => {
    setFormData({
      teacherId: attendance.teacherId,
      status: attendance.status,
      remarks: attendance.remarks || '',
    });
    setSelectedAttendance(attendance);
    setShowEditModal(true);
  };

  // Attendance marking handlers
  const handleAttendanceStatusChange = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [teacherId]: status }));
  };

  const handleRemarksChange = (teacherId: string, remarks: string) => {
    setRemarksData(prev => ({ ...prev, [teacherId]: remarks }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAttendance) {
      setFormData({
        teacherId: selectedAttendance.teacherId,
        status: selectedAttendance.status,
        remarks: selectedAttendance.remarks || '',
      });
    }
    setSelectedAttendance(null);
    setShowEditModal(true);
  };

  const handleBulkSaveAttendance = async () => {
    setIsSubmitting(true);
    try {
      const newAttendances: TeacherAttendance[] = teachers.map(teacher => {
        const status = attendanceData[teacher.id] || AttendanceStatus.PRESENT;
        const remarks = remarksData[teacher.id] || '';

        return {
          id: `teacher_attendance_${teacher.id}_${selectedDate}`,
          teacherId: teacher.id,
          teacher,
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
        const filtered = prev.filter(a => a.date !== selectedDate);
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
      const updatedAttendance: TeacherAttendance = {
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Attendance</h1>
          <p className="text-gray-600 mt-1">Manage teacher attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleImportChange}
          />
          <button
            onClick={handleImportClick}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {ICONS.Import}
            Import
          </button>
          <button
            onClick={handleMarkAttendance}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {ICONS.Add}
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Import columns: <span className="font-semibold">staffNumber</span> or <span className="font-semibold">teacherId</span>, <span className="font-semibold">date</span> (optional), <span className="font-semibold">status</span>, <span className="font-semibold">remarks</span>.
        </div>
        {importError && <div className="text-sm text-red-600">{importError}</div>}
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
                {attendances.filter(a => a.status === AttendanceStatus.PRESENT).length}
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
                {attendances.filter(a => a.status === AttendanceStatus.ABSENT).length}
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
                {attendances.filter(a => a.status === AttendanceStatus.LATE).length}
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
                {attendances.filter(a => a.status === AttendanceStatus.PERMISSION).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Teacher Attendance Records ({attendances.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
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
              {attendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={attendance.teacher?.profileImage || `https://picsum.photos/seed/${attendance.teacherId}/40/40`}
                          alt={`${attendance.teacher?.firstName} ${attendance.teacher?.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attendance.teacher?.firstName} {attendance.teacher?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attendance.teacher?.staffNumber}
                        </div>
                      </div>
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
                    Admin User
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditAttendance(attendance)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No attendance records found</p>
              <p className="text-sm mt-1">Try adjusting your date filter or mark attendance for today</p>
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      {showMarkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mark Teacher Attendance - {selectedDate}</h2>
              <button
                onClick={() => setShowMarkAttendance(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600">
                Mark attendance for all {teachers.length} teachers
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {teachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.profileImage || `https://picsum.photos/seed/${teacher.id}/40/40`}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                      <p className="text-sm text-gray-500">{teacher.staffNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Remarks (optional)"
                      value={remarksData[teacher.id] || ''}
                      onChange={(e) => handleRemarksChange(teacher.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded w-32"
                    />
                    <div className="flex gap-1">
                      {Object.values(AttendanceStatus).map(status => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceStatusChange(teacher.id, status)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            attendanceData[teacher.id] === status
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

            <div className="flex space-x-3 pt-4 border-t mt-4">
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
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditModal && selectedAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Teacher Attendance</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedAttendance.teacher?.firstName} {selectedAttendance.teacher?.lastName}</p>
              <p className="text-sm text-gray-600">{selectedAttendance.teacher?.staffNumber}</p>
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