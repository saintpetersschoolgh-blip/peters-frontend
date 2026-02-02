'use client';
import React, { useMemo, useState } from 'react';
import { Classroom, Subject, Teacher, TimetableEntry } from '../../../types';
import { ICONS } from '../../../constants';

const DAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
];

const PERIODS = [
  { period: 1, start: '08:00', end: '09:00' },
  { period: 2, start: '09:00', end: '10:00' },
  { period: 3, start: '10:15', end: '11:15' },
  { period: 4, start: '11:30', end: '12:30' },
  { period: 5, start: '13:30', end: '14:30' },
  { period: 6, start: '14:45', end: '15:45' },
];

const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher001',
    staffNumber: 'T001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '1985-05-15',
    gender: 'FEMALE',
    address: '123 Main St',
    qualifications: ['B.Ed Mathematics'],
    subjects: [],
    classrooms: [],
    isActive: true,
    joinedAt: '2020-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'teacher002',
    staffNumber: 'T002',
    firstName: 'Daniel',
    lastName: 'Kofi',
    email: 'daniel.kofi@school.com',
    phoneNumber: '+1234567891',
    dateOfBirth: '1988-08-20',
    gender: 'MALE',
    address: '456 Oak St',
    qualifications: ['B.Sc Physics'],
    subjects: [],
    classrooms: [],
    isActive: true,
    joinedAt: '2021-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 'class001',
    name: 'Grade 8 - A',
    academicYear: '2024-2025',
    classMasterId: 'teacher001',
    capacity: 32,
    currentStudents: 30,
    subjects: [],
    teachers: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'class002',
    name: 'Grade 8 - B',
    academicYear: '2024-2025',
    classMasterId: 'teacher002',
    capacity: 30,
    currentStudents: 28,
    subjects: [],
    teachers: [],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'subj001',
    name: 'Mathematics',
    code: 'MATH-8',
    description: 'Core mathematics',
    classroomId: 'class001',
    teachers: [],
    totalTopics: 20,
    completedTopics: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'subj002',
    name: 'English',
    code: 'ENG-8',
    description: 'Language and literature',
    classroomId: 'class002',
    teachers: [],
    totalTopics: 18,
    completedTopics: 12,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'subj003',
    name: 'Science',
    code: 'SCI-8',
    description: 'General science',
    classroomId: 'class001',
    teachers: [],
    totalTopics: 22,
    completedTopics: 18,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const MOCK_TIMETABLE: TimetableEntry[] = [
  {
    id: 'tt001',
    subjectId: 'subj001',
    subject: MOCK_SUBJECTS[0],
    teacherId: 'teacher001',
    teacher: MOCK_TEACHERS[0],
    classroomId: 'class001',
    classroom: MOCK_CLASSROOMS[0],
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:00',
    period: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tt002',
    subjectId: 'subj002',
    subject: MOCK_SUBJECTS[1],
    teacherId: 'teacher001',
    teacher: MOCK_TEACHERS[0],
    classroomId: 'class002',
    classroom: MOCK_CLASSROOMS[1],
    dayOfWeek: 2,
    startTime: '09:00',
    endTime: '10:00',
    period: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tt003',
    subjectId: 'subj003',
    subject: MOCK_SUBJECTS[2],
    teacherId: 'teacher002',
    teacher: MOCK_TEACHERS[1],
    classroomId: 'class001',
    classroom: MOCK_CLASSROOMS[0],
    dayOfWeek: 3,
    startTime: '10:15',
    endTime: '11:15',
    period: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tt004',
    subjectId: 'subj001',
    subject: MOCK_SUBJECTS[0],
    teacherId: 'teacher002',
    teacher: MOCK_TEACHERS[1],
    classroomId: 'class002',
    classroom: MOCK_CLASSROOMS[1],
    dayOfWeek: 4,
    startTime: '13:30',
    endTime: '14:30',
    period: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tt005',
    subjectId: 'subj002',
    subject: MOCK_SUBJECTS[1],
    teacherId: 'teacher001',
    teacher: MOCK_TEACHERS[0],
    classroomId: 'class001',
    classroom: MOCK_CLASSROOMS[0],
    dayOfWeek: 5,
    startTime: '14:45',
    endTime: '15:45',
    period: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export default function TeacherTimetablePage() {
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  const filteredEntries = useMemo(() => {
    return MOCK_TIMETABLE.filter(entry => {
      if (selectedTeacher !== 'all' && entry.teacherId !== selectedTeacher) return false;
      if (selectedClassroom !== 'all' && entry.classroomId !== selectedClassroom) return false;
      return true;
    });
  }, [selectedTeacher, selectedClassroom]);

  const getEntry = (day: number, period: number) =>
    filteredEntries.find(entry => entry.dayOfWeek === day && entry.period === period);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Timetable</h1>
          <p className="text-gray-600 mt-1">Weekly teaching schedule and assigned classes</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.Add}
            Add Session
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Teachers</option>
              {MOCK_TEACHERS.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classroom</label>
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classrooms</option>
              {MOCK_CLASSROOMS.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 px-3 py-2 rounded-md border transition-colors ${
                viewMode === 'week'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-3 py-2 rounded-md border transition-colors ${
                viewMode === 'list'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                    Period
                  </th>
                  {DAYS.map(day => (
                    <th
                      key={day.value}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {PERIODS.map(slot => (
                  <tr key={slot.period}>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">Period {slot.period}</div>
                      <div className="text-xs text-gray-500">
                        {slot.start} - {slot.end}
                      </div>
                    </td>
                    {DAYS.map(day => {
                      const entry = getEntry(day.value, slot.period);
                      return (
                        <td key={`${day.value}-${slot.period}`} className="px-4 py-4 align-top">
                          {entry ? (
                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 space-y-1">
                              <div className="text-sm font-semibold text-blue-900">
                                {entry.subject?.name}
                              </div>
                              <div className="text-xs text-blue-700">
                                {entry.classroom?.name}
                              </div>
                              <div className="text-xs text-blue-600">
                                {entry.teacher?.firstName} {entry.teacher?.lastName}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {entry.subject?.name} • {entry.classroom?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {DAYS.find(day => day.value === entry.dayOfWeek)?.label} • {entry.startTime} - {entry.endTime}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {entry.teacher?.firstName} {entry.teacher?.lastName}
                </div>
              </div>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-sm text-gray-500">
              No timetable entries match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}