'use client';
import React, { useState, useEffect } from 'react';
import { Exam, ExamStatus, Subject, Classroom } from '../../../types';
import { ICONS } from '../../../constants';

interface ExamFormData {
  title: string;
  subjectId: string;
  classroomId: string;
  term: string;
  date: string;
  startTime: string;
  duration: number;
  totalScore: number;
  venue: string;
  instructions: string;
}

export default function ExamsManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | 'ALL'>('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Form state
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    subjectId: '',
    classroomId: '',
    term: 'Term 1',
    date: '',
    startTime: '09:00',
    duration: 120,
    totalScore: 100,
    venue: '',
    instructions: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<ExamFormData>>({});
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

    const mockSubjects: Subject[] = [
      {
        id: 's001',
        code: 'MATH101',
        name: 'Mathematics',
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        teachers: [],
        totalTopics: 24,
        completedTopics: 12,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 's002',
        code: 'PHY101',
        name: 'Physics',
        classroomId: 'c001',
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
        id: 'e001',
        title: 'Mathematics Mid-Term Exam',
        subjectId: 's001',
        subject: mockSubjects[0],
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        term: 'Term 1',
        date: '2024-02-15',
        startTime: '09:00',
        duration: 120,
        totalScore: 100,
        venue: 'Room 101',
        instructions: 'Bring calculator and ruler',
        status: ExamStatus.UPCOMING,
        createdById: 'u001',
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 'e002',
        title: 'Physics Practical Exam',
        subjectId: 's002',
        subject: mockSubjects[1],
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        term: 'Term 1',
        date: '2024-02-20',
        startTime: '10:00',
        duration: 180,
        totalScore: 50,
        venue: 'Science Lab',
        instructions: 'Wear lab coat and safety goggles',
        status: ExamStatus.UPCOMING,
        createdById: 'u001',
        isActive: true,
        createdAt: '2024-01-20T00:00:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setClassrooms(mockClassrooms);
      setSubjects(mockSubjects);
      setExams(mockExams);
      setLoading(false);
    }, 200);
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || exam.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Form validation
  const validateForm = (data: ExamFormData): Partial<ExamFormData> => {
    const errors: Partial<ExamFormData> = {};

    if (!data.title.trim()) errors.title = 'Exam title is required';
    if (!data.subjectId) errors.subjectId = 'Subject is required';
    if (!data.classroomId) errors.classroomId = 'Classroom is required';
    if (!data.date) errors.date = 'Date is required';
    if (!data.startTime) errors.startTime = 'Start time is required';
    if (data.duration <= 0) errors.duration = 'Duration must be greater than 0';
    if (data.totalScore <= 0) errors.totalScore = 'Total score must be greater than 0';
    if (!data.venue.trim()) errors.venue = 'Venue is required';

    return errors;
  };

  // Modal handlers
  const handleAddExam = () => {
    setFormData({
      title: '',
      subjectId: '',
      classroomId: '',
      term: 'Term 1',
      date: '',
      startTime: '09:00',
      duration: 120,
      totalScore: 100,
      venue: '',
      instructions: '',
    });
    setFormErrors({});
    setSelectedExam(null);
    setShowCreateModal(true);
  };

  const handleEditExam = (exam: Exam) => {
    setFormData({
      title: exam.title,
      subjectId: exam.subjectId,
      classroomId: exam.classroomId,
      term: exam.term,
      date: exam.date,
      startTime: exam.startTime,
      duration: exam.duration,
      totalScore: exam.totalScore,
      venue: exam.venue,
      instructions: exam.instructions || '',
    });
    setFormErrors({});
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const handleDeleteExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDeleteModal(true);
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
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      const selectedClassroom = classrooms.find(c => c.id === formData.classroomId);

      if (selectedExam) {
        // Update existing exam
        const updatedExam: Exam = {
          ...selectedExam,
          title: formData.title,
          subjectId: formData.subjectId,
          subject: selectedSubject,
          classroomId: formData.classroomId,
          classroom: selectedClassroom,
          term: formData.term,
          date: formData.date,
          startTime: formData.startTime,
          duration: formData.duration,
          totalScore: formData.totalScore,
          venue: formData.venue,
          instructions: formData.instructions,
          updatedAt: new Date().toISOString(),
        };
        setExams(prev => prev.map(e => e.id === selectedExam.id ? updatedExam : e));
        setShowEditModal(false);
      } else {
        // Add new exam
        const newExam: Exam = {
          id: String(exams.length + 1),
          title: formData.title,
          subjectId: formData.subjectId,
          subject: selectedSubject,
          classroomId: formData.classroomId,
          classroom: selectedClassroom,
          term: formData.term,
          date: formData.date,
          startTime: formData.startTime,
          duration: formData.duration,
          totalScore: formData.totalScore,
          venue: formData.venue,
          instructions: formData.instructions,
          status: ExamStatus.UPCOMING,
          createdById: 'current-user', // Would be current user ID
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setExams(prev => [...prev, newExam]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExam) return;

    setIsSubmitting(true);
    try {
      setExams(prev => prev.filter(e => e.id !== selectedExam.id));
      setShowDeleteModal(false);
      setSelectedExam(null);
    } catch (error) {
      console.error('Error deleting exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (exam: Exam, newStatus: boolean) => {
    try {
      const updatedExam: Exam = {
        ...exam,
        isActive: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setExams(prev => prev.map(e => e.id === exam.id ? updatedExam : e));
    } catch (error) {
      console.error('Error updating exam status:', error);
    }
  };

  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.UPCOMING: return 'bg-blue-100 text-blue-800';
      case ExamStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800';
      case ExamStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case ExamStatus.GRADED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.UPCOMING: return ICONS.Calendar;
      case ExamStatus.IN_PROGRESS: return ICONS.Clock;
      case ExamStatus.COMPLETED: return ICONS.Check;
      case ExamStatus.GRADED: return ICONS.Star;
      default: return null;
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
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Create and manage examinations for all subjects</p>
        </div>
        <button
          onClick={handleAddExam}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Create Exam
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by exam title, subject, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ExamStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value={ExamStatus.UPCOMING}>Upcoming</option>
              <option value={ExamStatus.IN_PROGRESS}>In Progress</option>
              <option value={ExamStatus.COMPLETED}>Completed</option>
              <option value={ExamStatus.GRADED}>Graded</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Examinations ({filteredExams.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject & Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
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
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.term} • Total: {exam.totalScore} marks
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Venue: {exam.venue}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {exam.subject?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exam.classroom?.name} ({exam.classroom?.academicYear})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {exam.startTime} • {exam.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      <span className="mr-1">{getStatusIcon(exam.status)}</span>
                      {exam.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        View Results
                      </button>
                      <button
                        onClick={() => handleStatusChange(exam, !exam.isActive)}
                        className={exam.isActive
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                        }
                      >
                        {exam.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No examinations found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria or create a new examination</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Examination</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mathematics Mid-Term Exam"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.subjectId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                  {formErrors.subjectId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subjectId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classroom *
                  </label>
                  <select
                    value={formData.classroomId}
                    onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.classroomId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select classroom...</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name} ({classroom.academicYear})
                      </option>
                    ))}
                  </select>
                  {formErrors.classroomId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.classroomId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.startTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.startTime && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="120"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.duration && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Score *
                  </label>
                  <input
                    type="number"
                    value={formData.totalScore}
                    onChange={(e) => setFormData({ ...formData, totalScore: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.totalScore ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.totalScore && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.totalScore}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Room 101"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.venue && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.venue}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Exam instructions and special notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Examination</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mathematics Mid-Term Exam"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.subjectId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                  {formErrors.subjectId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subjectId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classroom *
                  </label>
                  <select
                    value={formData.classroomId}
                    onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.classroomId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select classroom...</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name} ({classroom.academicYear})
                      </option>
                    ))}
                  </select>
                  {formErrors.classroomId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.classroomId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.startTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.startTime && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="120"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.duration && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Score *
                  </label>
                  <input
                    type="number"
                    value={formData.totalScore}
                    onChange={(e) => setFormData({ ...formData, totalScore: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.totalScore ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.totalScore && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.totalScore}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Room 101"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.venue && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.venue}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Exam instructions and special notes..."
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
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Examination</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this examination?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedExam.title}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedExam.subject?.name} • {selectedExam.classroom?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedExam.date).toLocaleDateString()} • {selectedExam.startTime}
                </p>
              </div>
              <p className="text-red-600 text-sm mt-3">
                This action cannot be undone and will affect all enrolled students.
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
                {isSubmitting ? 'Deleting...' : 'Delete Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}