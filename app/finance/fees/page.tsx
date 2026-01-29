'use client';
import React, { useState, useEffect } from 'react';
import { FeeStructure, Classroom } from '../../../types';
import { ICONS } from '../../../constants';

interface FeeStructureFormData {
  classroomId: string;
  term: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  labFee: number;
  libraryFee: number;
  sportsFee: number;
  transportationFee: number;
  otherFees: number;
  dueDate: string;
  description: string;
}

export default function FeeStructurePage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);

  // Form state
  const [formData, setFormData] = useState<FeeStructureFormData>({
    classroomId: '',
    term: 'Term 1',
    academicYear: '2024-2025',
    tuitionFee: 0,
    examFee: 0,
    labFee: 0,
    libraryFee: 0,
    sportsFee: 0,
    transportationFee: 0,
    otherFees: 0,
    dueDate: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<FeeStructureFormData>>({});
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
      {
        id: 'c002',
        name: 'Grade 11B',
        academicYear: '2024-2025',
        capacity: 35,
        currentStudents: 32,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        subjects: [],
        teachers: [],
      },
    ];

    const mockFeeStructures: FeeStructure[] = [
      {
        id: 'fs001',
        classroomId: 'c001',
        classroom: mockClassrooms[0],
        term: 'Term 1',
        academicYear: '2024-2025',
        tuitionFee: 1500,
        examFee: 200,
        labFee: 100,
        libraryFee: 50,
        transportFee: 300,
        totalAmount: 2150,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'fs002',
        classroomId: 'c002',
        classroom: mockClassrooms[1],
        term: 'Term 1',
        academicYear: '2024-2025',
        tuitionFee: 1600,
        examFee: 250,
        labFee: 120,
        libraryFee: 60,
        transportFee: 350,
        totalAmount: 2380,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setClassrooms(mockClassrooms);
      setFeeStructures(mockFeeStructures);
      setLoading(false);
    }, 200);
  }, []);

  const filteredFeeStructures = feeStructures.filter(structure => {
    const matchesSearch = structure.classroom?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.academicYear.includes(searchTerm);
    const matchesYear = selectedAcademicYear === 'ALL' || structure.academicYear === selectedAcademicYear;
    return matchesSearch && matchesYear;
  });

  // Calculate total fee
  const calculateTotalFee = (structure: FeeStructureFormData) => {
    return structure.tuitionFee + structure.examFee + structure.labFee +
           structure.libraryFee + structure.sportsFee + structure.transportationFee + structure.otherFees;
  };

  // Form validation
  const validateForm = (data: FeeStructureFormData): Partial<FeeStructureFormData> => {
    const errors: Partial<FeeStructureFormData> = {};

    if (!data.classroomId) errors.classroomId = 'Classroom is required';
    if (!data.term) errors.term = 'Term is required';
    if (!data.academicYear) errors.academicYear = 'Academic year is required';
    if (data.tuitionFee < 0) errors.tuitionFee = 'Tuition fee cannot be negative';
    if (data.examFee < 0) errors.examFee = 'Exam fee cannot be negative';
    if (data.labFee < 0) errors.labFee = 'Lab fee cannot be negative';
    if (data.libraryFee < 0) errors.libraryFee = 'Library fee cannot be negative';
    if (data.sportsFee < 0) errors.sportsFee = 'Sports fee cannot be negative';
    if (data.transportationFee < 0) errors.transportationFee = 'Transportation fee cannot be negative';
    if (data.otherFees < 0) errors.otherFees = 'Other fees cannot be negative';
    if (!data.dueDate) errors.dueDate = 'Due date is required';

    return errors;
  };

  // Modal handlers
  const handleAddFeeStructure = () => {
    setFormData({
      classroomId: '',
      term: 'Term 1',
      academicYear: '2024-2025',
      tuitionFee: 0,
      examFee: 0,
      labFee: 0,
      libraryFee: 0,
      sportsFee: 0,
      transportationFee: 0,
      otherFees: 0,
      dueDate: '',
      description: '',
    });
    setFormErrors({});
    setSelectedFeeStructure(null);
    setShowCreateModal(true);
  };

  const handleEditFeeStructure = (feeStructure: FeeStructure) => {
    setFormData({
      classroomId: feeStructure.classroomId,
      term: feeStructure.term,
      academicYear: feeStructure.academicYear,
      tuitionFee: feeStructure.tuitionFee,
      examFee: feeStructure.examFee,
      labFee: feeStructure.labFee || 0,
      libraryFee: feeStructure.libraryFee || 0,
      sportsFee: feeStructure.sportsFee || 0,
      transportationFee: feeStructure.transportationFee || 0,
      otherFees: feeStructure.otherFees || 0,
      dueDate: feeStructure.dueDate,
      description: feeStructure.description || '',
    });
    setFormErrors({});
    setSelectedFeeStructure(feeStructure);
    setShowEditModal(true);
  };

  const handleDeleteFeeStructure = (feeStructure: FeeStructure) => {
    setSelectedFeeStructure(feeStructure);
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
      const selectedClassroom = classrooms.find(c => c.id === formData.classroomId);
      const totalFee = calculateTotalFee(formData);

      if (selectedFeeStructure) {
        // Update existing fee structure
        const updatedFeeStructure: FeeStructure = {
          ...selectedFeeStructure,
          classroomId: formData.classroomId,
          classroom: selectedClassroom,
          term: formData.term,
          academicYear: formData.academicYear,
          tuitionFee: formData.tuitionFee,
          examFee: formData.examFee,
          labFee: formData.labFee,
          libraryFee: formData.libraryFee,
          sportsFee: formData.sportsFee,
          transportationFee: formData.transportationFee,
          otherFees: formData.otherFees,
          totalFee,
          dueDate: formData.dueDate,
          description: formData.description,
          updatedAt: new Date().toISOString(),
        };
        setFeeStructures(prev => prev.map(f => f.id === selectedFeeStructure.id ? updatedFeeStructure : f));
        setShowEditModal(false);
      } else {
        // Add new fee structure
        const newFeeStructure: FeeStructure = {
          id: String(feeStructures.length + 1),
          classroomId: formData.classroomId,
          classroom: selectedClassroom,
          term: formData.term,
          academicYear: formData.academicYear,
          tuitionFee: formData.tuitionFee,
          examFee: formData.examFee,
          labFee: formData.labFee,
          libraryFee: formData.libraryFee,
          sportsFee: formData.sportsFee,
          transportationFee: formData.transportationFee,
          otherFees: formData.otherFees,
          totalFee,
          dueDate: formData.dueDate,
          description: formData.description,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFeeStructures(prev => [...prev, newFeeStructure]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error saving fee structure:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeeStructure) return;

    setIsSubmitting(true);
    try {
      setFeeStructures(prev => prev.filter(f => f.id !== selectedFeeStructure.id));
      setShowDeleteModal(false);
      setSelectedFeeStructure(null);
    } catch (error) {
      console.error('Error deleting fee structure:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (feeStructure: FeeStructure, newStatus: boolean) => {
    try {
      const updatedFeeStructure: FeeStructure = {
        ...feeStructure,
        isActive: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setFeeStructures(prev => prev.map(f => f.id === feeStructure.id ? updatedFeeStructure : f));
    } catch (error) {
      console.error('Error updating fee structure status:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Fee Structure Management</h1>
          <p className="text-gray-600 mt-1">Define and manage fee structures for each class and term</p>
        </div>
        <button
          onClick={handleAddFeeStructure}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Add Fee Structure
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by classroom, term, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Years</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export Fee Report
            </button>
          </div>
        </div>
      </div>

      {/* Fee Structures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFeeStructures.map((structure) => (
          <div key={structure.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {structure.classroom?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {structure.term} - {structure.academicYear}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  structure.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {structure.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tuition Fee</span>
                  <span className="font-semibold">GH₵ {structure.tuitionFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exam Fee</span>
                  <span className="font-semibold">GH₵ {structure.examFee}</span>
                </div>
                {structure.labFee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lab Fee</span>
                    <span className="font-semibold">GH₵ {structure.labFee}</span>
                  </div>
                )}
                {structure.libraryFee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Library Fee</span>
                    <span className="font-semibold">GH₵ {structure.libraryFee}</span>
                  </div>
                )}
                {structure.transportFee && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Transport Fee</span>
                    <span className="font-semibold">GH₵ {structure.transportFee}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">GH₵ {structure.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => handleEditFeeStructure(structure)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                  View Payments
                </button>
                <button
                  onClick={() => handleDeleteFeeStructure(structure)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFeeStructures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg">No fee structures found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria or create a new fee structure</p>
          </div>
        </div>
      )}

      {/* Add Fee Structure Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Fee Structure</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Fee Components (GH₵)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tuition Fee *
                    </label>
                    <input
                      type="number"
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData({ ...formData, tuitionFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.tuitionFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.tuitionFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.tuitionFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Fee
                    </label>
                    <input
                      type="number"
                      value={formData.examFee}
                      onChange={(e) => setFormData({ ...formData, examFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.examFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.examFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.examFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Fee
                    </label>
                    <input
                      type="number"
                      value={formData.labFee}
                      onChange={(e) => setFormData({ ...formData, labFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.labFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.labFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.labFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Library Fee
                    </label>
                    <input
                      type="number"
                      value={formData.libraryFee}
                      onChange={(e) => setFormData({ ...formData, libraryFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.libraryFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.libraryFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.libraryFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sports Fee
                    </label>
                    <input
                      type="number"
                      value={formData.sportsFee}
                      onChange={(e) => setFormData({ ...formData, sportsFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.sportsFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.sportsFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.sportsFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transportation Fee
                    </label>
                    <input
                      type="number"
                      value={formData.transportationFee}
                      onChange={(e) => setFormData({ ...formData, transportationFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.transportationFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.transportationFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.transportationFee}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">
                      GH₵ {calculateTotalFee(formData).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes about this fee structure..."
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
                  {isSubmitting ? 'Creating...' : 'Create Fee Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fee Structure Modal */}
      {showEditModal && selectedFeeStructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Fee Structure</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {selectedFeeStructure.classroom?.name} • {selectedFeeStructure.term} • {selectedFeeStructure.academicYear}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Fee Components (GH₵)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tuition Fee *
                    </label>
                    <input
                      type="number"
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData({ ...formData, tuitionFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.tuitionFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.tuitionFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.tuitionFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Fee
                    </label>
                    <input
                      type="number"
                      value={formData.examFee}
                      onChange={(e) => setFormData({ ...formData, examFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.examFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.examFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.examFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Fee
                    </label>
                    <input
                      type="number"
                      value={formData.labFee}
                      onChange={(e) => setFormData({ ...formData, labFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.labFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.labFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.labFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Library Fee
                    </label>
                    <input
                      type="number"
                      value={formData.libraryFee}
                      onChange={(e) => setFormData({ ...formData, libraryFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.libraryFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.libraryFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.libraryFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sports Fee
                    </label>
                    <input
                      type="number"
                      value={formData.sportsFee}
                      onChange={(e) => setFormData({ ...formData, sportsFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.sportsFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.sportsFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.sportsFee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transportation Fee
                    </label>
                    <input
                      type="number"
                      value={formData.transportationFee}
                      onChange={(e) => setFormData({ ...formData, transportationFee: parseInt(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.transportationFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.transportationFee && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.transportationFee}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">
                      GH₵ {calculateTotalFee(formData).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes about this fee structure..."
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
                  {isSubmitting ? 'Updating...' : 'Update Fee Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFeeStructure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Fee Structure</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this fee structure?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedFeeStructure.classroom?.name} • {selectedFeeStructure.term} • {selectedFeeStructure.academicYear}
                </p>
                <p className="text-sm text-gray-600">
                  Total Amount: GH₵ {selectedFeeStructure.totalAmount}
                </p>
                <p className="text-sm text-gray-600">
                  Due Date: {new Date(selectedFeeStructure.dueDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-red-600 text-sm mt-3">
                This action cannot be undone and will affect all students in this classroom.
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
                {isSubmitting ? 'Deleting...' : 'Delete Fee Structure'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}