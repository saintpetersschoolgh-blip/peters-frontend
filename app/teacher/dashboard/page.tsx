'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Classroom, Subject, Student, Exam, LessonNote } from '../../../types';
import { ICONS } from '../../../constants';
import { useAuth } from '../../../lib/auth-context';
import { Link } from '../../../lib/navigation';

interface TeacherStats {
  totalClasses: number;
  totalSubjects: number;
  totalStudents: number;
  pendingLessons: number;
  upcomingExams: number;
  atRiskStudents: number;
  syllabusProgress: number;
}

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [assignedClassrooms, setAssignedClassrooms] = useState<Classroom[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<Subject[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [pendingLessons, setPendingLessons] = useState<LessonNote[]>([]);
  const [studentRisks, setStudentRisks] = useState<Student[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalClasses: 0,
    totalSubjects: 0,
    totalStudents: 0,
    pendingLessons: 0,
    upcomingExams: 0,
    atRiskStudents: 0,
    syllabusProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for teacher dashboard
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
        name: 'Grade 9B',
        academicYear: '2024-2025',
        capacity: 35,
        currentStudents: 33,
        classMasterId: 'teacher002',
        classMasterName: 'Michael Brown',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
    ];

    const mockSubjects: Subject[] = [
      {
        id: 'subj001',
        code: 'MATH101',
        name: 'Mathematics',
        description: 'Advanced Mathematics for Grade 10',
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        teachers: [],
        totalTopics: 24,
        completedTopics: 12,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'subj002',
        code: 'PHY101',
        name: 'Physics',
        description: 'Introduction to Physics',
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        teachers: [],
        totalTopics: 20,
        completedTopics: 8,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockExams: Exam[] = [
      {
        id: 'exam001',
        title: 'Mathematics Mid-Term',
        subjectId: 'subj001',
        subject: mockSubjects[0],
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        term: 'Mid-Term 1',
        date: '2024-02-15',
        startTime: '09:00',
        duration: 120,
        totalScore: 100,
        venue: 'Hall A',
        instructions: 'Bring calculator and ruler',
        isActive: true,
        status: 'UPCOMING',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 'exam002',
        title: 'Physics Quiz',
        subjectId: 'subj002',
        subject: mockSubjects[1],
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        term: 'Term 1',
        date: '2024-02-20',
        startTime: '10:00',
        duration: 60,
        totalScore: 50,
        venue: 'Classroom',
        instructions: 'No calculator allowed',
        isActive: true,
        status: 'UPCOMING',
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z',
      },
    ];

    const mockPendingLessons: LessonNote[] = [
      {
        id: 'lesson001',
        timetableId: 'tt001',
        timetable: {
          id: 'tt001',
          subjectId: 'subj001',
          subject: mockSubjects[0],
          classroomId: 'class001',
          classroom: mockClassrooms[0],
          teacherId: 'teacher001',
          teacher: { firstName: 'Sarah', lastName: 'Johnson' },
          dayOfWeek: 1,
          startTime: '08:00',
          endTime: '09:00',
          isActive: true,
        },
        topicsCovered: 'Quadratic Equations',
        objectives: 'Solve quadratic equations using various methods',
        materials: 'Whiteboard, projector, worksheets',
        activities: 'Group problem solving, individual practice',
        assessment: 'Exit ticket quiz',
        homework: 'Complete worksheet 5.1',
        isApproved: false,
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];

    const mockStudentRisks: Student[] = [
      {
        id: 'student001',
        admissionNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2008-05-15',
        gender: 'MALE',
        address: '123 Main St',
        phoneNumber: '+1234567890',
        emergencyContact: '+1234567891',
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
        firstName: 'Alice',
        lastName: 'Smith',
        dateOfBirth: '2008-07-20',
        gender: 'FEMALE',
        address: '456 Oak Ave',
        phoneNumber: '+1234567892',
        emergencyContact: '+1234567893',
        parentId: 'parent002',
        classroomId: 'class001',
        classroom: mockClassrooms[0],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setAssignedClassrooms(mockClassrooms);
      setAssignedSubjects(mockSubjects);
      setUpcomingExams(mockExams);
      setPendingLessons(mockPendingLessons);
      setStudentRisks(mockStudentRisks);

      // Calculate stats
      const totalStudents = mockClassrooms.reduce((sum, c) => sum + c.currentStudents, 0);
      const avgProgress = mockSubjects.length > 0
        ? mockSubjects.reduce((sum, s) => sum + (s.completedTopics / s.totalTopics * 100), 0) / mockSubjects.length
        : 0;

      setStats({
        totalClasses: mockClassrooms.length,
        totalSubjects: mockSubjects.length,
        totalStudents,
        pendingLessons: mockPendingLessons.length,
        upcomingExams: mockExams.length,
        atRiskStudents: mockStudentRisks.length,
        syllabusProgress: avgProgress,
      });

      setLoading(false);
    }, 1000);
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName || 'Teacher'}! Here's your teaching overview and quick access to your classes.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/teachers/syllabus"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {ICONS.Book()} Manage Syllabus
          </Link>
          <Link
            href="/attendance/students"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            {ICONS.UserCheck()} Mark Attendance
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Classes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClasses}</p>
              <p className="text-xs text-gray-500 mt-1">Active classes</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.LayoutGrid()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Subjects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSubjects}</p>
              <p className="text-xs text-gray-500 mt-1">Subjects teaching</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Book()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <div className="text-purple-600">{ICONS.Students()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Syllabus Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.syllabusProgress.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 mt-1">Average completion</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <div className="text-amber-600">{ICONS.BookOpen()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingExams}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Clock()}</div>
            </div>
          </div>
          <Link
            href="/teacher/schedule/events-exams"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View Schedule →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Lessons</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingLessons}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <div className="text-orange-600">{ICONS.Clipboard()}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Needing Attention</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.atRiskStudents}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <div className="text-red-600">{ICONS.AlertTriangle()}</div>
            </div>
          </div>
          <Link
            href="/teacher/students/list"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View Students →
          </Link>
        </div>
      </div>

      {/* My Classes & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
              <p className="text-sm text-gray-600 mt-1">Classes you are assigned to teach</p>
            </div>
            <Link
              href="/teacher/classrooms"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assignedClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{classroom.name}</h4>
                      <p className="text-sm text-gray-600">{classroom.academicYear}</p>
                      {classroom.classMasterId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Class Master: {classroom.classMasterName}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium ml-1">
                        {classroom.currentStudents}/{classroom.capacity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subjects:</span>
                      <span className="font-medium ml-1">
                        {assignedSubjects.filter(s => s.classroomId === classroom.id).length}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/teacher/students/list?classroom=${classroom.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Students
                    </Link>
                    <Link
                      href={`/attendance/students?classroom=${classroom.id}`}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      Mark Attendance
                    </Link>
                  </div>
                </div>
              ))}
              {assignedClassrooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-2">{ICONS.LayoutGrid()}</div>
                  <p>No classes assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Subjects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Subjects</h3>
              <p className="text-sm text-gray-600 mt-1">Subjects you are teaching this term</p>
            </div>
            <Link
              href="/teacher/subjects"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assignedSubjects.map((subject) => {
                const progress = (subject.completedTopics / subject.totalTopics) * 100;
                return (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                        <p className="text-sm text-gray-500">{subject.classroom?.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Progress</div>
                        <div className="font-medium">
                          {subject.completedTopics}/{subject.totalTopics} topics
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        href={`/teachers/syllabus?subject=${subject.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage Syllabus
                      </Link>
                      <Link
                        href={`/teacher/students/list?subject=${subject.id}`}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        View Students
                      </Link>
                      <Link
                        href={`/teacher/assessments/exam-results?subject=${subject.id}`}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Enter Results
                      </Link>
                    </div>
                  </div>
                );
              })}
              {assignedSubjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-2">{ICONS.Book()}</div>
                  <p>No subjects assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams & Students Needing Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
              <p className="text-sm text-gray-600 mt-1">Exams scheduled for your classes</p>
            </div>
            <Link
              href="/teacher/schedule/events-exams"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <p className="text-sm text-gray-600">
                        {exam.subject?.name} • {exam.classroom?.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exam.date} at {exam.startTime} • {exam.duration} minutes
                      </p>
                      {exam.venue && (
                        <p className="text-xs text-gray-500 mt-1">Venue: {exam.venue}</p>
                      )}
                    </div>
                    <span className="ml-4 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {exam.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/teacher/assessments/exam-results?exam=${exam.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Enter Results
                    </Link>
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-2">{ICONS.Clock()}</div>
                <p>No upcoming exams scheduled</p>
                <p className="text-xs mt-1">Exams will appear here when scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Students Needing Attention */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Students Needing Attention</h3>
              <p className="text-sm text-gray-600 mt-1">Students showing academic or attendance concerns</p>
            </div>
            <Link
              href="/teacher/students/list"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {studentRisks.length > 0 ? (
              studentRisks.map((student) => (
                <div key={student.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                      <p className="text-sm text-gray-500">{student.classroom?.name}</p>
                    </div>
                    <span className="ml-4 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      High Risk
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/teacher/students/list?student=${student.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Profile
                    </Link>
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                      Contact Parent
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-2">{ICONS.Check()}</div>
                <p>All students performing well</p>
                <p className="text-xs mt-1">No students require immediate attention</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/teachers/syllabus"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Book()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Manage Syllabus</p>
              <p className="text-xs text-gray-600">Update topics & progress</p>
            </div>
          </Link>
          <Link
            href="/teacher/assessments/exam-results"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Trophy()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Enter Results</p>
              <p className="text-xs text-gray-600">Record exam scores</p>
            </div>
          </Link>
          <Link
            href="/attendance/students"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <div className="text-purple-600">{ICONS.UserCheck()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mark Attendance</p>
              <p className="text-xs text-gray-600">Record daily attendance</p>
            </div>
          </Link>
          <Link
            href="/teachers/timetable"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-amber-100 rounded-lg">
              <div className="text-amber-600">{ICONS.Calendar()}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Timetable</p>
              <p className="text-xs text-gray-600">Check your schedule</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
