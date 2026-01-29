'use client';
import React, { useState, useEffect } from 'react';
import { Classroom, Subject, Student, Exam, LessonNote } from '../../../types';
import { ICONS } from '../../../constants';

export default function TeacherDashboardPage() {
  const [assignedClassrooms, setAssignedClassrooms] = useState<Classroom[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<Subject[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [pendingLessons, setPendingLessons] = useState<LessonNote[]>([]);
  const [studentRisks, setStudentRisks] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for teacher dashboard (simulating Sarah Johnson - Teacher)
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
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
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
    ];

    setTimeout(() => {
      setAssignedClassrooms(mockClassrooms);
      setAssignedSubjects(mockSubjects);
      setUpcomingExams(mockExams);
      setPendingLessons(mockPendingLessons);
      setStudentRisks(mockStudentRisks);
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
          <p className="text-gray-600 mt-1">Your classes, subjects, and teaching activities</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Submit Lesson Note
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.LayoutGrid}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Classes</p>
              <p className="text-2xl font-bold text-gray-900">{assignedClassrooms.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Book}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{assignedSubjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <div className="text-orange-600">{ICONS.ClipboardList}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{pendingLessons.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <div className="text-red-600">{ICONS.AlertTriangle}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentRisks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
          <p className="text-sm text-gray-600 mt-1">Classes you are assigned to teach</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedClassrooms.map((classroom) => (
              <div key={classroom.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{classroom.name}</h4>
                    <p className="text-sm text-gray-600">{classroom.academicYear}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium ml-1">{classroom.currentStudents}/{classroom.capacity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Subjects:</span>
                    <span className="font-medium ml-1">{classroom.subjects?.length || 0}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Students
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Mark Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Subjects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Subjects</h3>
          <p className="text-sm text-gray-600 mt-1">Subjects you are teaching this term</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {assignedSubjects.map((subject) => (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                    <p className="text-sm text-gray-600">{subject.code}</p>
                    <p className="text-sm text-gray-500">{subject.classroom?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="font-medium">{subject.completedTopics}/{subject.totalTopics} topics</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(subject.completedTopics / subject.totalTopics) * 100}%` }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Manage Syllabus
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    View Students
                  </button>
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    Lesson Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Exams & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <p className="text-sm text-gray-600">{exam.subject?.name} - {exam.classroom?.name}</p>
                    <p className="text-sm text-gray-500">{exam.date} at {exam.startTime} ({exam.duration} min)</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {exam.status}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Download Papers
                  </button>
                </div>
              </div>
            ))}
            {upcomingExams.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No upcoming exams scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Risk List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Students Needing Attention</h3>
            <p className="text-sm text-gray-600 mt-1">Students showing academic or attendance concerns</p>
          </div>
          <div className="divide-y divide-gray-200">
            {studentRisks.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                    <p className="text-sm text-gray-500">{student.classroom?.name}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    High Risk
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Profile
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Contact Parent
                  </button>
                </div>
              </div>
            ))}
            {studentRisks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>All students performing well</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}