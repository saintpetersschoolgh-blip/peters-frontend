'use client';
import React, { useState, useEffect } from 'react';
import { FeePayment, PaymentStatus, Student } from '../../../types';
import { ICONS } from '../../../constants';

interface PaymentFormData {
  studentId: string;
  amount: number;
  paymentMethod: FeePayment['paymentMethod'];
  transactionId: string;
  notes: string;
  paymentDate: string;
  status: PaymentStatus;
}

export default function FeePaymentsPage() {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'ALL'>('ALL');

  // Modal states
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);

  // Form state
  const [formData, setFormData] = useState<PaymentFormData>({
    studentId: '',
    amount: 0,
    paymentMethod: 'CASH',
    transactionId: '',
    notes: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: PaymentStatus.PAID,
  });

  const [formErrors, setFormErrors] = useState<Partial<PaymentFormData>>({});
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

    const mockPayments: FeePayment[] = [
      {
        id: 'p001',
        studentId: 's001',
        student: mockStudents[0],
        feeStructureId: 'fs001',
        amount: 1500,
        paymentDate: '2024-01-15',
        paymentMethod: 'BANK_TRANSFER',
        transactionId: 'TXN001',
        remarks: 'Term 1 Tuition Fee',
        status: PaymentStatus.PAID,
        receivedById: 'u001',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'p002',
        studentId: 's002',
        student: mockStudents[1],
        feeStructureId: 'fs001',
        amount: 800,
        paymentDate: '2024-01-20',
        paymentMethod: 'CASH',
        remarks: 'Partial payment - Term 1',
        status: PaymentStatus.PENDING,
        receivedById: 'u001',
        createdAt: '2024-01-20T14:30:00Z',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setStudents(mockStudents);
      setPayments(mockPayments);
      setLoading(false);
    }, 200);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = `${payment.student?.firstName} ${payment.student?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.student?.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Form validation
  const validateForm = (data: PaymentFormData): Partial<PaymentFormData> => {
    const errors: Partial<PaymentFormData> = {};

    if (!data.studentId) errors.studentId = 'Student is required';
    if (data.amount <= 0) errors.amount = 'Amount must be greater than 0';
    if (!data.paymentMethod.trim()) errors.paymentMethod = 'Payment method is required';
    if (!data.paymentDate) errors.paymentDate = 'Payment date is required';

    return errors;
  };

  // Modal handlers
  const handleRecordPayment = () => {
    setFormData({
      studentId: '',
      amount: 0,
      paymentMethod: 'CASH',
      transactionId: '',
      notes: '',
      paymentDate: new Date().toISOString().split('T')[0],
      status: PaymentStatus.PAID,
    });
    setFormErrors({});
    setSelectedPayment(null);
    setShowRecordPayment(true);
  };

  const handleEditPayment = (payment: FeePayment) => {
    setFormData({
      studentId: payment.studentId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || '',
      notes: payment.notes || payment.remarks || '',
      paymentDate: payment.paymentDate,
      status: payment.status || PaymentStatus.PAID,
    });
    setFormErrors({});
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleDeletePayment = (payment: FeePayment) => {
    setSelectedPayment(payment);
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
      const selectedStudent = students.find(s => s.id === formData.studentId);

      if (selectedPayment) {
        // Update existing payment
        const updatedPayment: FeePayment = {
          ...selectedPayment,
          studentId: formData.studentId,
          student: selectedStudent,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId || undefined,
          notes: formData.notes || undefined,
          remarks: formData.notes || undefined,
          paymentDate: formData.paymentDate,
          status: formData.status,
          updatedAt: new Date().toISOString(),
        };
        setPayments(prev => prev.map(p => p.id === selectedPayment.id ? updatedPayment : p));
        setShowEditModal(false);
      } else {
        // Add new payment
        const newPayment: FeePayment = {
          id: String(payments.length + 1),
          studentId: formData.studentId,
          student: selectedStudent,
          feeStructureId: 'fs001',
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId || undefined,
          notes: formData.notes || undefined,
          remarks: formData.notes || undefined,
          paymentDate: formData.paymentDate,
          status: formData.status,
          recordedById: 'current-user', // Would be current user ID
          receivedById: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPayments(prev => [...prev, newPayment]);
        setShowRecordPayment(false);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPayment) return;

    setIsSubmitting(true);
    try {
      setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      setShowDeleteModal(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (payment: FeePayment, newStatus: PaymentStatus) => {
    try {
      const updatedPayment: FeePayment = {
        ...payment,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setPayments(prev => prev.map(p => p.id === payment.id ? updatedPayment : p));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CASH': return 'bg-green-100 text-green-800';
      case 'BANK_TRANSFER': return 'bg-blue-100 text-blue-800';
      case 'CHEQUE': return 'bg-yellow-100 text-yellow-800';
      case 'ONLINE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Fee Payments</h1>
          <p className="text-gray-600 mt-1">Track and manage student fee payments</p>
        </div>
        <button
          onClick={handleRecordPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {ICONS.Add}
          Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="text-green-600">{ICONS.Check}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">GH₵ {totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="text-blue-600">{ICONS.Users}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payments Made</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <div className="text-orange-600">{ICONS.CreditCard}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                GH₵ {payments.length > 0 ? Math.round(totalCollected / payments.length).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by student name, admission number, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={PaymentStatus.PAID}>Paid</option>
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.OVERDUE}>Overdue</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Payment Records ({filteredPayments.length})
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={payment.student?.profileImage || `https://picsum.photos/seed/${payment.studentId}/40/40`}
                          alt={`${payment.student?.firstName} ${payment.student?.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.student?.firstName} {payment.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.student?.admissionNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          {payment.remarks}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      GH₵ {payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
                      {payment.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={payment.status || PaymentStatus.PAID}
                      onChange={(e) => handleStatusChange(payment, e.target.value as PaymentStatus)}
                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={PaymentStatus.PAID}>Paid</option>
                      <option value={PaymentStatus.PENDING}>Pending</option>
                      <option value={PaymentStatus.OVERDUE}>Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.transactionId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        View Receipt
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment)}
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No payment records found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria or record a new payment</p>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showRecordPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Record Fee Payment</h2>
              <button
                onClick={() => setShowRecordPayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
                {formErrors.studentId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (GH₵) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="1500.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.paymentDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.paymentDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.paymentDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE">Online Payment</option>
                  </select>
                  {formErrors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.paymentMethod}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Optional reference number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes/Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional payment details or remarks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentStatus.PAID}>Paid</option>
                  <option value={PaymentStatus.PENDING}>Pending</option>
                  <option value={PaymentStatus.OVERDUE}>Overdue</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRecordPayment(false)}
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
                  {isSubmitting ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Payment</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {selectedPayment.student?.firstName} {selectedPayment.student?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedPayment.student?.admissionNumber} • GH₵ {selectedPayment.amount}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (GH₵) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.paymentDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.paymentDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.paymentDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE">Online Payment</option>
                  </select>
                  {formErrors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.paymentMethod}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Optional reference number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes/Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional payment details or remarks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PaymentStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PaymentStatus.PAID}>Paid</option>
                  <option value={PaymentStatus.PENDING}>Pending</option>
                  <option value={PaymentStatus.OVERDUE}>Overdue</option>
                </select>
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
                  {isSubmitting ? 'Updating...' : 'Update Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">Delete Payment</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                {ICONS.Close}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this payment record?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-gray-900">
                  {selectedPayment.student?.firstName} {selectedPayment.student?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPayment.student?.admissionNumber} • GH₵ {selectedPayment.amount}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPayment.paymentMethod} • {new Date(selectedPayment.paymentDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-red-600 text-sm mt-3">
                This action cannot be undone and will affect financial records.
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
                {isSubmitting ? 'Deleting...' : 'Delete Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}