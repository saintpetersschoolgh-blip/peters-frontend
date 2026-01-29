'use client';
import React, { useState, useEffect } from 'react';
import { Student, ExamResult, StudentAttendance, Classroom } from '../../../types';
import { ICONS } from '../../../constants';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [recentResults, setRecentResults] = useState<ExamResult[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for student dashboard (simulating John Doe - Student)
    const mockStudent: Student = {
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
    };

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

    const mockUpcomingExams = [
      {
        id: 'exam003',
        title: 'Science Mid-Term',
        subject: 'Science',
        date: '2024-02-10',
        time: '10:00 AM',
        venue: 'Lab 1',
      },
    ];

    const mockHomework = [
      {
        id: 'hw001',
        subject: 'Mathematics',
        title: 'Quadratic Equations',
        dueDate: '2024-01-30',
        status: 'PENDING',
        description: 'Complete exercises 5.1 - 5.5',
      },
      {
        id: 'hw002',
        subject: 'English',
        title: 'Essay Writing',
        dueDate: '2024-01-28',
        status: 'COMPLETED',
        description: 'Write a 500-word essay on climate change',
      },
    ];

    setTimeout(() => {
      setStudent(mockStudent);
      setRecentResults(mockResults);
      setAttendance(mockAttendance);
      setUpcomingExams(mockUpcomingExams);
      setHomework(mockHomework);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateAttendanceRate = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(att => att.status === 'PRESENT').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const calculateAverageScore = () => {
    if (recentResults.length === 0) return 0;
    const total = recentResults.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / recentResults.length);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-600 bg-green-100';
      case 'ABSENT': return 'text-red-600 bg-red-100';
      case 'LATE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
        <p className="text-gray-500">Unable to load student data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {student.firstName}! Here's your academic overview.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Report Card
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Download Results
          </button>
        </div>
      </div>

      {/* Quick Stats */}
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
              <p className="text-sm font-medium text-gray-600">Completed Exams</p>
              <p className="text-2xl font-bold text-gray-900">{recentResults.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <div className="text-purple-600">{ICONS.ClipboardList}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Homework</p>
              <p className="text-2xl font-bold text-gray-900">
                {homework.filter(hw => hw.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Exam Results</h3>
          <p className="text-sm text-gray-600 mt-1">Your latest assessment scores</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentResults.map((result) => (
              <div key={result.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">{result.exam?.title}</h4>
                  <p className="text-sm text-gray-600">{result.exam?.subject?.name}</p>
                  <p className="text-xs text-gray-500">Published: {new Date(result.publishedAt || '').toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                    {result.grade} ({result.marksObtained}/{result.exam?.totalScore})
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{result.remarks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Attendance & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            <p className="text-sm text-gray-600 mt-1">Your attendance record for the past week</p>
          </div>
          <div className="divide-y divide-gray-200">
            {attendance.slice(-7).map((att) => (
              <div key={att.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{new Date(att.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}</p>
                  {att.remarks && <p className="text-sm text-gray-600">{att.remarks}</p>}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(att.status)}`}>
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams & Homework */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4">
                  <h4 className="font-medium text-gray-900">{exam.title}</h4>
                  <p className="text-sm text-gray-600">{exam.subject}</p>
                  <p className="text-sm text-gray-500">{exam.date} at {exam.time} • {exam.venue}</p>
                </div>
              ))}
              {upcomingExams.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No upcoming exams</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Homework */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pending Homework</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {homework.filter(hw => hw.status === 'PENDING').map((hw) => (
                <div key={hw.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{hw.title}</h4>
                      <p className="text-sm text-gray-600">{hw.subject}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Due Soon
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{hw.description}</p>
                </div>
              ))}
              {homework.filter(hw => hw.status === 'PENDING').length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>All homework completed!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-blue-600 font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-gray-600">{student.admissionNumber} • {student.classroom?.name}</p>
            <p className="text-sm text-gray-500">{student.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}