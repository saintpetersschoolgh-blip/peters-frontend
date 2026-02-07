/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ICONS } from '../../constants';
import { TeacherStudentsOverviewPage } from './students/TeacherStudentsOverviewPage';
import { TeacherStudentProfilePage } from './students/TeacherStudentProfilePage';
import { TeacherStudentPerformancePage } from './students/TeacherStudentPerformancePage';
import { Exam, ExamResult, Student } from '../../types';

type Option = { value: string; label: string };
type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select';

interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Option[];
}

interface PageDef {
  title: string;
  description?: string;
  kind: 'list' | 'form' | 'detail' | 'attendance' | 'gradebook';
  storageKey?: string;
  primaryActionLabel?: string;
  fields?: FieldDef[];
  columns?: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
}

function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const save = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return [value, save] as const;
}

function getClassLabel(c: any): string {
  return String(c?.className || c?.name || c?.title || c?.label || '').trim();
}

function teacherSeedForStorageKey(key: string): any[] {
  const today = new Date();
  const yyyyMmDd = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };

  const SEED: Record<string, any[]> = {
    'teacher:today-classes': [
      { id: 'tc-1', title: 'Grade 10A - Mathematics', description: 'Algebra: Linear equations', date: yyyyMmDd(today) },
      { id: 'tc-2', title: 'Grade 10B - English', description: 'Comprehension practice', date: yyyyMmDd(today) },
    ],
    'teacher:pending-grading': [
      { id: 'pg-1', title: 'CA 1 - Grade 10A (Math)', description: '23 submissions pending', date: yyyyMmDd(addDays(-1)) },
      { id: 'pg-2', title: 'Assignment - Grade 10B (English)', description: '17 submissions pending', date: yyyyMmDd(addDays(-2)) },
    ],
    'teacher:announcements': [
      {
        id: 'ann-1',
        title: 'Mock Exam Schedule',
        message: 'Mock exams start next week. Please prepare your students accordingly.',
        date: yyyyMmDd(addDays(-3)),
        createdAt: new Date(addDays(-3)).toISOString(),
        updatedAt: new Date(addDays(-3)).toISOString(),
      },
      {
        id: 'ann-2',
        title: 'Staff Meeting Reminder',
        message: 'Staff meeting on Friday at 2:00 PM in the main hall.',
        date: yyyyMmDd(addDays(-1)),
        createdAt: new Date(addDays(-1)).toISOString(),
        updatedAt: new Date(addDays(-1)).toISOString(),
      },
    ],
    'teacher:my-classes': [
      { id: 'mc-1', title: 'Grade 10A', description: '35 students', date: yyyyMmDd(today) },
      { id: 'mc-2', title: 'Grade 10B', description: '33 students', date: yyyyMmDd(today) },
    ],
    'teacher:my-subjects': [
      { id: 'ms-1', title: 'Mathematics', description: 'Grade 10A, Grade 10B', date: yyyyMmDd(today) },
      { id: 'ms-2', title: 'ICT', description: 'Grade 10A', date: yyyyMmDd(today) },
    ],
    'teacher:attendance-history': [
      { id: 'ah-1', title: 'Grade 10A Attendance', description: 'Present: 32 • Absent: 3', date: yyyyMmDd(addDays(-1)) },
      { id: 'ah-2', title: 'Grade 10B Attendance', description: 'Present: 30 • Absent: 3', date: yyyyMmDd(addDays(-2)) },
    ],
    'teacher:assessments': [
      { id: 'as-1', type: 'QUIZ', title: 'Algebra Quiz 1', class: 'Grade 10A', subject: 'Mathematics', date: yyyyMmDd(addDays(-5)), totalScore: 20, createdAt: new Date(addDays(-5)).toISOString() },
      { id: 'as-2', type: 'TEST', title: 'English Test - Comprehension', class: 'Grade 10B', subject: 'English', date: yyyyMmDd(addDays(-10)), totalScore: 50, createdAt: new Date(addDays(-10)).toISOString() },
    ],
    'teacher:ca': [
      { id: 'ca-1', title: 'CA - Fractions', description: 'Continuous assessment (Math)', date: yyyyMmDd(addDays(-14)) },
      { id: 'ca-2', title: 'CA - Essay Writing', description: 'Continuous assessment (English)', date: yyyyMmDd(addDays(-12)) },
    ],
    'teacher:exam-results': [
      { id: 'er-1', title: 'Mid-Term Results - Grade 10A', description: 'Math mid-term result summary', date: yyyyMmDd(addDays(-20)) },
      { id: 'er-2', title: 'Mid-Term Results - Grade 10B', description: 'English mid-term result summary', date: yyyyMmDd(addDays(-20)) },
    ],
    'teacher:comments': [
      { id: 'cmt-1', student: 'John Doe (STU001)', comment: 'Excellent progress this term.', date: yyyyMmDd(addDays(-7)) },
      { id: 'cmt-2', student: 'Jane Smith (STU002)', comment: 'Needs to participate more in class.', date: yyyyMmDd(addDays(-8)) },
    ],
    'teacher:submissions': [
      { id: 'subm-1', title: 'Assignment: Reading Comprehension', description: 'Submitted: 30 • Pending: 3', date: yyyyMmDd(addDays(-4)) },
      { id: 'subm-2', title: 'Homework: Algebra Practice', description: 'Submitted: 31 • Pending: 4', date: yyyyMmDd(addDays(-6)) },
    ],
    'teacher:feedback': [
      { id: 'fb-1', student: 'John Doe (STU001)', feedback: 'Great work. Keep it up.', date: yyyyMmDd(addDays(-2)) },
      { id: 'fb-2', student: 'Jane Smith (STU002)', feedback: 'Revise topics 3–5 for improvement.', date: yyyyMmDd(addDays(-3)) },
    ],
    'teacher:class-notices': [
      { id: 'cn-1', title: 'Homework Reminder', message: 'Submit homework by tomorrow morning.', date: yyyyMmDd(today) },
      { id: 'cn-2', title: 'Bring Textbooks', message: 'Bring your English textbooks for next lesson.', date: yyyyMmDd(addDays(1)) },
    ],
    'teacher:materials': [
      { id: 'mat-1', title: 'Algebra Notes (PDF)', description: 'Week 3 notes', date: yyyyMmDd(addDays(-9)) },
      { id: 'mat-2', title: 'ICT Resources (Link)', description: 'Intro to spreadsheets', date: yyyyMmDd(addDays(-11)) },
    ],
    'teacher:calendar': [
      { id: 'cal-1', title: 'PTA Meeting', date: yyyyMmDd(addDays(2)), createdAt: new Date(addDays(2)).toISOString() },
      { id: 'cal-2', title: 'Mid-Term Exams Begin', date: yyyyMmDd(addDays(7)), createdAt: new Date(addDays(7)).toISOString() },
    ],
    'teacher:events-exams': [
      { id: 'ee-1', title: 'Sports Day', type: 'EVENT', date: yyyyMmDd(addDays(10)) },
      { id: 'ee-2', title: 'Mathematics Mock Exam', type: 'EXAM', date: yyyyMmDd(addDays(14)) },
    ],
    'teacher:remarks': [
      { id: 'rm-1', student: 'John Doe (STU001)', remark: 'Very punctual and focused.', date: yyyyMmDd(addDays(-5)) },
      { id: 'rm-2', student: 'Jane Smith (STU002)', remark: 'Improving steadily.', date: yyyyMmDd(addDays(-5)) },
    ],
    'teacher:behavior': [
      { id: 'bh-1', student: 'John Doe (STU001)', record: 'Helped classmates during group work.', date: yyyyMmDd(addDays(-6)) },
      { id: 'bh-2', student: 'Jane Smith (STU002)', record: 'Late to class (warning issued).', date: yyyyMmDd(addDays(-6)) },
    ],
    'teacher:recommendations': [
      { id: 'rec-1', student: 'John Doe (STU001)', recommendation: 'Consider Math club leadership role.', date: yyyyMmDd(addDays(-10)) },
      { id: 'rec-2', student: 'Jane Smith (STU002)', recommendation: 'Extra reading practice recommended.', date: yyyyMmDd(addDays(-10)) },
    ],
    'teacher:classrooms': [
      { id: 'cr-1', name: 'Grade 10A', code: 'G10A', academicYear: '2025-2026', capacity: 40, status: 'ACTIVE', createdAt: new Date(addDays(-40)).toISOString() },
      { id: 'cr-2', name: 'Grade 10B', code: 'G10B', academicYear: '2025-2026', capacity: 40, status: 'ACTIVE', createdAt: new Date(addDays(-40)).toISOString() },
      { id: 'cr-3', name: 'Grade 11A', code: 'G11A', academicYear: '2025-2026', capacity: 45, status: 'INACTIVE', createdAt: new Date(addDays(-90)).toISOString() },
    ],
    'teacher:subjects': [
      { id: 'sub-1', name: 'Mathematics', code: 'MATH101', classroom: 'Grade 10A', status: 'ACTIVE', createdAt: new Date(addDays(-60)).toISOString() },
      { id: 'sub-2', name: 'English Language', code: 'ENG101', classroom: 'Grade 10B', status: 'ACTIVE', createdAt: new Date(addDays(-60)).toISOString() },
      { id: 'sub-3', name: 'ICT', code: 'ICT101', classroom: 'Grade 10A', status: 'ACTIVE', createdAt: new Date(addDays(-50)).toISOString() },
    ],
    'teacher:my-students': [
      { id: 'stu-1', admissionNumber: 'STU001', firstName: 'John', lastName: 'Doe', gender: 'MALE', phoneNumber: '+233501234567', className: 'Grade 10A', status: 'ACTIVE', createdAt: new Date(addDays(-30)).toISOString(), updatedAt: new Date(addDays(-30)).toISOString() },
      { id: 'stu-2', admissionNumber: 'STU002', firstName: 'Jane', lastName: 'Smith', gender: 'FEMALE', phoneNumber: '+233501234568', className: 'Grade 10A', status: 'ACTIVE', createdAt: new Date(addDays(-30)).toISOString(), updatedAt: new Date(addDays(-30)).toISOString() },
      { id: 'stu-3', admissionNumber: 'STU003', firstName: 'Kofi', lastName: 'Mensah', gender: 'MALE', phoneNumber: '+233501234569', className: 'Grade 10B', status: 'ACTIVE', createdAt: new Date(addDays(-20)).toISOString(), updatedAt: new Date(addDays(-20)).toISOString() },
    ],
  };

  return SEED[key] || [];
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            {ICONS.Close}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

const IMPORTED_RESULTS_KEY = 'importedExamResults';

function TeacherExamResultsPage() {
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

  const mockExams: Exam[] = [
    {
      id: 'e001',
      title: 'Mathematics Mid-Term Exam',
      subjectId: 's001',
      classroomId: 'c001',
      term: 'Term 1',
      date: '2024-02-15',
      startTime: '09:00',
      duration: 120,
      totalScore: 100,
      venue: 'Room 101',
      status: 'GRADED' as any,
      createdById: 'u001',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
    },
  ];

  function loadImportedResults() {
    try {
      const raw = localStorage.getItem(IMPORTED_RESULTS_KEY);
      return raw ? (JSON.parse(raw) as ExamResult[]) : [];
    } catch {
      return [];
    }
  }

  function persistImportedResults(items: ExamResult[]) {
    try {
      localStorage.setItem(IMPORTED_RESULTS_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }

  const [students] = useState<Student[]>(mockStudents);
  const [exams] = useState<Exam[]>(mockExams);
  const [results, setResults] = useState<ExamResult[]>(() => loadImportedResults());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>(mockExams[0]?.id || '');
  const [importError, setImportError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const filteredResults = results.filter(result => {
    const matchesSearch = `${result.student?.firstName} ${result.student?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student?.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.exam?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'ALL' || result.examId === selectedExam;
    return matchesSearch && matchesExam;
  });

  const calculateGrade = (score: number, totalScore: number): string => {
    const percentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  const handleImportClick = () => {
    setImportError(null);
    if (!selectedExam || selectedExam === 'ALL') {
      setImportError('Select an exam before importing results.');
      return;
    }
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

        const selectedExamObj = exams.find(e => e.id === selectedExam);
        if (!selectedExamObj) {
          setImportError('Selected exam not found.');
          return;
        }

        const newResults: ExamResult[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const admissionNumber = String(row.admissionNumber || row.AdmissionNumber || row.admission || '').trim();
          const studentId = String(row.studentId || row.StudentId || row.studentID || '').trim();
          const scoreRaw = row.score ?? row.Score ?? '';
          const remarks = String(row.remarks || row.Remarks || '').trim();

          const student =
            (studentId && students.find(s => s.id === studentId)) ||
            (admissionNumber && students.find(s => s.admissionNumber === admissionNumber));

          const score = Number(scoreRaw);

          if (!student) {
            errors.push(`Row ${index + 2}: student not found.`);
            return;
          }
          if (Number.isNaN(score)) {
            errors.push(`Row ${index + 2}: invalid score.`);
            return;
          }

          const grade =
            String(row.grade || row.Grade || '').trim() ||
            calculateGrade(score, selectedExamObj.totalScore);

          newResults.push({
            id: `import_${selectedExam}_${student.id}_${Date.now()}_${index}`,
            examId: selectedExam,
            exam: selectedExamObj,
            studentId: student.id,
            student,
            score,
            grade,
            remarks,
            enteredById: 'teacher',
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });

        if (errors.length) {
          setImportError(errors.slice(0, 3).join(' '));
          return;
        }

        setResults(prev => {
          const filtered = prev.filter(r => r.examId !== selectedExam);
          const next = [...filtered, ...newResults];
          persistImportedResults(next);
          return next;
        });
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

  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const templateRows = [
      {
        admissionNumber: 'STU001',
        studentId: '',
        score: 85,
        grade: '',
        remarks: 'Excellent performance',
        examId: selectedExam || '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ResultsTemplate');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'exam_results_template.csv';
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    XLSX.writeFile(workbook, 'exam_results_template.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-600 mt-1">Import results for headmaster approval</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            Import Results
          </button>
          <button
            onClick={() => handleDownloadTemplate('xlsx')}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Download Template
          </button>
          <button
            onClick={() => handleDownloadTemplate('csv')}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
            <select
              value={selectedExam || 'ALL'}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500 flex items-end">
            Import columns: admissionNumber or studentId, score, optional grade, remarks.
          </div>
        </div>
        {importError && <div className="text-sm text-red-600">{importError}</div>}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Imported Results ({filteredResults.length})
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
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map(result => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.student?.firstName} {result.student?.lastName}
                    <div className="text-xs text-gray-500">{result.student?.admissionNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.exam?.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.score}/{result.exam?.totalScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {result.isPublished ? 'Approved' : 'Pending approval'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredResults.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-500">
            No imported results yet. Use the Import button to upload an Excel/CSV file.
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(value: any) {
  try {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  } catch {
    return String(value ?? '-');
  }
}

function Badge({ text, color }: { text: string; color: string }) {
  return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
}

function Field({
  def,
  value,
  onChange,
  error,
}: {
  def: FieldDef;
  value: any;
  onChange: (next: any) => void;
  error?: string;
}) {
  const common =
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {def.label} {def.required ? <span className="text-red-500">*</span> : null}
      </label>
      {def.type === 'textarea' ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={def.placeholder}
          className={common}
        />
      ) : def.type === 'select' ? (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={common}>
          <option value="">Select...</option>
          {(def.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={def.type}
          value={value ?? ''}
          onChange={(e) => onChange(def.type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={def.placeholder}
          className={common}
        />
      )}
      {error ? <p className="text-red-600 text-xs mt-1">{error}</p> : null}
    </div>
  );
}

function TeacherMyStudentsPage() {
  const [classes] = useLocalStorageState<any[]>('teacher:my-classes', teacherSeedForStorageKey('teacher:my-classes'));
  const allowedClasses = useMemo(() => {
    const names = classes
      .map(getClassLabel)
      .filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [classes]);

  const [students, setStudents] = useLocalStorageState<any[]>('teacher:my-students', teacherSeedForStorageKey('teacher:my-students'));
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, any>>({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    gender: 'MALE',
    phoneNumber: '',
    className: allowedClasses[0] || '',
    status: 'ACTIVE',
  });

  const filtered = useMemo(() => {
    const byAllowedClass = students.filter((s) => {
      const c = String(s.className || '').trim();
      return c && allowedClasses.includes(c);
    });

    return byAllowedClass.filter((s) => {
      const matchesSearch = `${s.firstName} ${s.lastName} ${s.admissionNumber} ${s.className} ${s.phoneNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesClass = selectedClass === 'ALL' || String(s.className) === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, search, selectedClass, allowedClasses]);

  const openCreate = () => {
    setEditing(null);
    setFormErrors({});
    setForm({
      admissionNumber: '',
      firstName: '',
      lastName: '',
      gender: 'MALE',
      phoneNumber: '',
      className: selectedClass !== 'ALL' ? selectedClass : (allowedClasses[0] || ''),
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setFormErrors({});
    setForm({
      admissionNumber: row.admissionNumber || '',
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      gender: row.gender || 'MALE',
      phoneNumber: row.phoneNumber || '',
      className: row.className || '',
      status: row.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!String(form.firstName || '').trim()) errors.firstName = 'First name is required';
    if (!String(form.lastName || '').trim()) errors.lastName = 'Last name is required';
    if (!String(form.admissionNumber || '').trim()) errors.admissionNumber = 'Admission number is required';
    if (!String(form.className || '').trim()) errors.className = 'Class is required';
    if (String(form.className || '').trim() && !allowedClasses.includes(String(form.className).trim())) {
      errors.className = 'Pick a class you teach (add it in My Classes first)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 250));

    const id = editing?.id ?? String(Date.now());
    const nextItem = {
      ...(editing || {}),
      id,
      admissionNumber: String(form.admissionNumber).trim().toUpperCase(),
      firstName: String(form.firstName).trim(),
      lastName: String(form.lastName).trim(),
      gender: form.gender,
      phoneNumber: String(form.phoneNumber || '').trim(),
      className: String(form.className).trim(),
      status: form.status,
      createdAt: editing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStudents(editing ? students.map((s) => (s.id === editing.id ? nextItem : s)) : [nextItem, ...students]);
    setShowModal(false);
    setEditing(null);
    setIsSubmitting(false);
  };

  const remove = (id: string) => setStudents(students.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-1">Students in the classes you teach</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={allowedClasses.length === 0}
          title={allowedClasses.length === 0 ? 'Add your classes first (My Classes)' : ''}
        >
          {ICONS.Add}
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission number, phone, or class..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All my classes</option>
              {allowedClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {allowedClasses.length === 0 ? (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            No classes found for this teacher yet. Add at least one class in{' '}
            <button
              className="underline font-medium"
              onClick={() => (window.location.hash = '#/teacher/classes/my-classes')}
              type="button"
            >
              My Classes
            </button>{' '}
            before adding students.
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Students ({filtered.length})</h3>
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
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
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
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {(s.firstName || 'S')[0]}
                            {(s.lastName || ' ')[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{s.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.admissionNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.phoneNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        s.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setEditing(s);
                          setShowDelete(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm mt-1">Add a student or adjust your filters.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editing ? 'Edit Student' : 'Add Student'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Student details and class assignment</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
                {ICONS.Close}
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  def={{ name: 'firstName', label: 'First Name', type: 'text', required: true }}
                  value={form.firstName}
                  error={formErrors.firstName}
                  onChange={(v) => setForm((p) => ({ ...p, firstName: v }))}
                />
                <Field
                  def={{ name: 'lastName', label: 'Last Name', type: 'text', required: true }}
                  value={form.lastName}
                  error={formErrors.lastName}
                  onChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
                />
                <Field
                  def={{ name: 'admissionNumber', label: 'Admission Number', type: 'text', required: true, placeholder: 'STU001' }}
                  value={form.admissionNumber}
                  error={formErrors.admissionNumber}
                  onChange={(v) => setForm((p) => ({ ...p, admissionNumber: v }))}
                />
                <Field
                  def={{
                    name: 'gender',
                    label: 'Gender',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                    ],
                  }}
                  value={form.gender}
                  error={formErrors.gender}
                  onChange={(v) => setForm((p) => ({ ...p, gender: v }))}
                />
                <Field
                  def={{ name: 'phoneNumber', label: 'Phone', type: 'text', placeholder: '+233...' }}
                  value={form.phoneNumber}
                  error={formErrors.phoneNumber}
                  onChange={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
                />
                <Field
                  def={{
                    name: 'className',
                    label: 'Class',
                    type: 'select',
                    required: true,
                    options: allowedClasses.map((c) => ({ value: c, label: c })),
                  }}
                  value={form.className}
                  error={formErrors.className}
                  onChange={(v) => setForm((p) => ({ ...p, className: v }))}
                />
                <Field
                  def={{
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'ACTIVE', label: 'Active' },
                      { value: 'INACTIVE', label: 'Inactive' },
                    ],
                  }}
                  value={form.status}
                  error={formErrors.status}
                  onChange={(v) => setForm((p) => ({ ...p, status: v }))}
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDelete && editing ? (
        <Modal title="Delete Student" onClose={() => setShowDelete(false)}>
          <p className="text-gray-700 mb-4">Are you sure you want to delete this student?</p>
          <div className="bg-gray-50 rounded-md border border-gray-200 p-3 text-sm text-gray-700">
            {editing.firstName} {editing.lastName} • {editing.admissionNumber} • {editing.className}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowDelete(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                remove(editing.id);
                setShowDelete(false);
                setEditing(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={isSubmitting}
            >
              Delete
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function AdminStyleListPage({ def }: { def: PageDef }) {
  const storageKey = def.storageKey || `teacher:${def.title}`;
  const [items, setItems] = useLocalStorageState<any[]>(
    storageKey,
    teacherSeedForStorageKey(storageKey),
  );
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAssignmentSubmissions = storageKey === 'teacher:submissions';
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((it) => JSON.stringify(it).toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    const initial: Record<string, any> = {};
    (def.fields || []).forEach((f) => (initial[f.name] = ''));
    setForm(initial);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const next: Record<string, any> = {};
    (def.fields || []).forEach((f) => (next[f.name] = item[f.name] ?? ''));
    setForm(next);
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    (def.fields || []).forEach((f) => {
      if (f.required) {
        const v = form[f.name];
        if (v === undefined || v === null || String(v).trim() === '') {
          errors[f.name] = `${f.label} is required`;
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 250));
    const id = editing?.id ?? String(Date.now());
    const nextItem = {
      ...(editing || {}),
      id,
      ...form,
      createdAt: editing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(editing ? items.map((it) => (it.id === editing.id ? nextItem : it)) : [nextItem, ...items]);
    setShowModal(false);
    setEditing(null);
    setIsSubmitting(false);
  };

  const remove = (id: string) => setItems(items.filter((it) => it.id !== id));

  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const templateRows = [
      {
        title: 'Assignment: Reading Comprehension',
        description: 'Submitted: 30 • Pending: 3',
        date: new Date().toISOString().split('T')[0],
        student: 'John Doe (STU001)',
        status: 'Submitted',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AssignmentsTemplate');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'assignment_submissions_template.csv';
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    XLSX.writeFile(workbook, 'assignment_submissions_template.xlsx');
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

        const imported = rows.map((row, index) => ({
          id: `import_${Date.now()}_${index}`,
          title: String(row.title || row.Title || row.assignment || row.Assignment || 'Imported Submission').trim(),
          description: String(row.description || row.Description || row.notes || row.Notes || '').trim(),
          date: String(row.date || row.Date || row.submittedDate || row.SubmittedDate || '').trim(),
          student: String(row.student || row.Student || row.studentName || row.StudentName || '').trim(),
          status: String(row.status || row.Status || 'Submitted').trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setItems(prev => [...imported, ...prev]);
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

  const columns =
    def.columns ||
    (def.fields && def.fields.length
      ? def.fields.slice(0, 4).map((f) => ({ key: f.name, label: f.label }))
      : [
          { key: 'title', label: 'Title' },
          { key: 'createdAt', label: 'Date', render: (r) => formatDate(r.createdAt) },
        ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{def.title}</h1>
          {def.description ? <p className="text-gray-600 mt-1">{def.description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {isAssignmentSubmissions && (
            <>
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
                onClick={() => handleDownloadTemplate('xlsx')}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Download Template
              </button>
            </>
          )}
        {def.primaryActionLabel ? (
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {ICONS.Add}
            {def.primaryActionLabel}
          </button>
        ) : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full">
              Export
            </button>
          </div>
        </div>
        {isAssignmentSubmissions && (
          <div className="text-xs text-gray-500 mt-3">
            Import columns: <span className="font-semibold">title</span>, <span className="font-semibold">description</span>, <span className="font-semibold">date</span>, <span className="font-semibold">student</span>, <span className="font-semibold">status</span>.
          </div>
        )}
        {importError && <div className="text-sm text-red-600 mt-2">{importError}</div>}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Records ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {c.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {c.render ? c.render(it) : String(it[c.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {def.fields?.length ? (
                        <button onClick={() => openEdit(it)} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                      ) : null}
                      <button
                        onClick={() => {
                          setEditing(it);
                          setShowDelete(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-gray-500" colSpan={columns.length + 1}>
                    <div className="space-y-2">
                      <div className="text-3xl">{ICONS.List}</div>
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm">Try adjusting your search or add a new record.</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && def.fields?.length ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editing ? `Edit ${def.title}` : def.primaryActionLabel || def.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Fill in the details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
                {ICONS.Close}
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <div className="space-y-4">
                {(def.fields || []).map((f) => (
                  <Field
                    key={f.name}
                    def={f}
                    value={form[f.name]}
                    error={formErrors[f.name]}
                    onChange={(v) => {
                      setForm((p) => ({ ...p, [f.name]: v }));
                      if (formErrors[f.name]) {
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next[f.name];
                          return next;
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDelete && editing ? (
        <Modal title="Delete Record" onClose={() => setShowDelete(false)}>
          <p className="text-gray-700 mb-4">Are you sure you want to delete this record? This cannot be undone.</p>
          <div className="bg-gray-50 rounded-md border border-gray-200 p-3 text-xs text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(editing, null, 2)}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowDelete(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                remove(editing.id);
                setShowDelete(false);
                setEditing(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function AdminStyleFormPage({ def }: { def: PageDef }) {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    (def.fields || []).forEach((f) => (init[f.name] = ''));
    return init;
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{def.title}</h1>
        {def.description ? <p className="text-gray-600 mt-1">{def.description}</p> : null}
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {(def.fields || []).map((f) => (
          <Field key={f.name} def={f} value={form[f.name]} onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))} />
        ))}
        {saved ? <p className="text-sm text-green-700">Saved.</p> : null}
        <div className="flex justify-end">
          <button
            onClick={() => setSaved(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900">Logout</h1>
      <p className="text-gray-600">Use the profile menu in the top right to logout.</p>
    </div>
  );
}

export default function TeacherFeaturePage({ pathname }: { pathname: string }) {
  const defs: Record<string, PageDef> = {
    // Overview
    '/teacher/overview/today-classes': { title: "Today’s classes", kind: 'list', storageKey: 'teacher:today-classes' },
    '/teacher/overview/pending-grading': { title: 'Pending grading', kind: 'list', storageKey: 'teacher:pending-grading' },
    '/teacher/overview/announcements': {
      title: 'Announcements',
      kind: 'list',
      storageKey: 'teacher:announcements',
      primaryActionLabel: 'Post Announcement',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Announcement title' },
        { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Write the announcement...' },
      ],
      columns: [
        { key: 'title', label: 'Title' },
        { key: 'createdAt', label: 'Date', render: (r) => formatDate(r.createdAt) },
      ],
    },
    '/teacher/overview/quick-stats': { title: 'Quick stats', kind: 'detail' },

    // Classes & Subjects
    '/teacher/classes/my-classes': { title: 'My Classes', kind: 'list', storageKey: 'teacher:my-classes' },
    '/teacher/classes/my-subjects': { title: 'My Subjects', kind: 'list', storageKey: 'teacher:my-subjects' },
    '/teacher/classes/timetable': { title: 'Class Timetable', kind: 'detail' },
    '/teacher/classes/roster': { title: 'Class Roster', kind: 'detail' },
    '/teacher/classrooms': {
      title: 'ClassRoom',
      kind: 'list',
      storageKey: 'teacher:classrooms',
      primaryActionLabel: undefined,
      fields: [
        { name: 'name', label: 'ClassRoom', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'academicYear', label: 'Academic Year', type: 'text' },
        { name: 'capacity', label: 'Capacity', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', required: true, options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }] },
      ],
      columns: [
        { key: 'name', label: 'ClassRoom' },
        { key: 'code', label: 'Code' },
        { key: 'academicYear', label: 'Academic Year' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'status', label: 'Status' },
      ],
    },
    '/teacher/subjects': {
      title: 'Subject',
      kind: 'list',
      storageKey: 'teacher:subjects',
      primaryActionLabel: undefined,
      fields: [
        { name: 'name', label: 'Subject', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'classroom', label: 'ClassRoom', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', required: true, options: [{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }] },
      ],
      columns: [
        { key: 'name', label: 'Subject' },
        { key: 'code', label: 'Code' },
        { key: 'classroom', label: 'ClassRoom' },
        { key: 'status', label: 'Status' },
      ],
    },

    // Students
    '/teacher/students/list': { title: 'My Students', kind: 'detail' },
    '/teacher/students/profile': { title: 'Student Profile', kind: 'detail' },
    '/teacher/students/profile/bio': { title: 'Bio data', kind: 'detail' },
    '/teacher/students/profile/academic-history': { title: 'Academic history', kind: 'detail' },
    '/teacher/students/profile/attendance-summary': { title: 'Attendance summary', kind: 'detail' },
    '/teacher/students/profile/performance-summary': { title: 'Performance summary', kind: 'detail' },

    // Attendance
    '/teacher/attendance/mark': {
      title: 'Mark Attendance',
      kind: 'form',
      fields: [
        { name: 'class', label: 'Class', type: 'text', required: true, placeholder: 'e.g. Grade 10A' },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'presentCount', label: 'Present count', type: 'number', required: true, placeholder: '0' },
        { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes...' },
      ],
    },
    '/teacher/attendance/edit-today': { title: "Edit Today’s Attendance", kind: 'detail' },
    '/teacher/attendance/history': { title: 'Attendance History', kind: 'list', storageKey: 'teacher:attendance-history' },
    '/teacher/attendance/reports': { title: 'Attendance Reports', kind: 'detail' },

    // Assessments & Exams
    '/teacher/assessments/create': {
      title: 'Create Assessment',
      kind: 'form',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { value: 'QUIZ', label: 'Quiz' },
            { value: 'TEST', label: 'Test' },
            { value: 'EXAM', label: 'Exam' },
          ],
        },
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. Math Quiz 1' },
        { name: 'class', label: 'Class', type: 'text', required: true, placeholder: 'e.g. Grade 10A' },
        { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'e.g. Mathematics' },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'totalScore', label: 'Total Score', type: 'number', required: true, placeholder: '100' },
      ],
    },
    '/teacher/assessments/list': {
      title: 'Assessment List',
      kind: 'list',
      storageKey: 'teacher:assessments',
      primaryActionLabel: 'Create Assessment',
      fields: [
        { name: 'type', label: 'Type', type: 'select', required: true, options: [{ value: 'QUIZ', label: 'Quiz' }, { value: 'TEST', label: 'Test' }, { value: 'EXAM', label: 'Exam' }] },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'class', label: 'Class', type: 'text', required: true },
        { name: 'subject', label: 'Subject', type: 'text', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'totalScore', label: 'Total Score', type: 'number', required: true },
      ],
      columns: [
        { key: 'type', label: 'Type' },
        { key: 'title', label: 'Title' },
        { key: 'class', label: 'Class' },
        { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
      ],
    },
    '/teacher/assessments/enter-scores': { title: 'Enter Scores', kind: 'form', fields: [{ name: 'assessmentId', label: 'Assessment ID', type: 'text', required: true }] },
    '/teacher/assessments/edit-scores': { title: 'Edit Scores', kind: 'detail' },
    '/teacher/assessments/ca': { title: 'Continuous Assessment (CA)', kind: 'list', storageKey: 'teacher:ca' },
    '/teacher/assessments/exam-results': { title: 'Exam Results', kind: 'list', storageKey: 'teacher:exam-results' },

    // Grading & Reports
    '/teacher/grading/gradebook': { title: 'Grade Book', kind: 'detail' },
    '/teacher/grading/result-computation': { title: 'Result Computation', kind: 'detail' },
    '/teacher/grading/performance-analysis': { title: 'Performance Analysis', kind: 'detail' },
    '/teacher/grading/generate-reports': { title: 'Generate Reports', kind: 'form', fields: [{ name: 'format', label: 'Format', type: 'select', required: true, options: [{ value: 'PDF', label: 'PDF' }, { value: 'EXCEL', label: 'Excel' }] }] },
    '/teacher/grading/comments': { title: 'Comment on Student Performance', kind: 'list', storageKey: 'teacher:comments', primaryActionLabel: 'Add Comment', fields: [{ name: 'student', label: 'Student', type: 'text', required: true }, { name: 'comment', label: 'Comment', type: 'textarea', required: true }] },

    // Assignments & Homework
    '/teacher/assignments/create': { title: 'Create Assignment', kind: 'form', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'instructions', label: 'Instructions', type: 'textarea', required: true }, { name: 'dueDate', label: 'Due Date', type: 'date', required: true }] },
    '/teacher/assignments/submissions': { title: 'Assignment Submissions', kind: 'list', storageKey: 'teacher:submissions' },
    '/teacher/assignments/mark-grade': { title: 'Mark / Grade Assignments', kind: 'detail' },
    '/teacher/assignments/feedback': { title: 'Feedback & Remarks', kind: 'list', storageKey: 'teacher:feedback', primaryActionLabel: 'Add Feedback', fields: [{ name: 'student', label: 'Student', type: 'text', required: true }, { name: 'feedback', label: 'Feedback', type: 'textarea', required: true }] },

    // Communication
    '/teacher/communication/announcements': { title: 'Announcements (View / Post)', kind: 'list', storageKey: 'teacher:announcements', primaryActionLabel: 'Post Announcement', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true }] },
    '/teacher/communication/messages': { title: 'Messages', kind: 'detail' },
    '/teacher/communication/class-notices': { title: 'Class Notices', kind: 'list', storageKey: 'teacher:class-notices', primaryActionLabel: 'Post Notice', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true }] },

    // Materials
    '/teacher/materials/upload-notes': { title: 'Upload Notes', kind: 'form', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'link', label: 'Link (optional)', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea' }] },
    '/teacher/materials/upload-resources': { title: 'Upload Resources', kind: 'form', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'type', label: 'Type', type: 'select', required: true, options: [{ value: 'PDF', label: 'PDF' }, { value: 'VIDEO', label: 'Video' }, { value: 'LINK', label: 'Link' }] }, { name: 'url', label: 'URL', type: 'text', required: true }] },
    '/teacher/materials/manage': { title: 'Manage Course Materials', kind: 'list', storageKey: 'teacher:materials' },

    // Schedule
    '/teacher/schedule/school-calendar': { title: 'School Calendar', kind: 'list', storageKey: 'teacher:calendar', primaryActionLabel: 'Add Event', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'date', label: 'Date', type: 'date', required: true }] },
    '/teacher/schedule/events-exams': { title: 'Events & Exams Schedule', kind: 'list', storageKey: 'teacher:events-exams', primaryActionLabel: 'Add Schedule Item', fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'date', label: 'Date', type: 'date', required: true }, { name: 'type', label: 'Type', type: 'select', required: true, options: [{ value: 'EVENT', label: 'Event' }, { value: 'EXAM', label: 'Exam' }] }] },

    // Discipline
    '/teacher/discipline/student-remarks': { title: 'Student Remarks', kind: 'list', storageKey: 'teacher:remarks', primaryActionLabel: 'Add Remark', fields: [{ name: 'student', label: 'Student', type: 'text', required: true }, { name: 'remark', label: 'Remark', type: 'textarea', required: true }] },
    '/teacher/discipline/behavior-records': { title: 'Behavioral Records', kind: 'list', storageKey: 'teacher:behavior', primaryActionLabel: 'Add Record', fields: [{ name: 'student', label: 'Student', type: 'text', required: true }, { name: 'record', label: 'Record', type: 'textarea', required: true }] },
    '/teacher/discipline/recommendations': { title: 'Recommendations', kind: 'list', storageKey: 'teacher:recommendations', primaryActionLabel: 'Add Recommendation', fields: [{ name: 'student', label: 'Student', type: 'text', required: true }, { name: 'recommendation', label: 'Recommendation', type: 'textarea', required: true }] },

    // Settings
    '/teacher/settings/change-password': { title: 'Change Password', kind: 'form', fields: [{ name: 'currentPassword', label: 'Current Password', type: 'text', required: true }, { name: 'newPassword', label: 'New Password', type: 'text', required: true }] },
    '/teacher/settings/logout': { title: 'Logout', kind: 'detail' },
  };

  const normalize = (input: PageDef, path: string): PageDef => {
    // Ensure every list page has an add button + modal fields (admin-style behavior).
    if (input.kind === 'list') {
      const isReadOnlyList =
        path === '/teacher/classes/my-classes' ||
        path === '/teacher/classes/my-subjects' ||
        path === '/teacher/classrooms' ||
        path === '/teacher/subjects';

      const defaultFields: FieldDef[] = [
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title...' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional details...' },
        { name: 'date', label: 'Date', type: 'date' },
      ];

      const fields = input.fields && input.fields.length ? input.fields : defaultFields;
      const primaryActionLabel = input.primaryActionLabel ?? (isReadOnlyList ? undefined : `Add ${input.title}`);
      const storageKey = input.storageKey || `teacher:${path}`;
      const columns = input.columns; // Let the list page derive smart defaults if not provided

      return { ...input, fields, primaryActionLabel, storageKey, columns };
    }
    return input;
  };

  const rawDef =
    defs[pathname] ||
    ({
      title: 'Teacher Page',
      description: `Route: ${pathname}`,
      kind: 'detail',
    } as const);

  const def = normalize(rawDef as PageDef, pathname);

  if (pathname === '/teacher/settings/logout') return <LogoutPage />;

  // Teacher students module (overview/profile/performance)
  if (pathname === '/teacher/students/list') return <TeacherStudentsOverviewPage />;
  if (pathname.startsWith('/teacher/students/profile/')) {
    const id = pathname.replace('/teacher/students/profile/', '').trim();
    return <TeacherStudentProfilePage studentId={id} />;
  }
  if (pathname.startsWith('/teacher/students/performance/')) {
    const id = pathname.replace('/teacher/students/performance/', '').trim();
    return <TeacherStudentPerformancePage studentId={id} />;
  }
  if (pathname.startsWith('/teacher/assessments/exam-results')) {
    return <TeacherExamResultsPage />;
  }

  if (def.kind === 'list') return <AdminStyleListPage def={def} />;
  if (def.kind === 'form') return <AdminStyleFormPage def={def} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{def.title}</h1>
          <p className="text-gray-600 mt-1">
            {def.description || 'This page is ready for backend integration.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-700">
          Route: <code>{pathname}</code>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          (Implemented with the same layout blocks as admin pages: header + card + table/modals for list pages.)
        </p>
      </div>
    </div>
  );
}

