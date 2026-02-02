'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ExamResult, Exam, Student, UserRole } from '../../../types';
import { ICONS } from '../../../constants';
import { useAuth } from '../../../lib/auth-context';

interface ExamResultFormData {
  examId: string;
  studentId: string;
  score: number;
  grade: string;
  remarks: string;
}

interface BulkResultEntry {
  studentId: string;
  score: number;
  grade: string;
  remarks: string;
}

export default function ExamResultsPage() {
  const { user } = useAuth();
  const isParent = user?.role === UserRole.PARENT;
  const isStudent = user?.role === UserRole.STUDENT;
  const canApprove = user?.role === UserRole.HEAD_MASTER;
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.HEAD_MASTER || user?.role === UserRole.TEACHER;
  const [results, setResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');

  // Modal states
  const [showEnterResults, setShowEnterResults] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const IMPORTED_RESULTS_KEY = 'importedExamResults';

  const loadImportedResults = () => {
    try {
      const raw = localStorage.getItem(IMPORTED_RESULTS_KEY);
      return raw ? (JSON.parse(raw) as ExamResult[]) : [];
    } catch {
      return [];
    }
  };

  const persistImportedResults = (items: ExamResult[]) => {
    try {
      const imported = items.filter(r => String(r.id).startsWith('import_'));
      localStorage.setItem(IMPORTED_RESULTS_KEY, JSON.stringify(imported));
    } catch {
      // ignore storage errors
    }
  };

  // Bulk entry state
  const [selectedExamForEntry, setSelectedExamForEntry] = useState<string>('');
  const [bulkResults, setBulkResults] = useState<Record<string, BulkResultEntry>>({});

  // Form state
  const [formData, setFormData] = useState<ExamResultFormData>({
    examId: '',
    studentId: '',
    score: 0,
    grade: '',
    remarks: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<ExamResultFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
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

    const mockResults: ExamResult[] = [
      {
        id: 'r001',
        examId: 'e001',
        exam: mockExams[0],
        studentId: 's001',
        student: mockStudents[0],
        score: 85,
        grade: 'A',
        remarks: 'Excellent performance',
        enteredById: 'u001',
        isPublished: true,
        createdAt: '2024-02-16T00:00:00Z',
        updatedAt: '2024-02-16T00:00:00Z',
      },
      {
        id: 'r002',
        examId: 'e001',
        exam: mockExams[0],
        studentId: 's002',
        student: mockStudents[1],
        score: 92,
        grade: 'A+',
        remarks: 'Outstanding work',
        enteredById: 'u001',
        isPublished: true,
        createdAt: '2024-02-16T00:00:00Z',
        updatedAt: '2024-02-16T00:00:00Z',
      },
    ];

    // Mock children for parent
    const mockChildren: Student[] = isParent ? [
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
    ] : [];

    // Simulate loading delay
    setTimeout(() => {
      setStudents(mockStudents);
      setExams(mockExams);
      if (isParent) {
        setChildren(mockChildren);
        setSelectedChildId(mockChildren[0]?.id || '');
      }
      const stored = loadImportedResults();
      setResults([...mockResults, ...stored]);
      setLoading(false);
    }, 200);
  }, [isParent]);

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      // Filter by child for parents
      if (isParent && selectedChildId && result.studentId !== selectedChildId) {
        return false;
      }
      // Filter by student for students
      if (isStudent && user?.studentId && result.studentId !== user.studentId) {
        return false;
      }
      
      const matchesSearch = `${result.student?.firstName} ${result.student?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.student?.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.exam?.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExam = selectedExam === 'ALL' || result.examId === selectedExam;
      return matchesSearch && matchesExam;
    });
  }, [results, isParent, selectedChildId, isStudent, user?.studentId, searchTerm, selectedExam]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getScorePercentage = (score: number, total: number) => {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  // Form validation
  const validateForm = (data: ExamResultFormData): Partial<ExamResultFormData> => {
    const errors: Partial<ExamResultFormData> = {};

    if (!data.examId) errors.examId = 'Exam is required';
    if (!data.studentId) errors.studentId = 'Student is required';
    if (data.score < 0) errors.score = 'Score cannot be negative';
    const selectedExamObj = exams.find(e => e.id === data.examId);
    if (selectedExamObj && data.score > selectedExamObj.totalScore) {
      errors.score = `Score cannot exceed ${selectedExamObj.totalScore}`;
    }
    if (!data.grade.trim()) errors.grade = 'Grade is required';

    return errors;
  };

  // Grade calculation helper
  const calculateGrade = (score: number, totalScore: number): string => {
    const percentage = getScorePercentage(score, totalScore);
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  // Modal handlers
  const handleEnterResults = () => {
    setBulkResults({});
    setSelectedExamForEntry('');
    setShowEnterResults(true);
  };

  const handleEditResult = (result: ExamResult) => {
    setFormData({
      examId: result.examId,
      studentId: result.studentId,
      score: result.score,
      grade: result.grade,
      remarks: result.remarks || '',
    });
    setFormErrors({});
    setSelectedResult(result);
    setShowEditModal(true);
  };

  const handleDeleteResult = (result: ExamResult) => {
    setSelectedResult(result);
    setShowDeleteModal(true);
  };

  const handleViewRemarks = (result: ExamResult) => {
    setSelectedResult(result);
    setShowRemarksModal(true);
  };

  // Bulk entry handlers
  const handleExamSelection = (examId: string) => {
    setSelectedExamForEntry(examId);
    // Initialize bulk results for all students in the selected exam's classroom
    const selectedExamObj = exams.find(e => e.id === examId);
    if (selectedExamObj) {
      const classroomStudents = students.filter(s => s.classroomId === selectedExamObj.classroomId);
      const initialBulkResults: Record<string, BulkResultEntry> = {};
      classroomStudents.forEach(student => {
        initialBulkResults[student.id] = {
          studentId: student.id,
          score: 0,
          grade: '',
          remarks: '',
        };
      });
      setBulkResults(initialBulkResults);
    }
  };

  const handleBulkScoreChange = (studentId: string, score: number) => {
    const selectedExamObj = exams.find(e => e.id === selectedExamForEntry);
    const grade = selectedExamObj ? calculateGrade(score, selectedExamObj.totalScore) : '';

    setBulkResults(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score,
        grade,
      },
    }));
  };

  const handleBulkRemarksChange = (studentId: string, remarks: string) => {
    setBulkResults(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedExamObj = exams.find(e => e.id === formData.examId);
      const selectedStudent = students.find(s => s.id === formData.studentId);

      if (selectedResult) {
        // Update existing result
        const updatedResult: ExamResult = {
          ...selectedResult,
          score: formData.score,
          grade: formData.grade,
          remarks: formData.remarks,
          updatedAt: new Date().toISOString(),
        };
        setResults(prev => {
          const next = prev.map(r => (r.id === selectedResult.id ? updatedResult : r));
          persistImportedResults(next);
          return next;
        });
        setShowEditModal(false);
      } else {
        // Add new result
        const newResult: ExamResult = {
          id: String(results.length + 1),
          examId: formData.examId,
          exam: selectedExamObj,
          studentId: formData.studentId,
          student: selectedStudent,
          score: formData.score,
          grade: formData.grade,
          remarks: formData.remarks,
          enteredById: 'current-user', // Would be current user ID
          isPublished: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setResults(prev => {
          const next = [...prev, newResult];
          persistImportedResults(next);
          return next;
        });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error saving exam result:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSaveResults = async () => {
    if (!selectedExamForEntry) return;

    setIsSubmitting(true);
    try {
      const selectedExamObj = exams.find(e => e.id === selectedExamForEntry);
      const newResults: ExamResult[] = Object.values(bulkResults)
        .filter(result => result.score > 0) // Only save results with scores
        .map(result => {
          const student = students.find(s => s.id === result.studentId);
          return {
            id: `result_${selectedExamForEntry}_${result.studentId}`,
            examId: selectedExamForEntry,
            exam: selectedExamObj,
            studentId: result.studentId,
            student,
            score: result.score,
            grade: result.grade,
            remarks: result.remarks,
            enteredById: 'current-user',
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      // Remove existing results for this exam and add new ones
      setResults(prev => {
        const filtered = prev.filter(r => r.examId !== selectedExamForEntry);
        const next = [...filtered, ...newResults];
        persistImportedResults(next);
        return next;
      });

      setShowEnterResults(false);
      setBulkResults({});
    } catch (error) {
      console.error('Error saving bulk results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResult) return;

    setIsSubmitting(true);
    try {
      setResults(prev => {
        const next = prev.filter(r => r.id !== selectedResult.id);
        persistImportedResults(next);
        return next;
      });
      setShowDeleteModal(false);
      setSelectedResult(null);
    } catch (error) {
      console.error('Error deleting exam result:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishResult = async (result: ExamResult) => {
    try {
      const updatedResult: ExamResult = {
        ...result,
        isPublished: true,
        updatedAt: new Date().toISOString(),
      };
      setResults(prev => {
        const next = prev.map(r => (r.id === result.id ? updatedResult : r));
        persistImportedResults(next);
        return next;
      });
    } catch (error) {
      console.error('Error publishing result:', error);
    }
  };

  const stats = useMemo(() => {
    const all = filteredResults;
    const published = all.filter(r => r.isPublished);
    const average = published.length > 0
      ? Math.round(published.reduce((sum, r) => sum + getScorePercentage(r.score, r.exam?.totalScore || 0), 0) / published.length)
      : 0;
    return {
      total: all.length,
      published: published.length,
      average,
    };
  }, [filteredResults]);

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
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isParent ? 'Academic Progress' : isStudent ? 'My Results' : 'Exam Results'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isParent ? 'View your child\'s academic performance and exam results' :
             isStudent ? 'View your exam results and academic performance' :
             'Headmaster approval for submitted results'}
          </p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnterResults}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {ICONS.Add}
              Enter Results
            </button>
          </div>
        )}
      </div>

      {/* Child Selection for Parents */}
      {isParent && children.length > 0 && (
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

      {/* Statistics for Parents/Students */}
      {(isParent || isStudent) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <div className="text-sm text-slate-500">Total Results</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
            <div className="text-sm text-green-700">Published</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{stats.published}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
            <div className="text-sm text-blue-700">Average Score</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{stats.average}%</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by student name, admission number, or exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
            <select
              value={selectedExam}
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
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export Results
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Exam Results ({filteredResults.length})
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={result.student?.profileImage || `https://picsum.photos/seed/${result.studentId}/40/40`}
                          alt={`${result.student?.firstName} ${result.student?.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {result.student?.firstName} {result.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.student?.admissionNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.exam?.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.exam?.term} • {new Date(result.exam?.date || '').toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${getScorePercentage(result.score, result.exam?.totalScore || 0)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {result.score}/{result.exam?.totalScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getScorePercentage(result.score, result.exam?.totalScore || 0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canEdit ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditResult(result)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        {!result.isPublished && canApprove && (
                          <button
                            onClick={() => handlePublishResult(result)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                        )}
                        {result.remarks && (
                          <button
                            onClick={() => handleViewRemarks(result)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Remarks
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteResult(result)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {result.remarks && (
                          <button
                            onClick={() => handleViewRemarks(result)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Remarks
                          </button>
                        )}
                        {!result.remarks && (
                          <span className="text-gray-400 text-xs">No remarks</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No exam results found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria or enter new results</p>
            </div>
          </div>
        )}
      </div>

      {/* Enter Results Modal */}
      {showEnterResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter Exam Results</h2>
              <button
                onClick={() => setShowEnterResults(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
              <select
                value={selectedExamForEntry}
                onChange={(e) => handleExamSelection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select an exam...</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} - {exam.term} ({new Date(exam.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedExamForEntry && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Student Results</h3>
                  <div className="text-sm text-gray-600">
                    Total Score: {exams.find(e => e.id === selectedExamForEntry)?.totalScore} marks
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {students
                    .filter(student => student.classroomId === exams.find(e => e.id === selectedExamForEntry)?.classroomId)
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
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="Score"
                            min="0"
                            max={exams.find(e => e.id === selectedExamForEntry)?.totalScore || 100}
                            value={bulkResults[student.id]?.score || ''}
                            onChange={(e) => handleBulkScoreChange(student.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-gray-500">
                            / {exams.find(e => e.id === selectedExamForEntry)?.totalScore}
                          </span>
                          <input
                            type="text"
                            placeholder="Grade"
                            maxLength={3}
                            value={bulkResults[student.id]?.grade || ''}
                            readOnly
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center uppercase bg-gray-50"
                          />
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={bulkResults[student.id]?.remarks || ''}
                            onChange={(e) => handleBulkRemarksChange(student.id, e.target.value)}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEnterResults(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkSaveResults}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Results'}
                  </button>
                </div>
              </div>
            )}

            {!selectedExamForEntry && (
              <div className="text-center py-12">
                <p className="text-gray-500">Select an exam to start entering results</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Result Modal */}
      {showEditModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Exam Result</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedResult.student?.firstName} {selectedResult.student?.lastName}</p>
              <p className="text-sm text-gray-600">{selectedResult.student?.admissionNumber} • {selectedResult.exam?.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score *
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                  min="0"
                  max={selectedResult.exam?.totalScore || 100}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.score ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.score && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.score}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Max score: {selectedResult.exam?.totalScore} • Grade: {calculateGrade(formData.score, selectedResult.exam?.totalScore || 100)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value.toUpperCase() })}
                  maxLength={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.grade && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Optional remarks about the student's performance..."
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
                  onClick={() => {
                    const grade = calculateGrade(formData.score, selectedResult.exam?.totalScore || 100);
                    setFormData(prev => ({ ...prev, grade }));
                    handleSubmit({ preventDefault: () => {} } as any);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Exam Result</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this exam result?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedResult.student?.firstName} {selectedResult.student?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedResult.exam?.title} • Score: {selectedResult.score}/{selectedResult.exam?.totalScore}
                </p>
                <p className="text-sm text-gray-600">Grade: {selectedResult.grade}</p>
              </div>
              <p className="text-red-600 text-sm mt-3">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Result'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remarks Modal */}
      {showRemarksModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Result Remarks</h2>
              <button
                onClick={() => setShowRemarksModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="font-medium text-gray-900">
                  {selectedResult.student?.firstName} {selectedResult.student?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedResult.exam?.title} • Score: {selectedResult.score}/{selectedResult.exam?.totalScore} ({getScorePercentage(selectedResult.score, selectedResult.exam?.totalScore || 0)}%)
                </p>
                <p className="text-sm text-gray-600">Grade: {selectedResult.grade}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Remarks:</h3>
                <div className="bg-gray-50 p-3 rounded-md min-h-[80px]">
                  <p className="text-sm text-gray-700">
                    {selectedResult.remarks || 'No remarks provided.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowRemarksModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}