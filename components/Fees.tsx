'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/auth-context';
import { Student, PaymentStatus, UserRole } from '../types';
import { ICONS } from '../constants';

interface FeeRecord {
  id: string;
  studentId: string;
  term: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  otherFees: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

export default function Fees() {
  const { user } = useAuth();
  const isParent = user?.role === UserRole.PARENT;
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  useEffect(() => {
    // Mock data
    const mockChildren: Student[] = [
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
        isActive: true,
        enrolledAt: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const mockFees: FeeRecord[] = [
      {
        id: 'fee001',
        studentId: 'student001',
        term: 'Term 1',
        academicYear: '2024-2025',
        tuitionFee: 5000,
        examFee: 500,
        otherFees: 300,
        totalAmount: 5800,
        paidAmount: 5800,
        balance: 0,
        status: PaymentStatus.PAID,
        dueDate: '2024-02-01',
        paidDate: '2024-01-25',
        paymentMethod: 'Bank Transfer',
      },
      {
        id: 'fee002',
        studentId: 'student001',
        term: 'Term 2',
        academicYear: '2024-2025',
        tuitionFee: 5000,
        examFee: 500,
        otherFees: 300,
        totalAmount: 5800,
        paidAmount: 3000,
        balance: 2800,
        status: PaymentStatus.PENDING,
        dueDate: '2024-05-01',
      },
      {
        id: 'fee003',
        studentId: 'student001',
        term: 'Term 3',
        academicYear: '2024-2025',
        tuitionFee: 5000,
        examFee: 500,
        otherFees: 300,
        totalAmount: 5800,
        paidAmount: 0,
        balance: 5800,
        status: PaymentStatus.OVERDUE,
        dueDate: '2024-08-01',
      },
    ];

    setTimeout(() => {
      if (isParent) {
        setChildren(mockChildren);
        setSelectedChildId(mockChildren[0]?.id || '');
      }
      setFees(mockFees);
      setLoading(false);
    }, 500);
  }, [isParent]);

  const filteredFees = useMemo(() => {
    let filtered = fees;
    
    if (isParent && selectedChildId) {
      filtered = filtered.filter(fee => fee.studentId === selectedChildId);
    } else if (!isParent && user) {
      filtered = filtered.filter(fee => fee.studentId === user.studentId);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(fee => fee.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [fees, selectedChildId, statusFilter, isParent, user]);

  const stats = useMemo(() => {
    const all = isParent && selectedChildId
      ? fees.filter(fee => fee.studentId === selectedChildId)
      : fees;
    return {
      total: all.reduce((sum, fee) => sum + fee.totalAmount, 0),
      paid: all.reduce((sum, fee) => sum + fee.paidAmount, 0),
      balance: all.reduce((sum, fee) => sum + fee.balance, 0),
      overdue: all.filter(fee => fee.status === PaymentStatus.OVERDUE).length,
    };
  }, [fees, selectedChildId, isParent]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isParent ? 'Fee Payments' : 'Fee Status'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isParent ? 'View and manage your child\'s fee payments' : 'View your fee payment status'}
          </p>
        </div>
        {isParent && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {ICONS.CreditCard}
            Make Payment
          </button>
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
          <div className="text-sm text-slate-500">Total Fees</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">₵{stats.total.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-700">Paid</div>
          <div className="text-2xl font-bold text-green-900 mt-1">₵{stats.paid.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-sm text-red-700">Outstanding</div>
          <div className="text-2xl font-bold text-red-900 mt-1">₵{stats.balance.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
          <div className="text-sm text-orange-700">Overdue</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value={PaymentStatus.PAID}>Paid</option>
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.OVERDUE}>Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Fee Records ({filteredFees.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {isParent && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={isParent ? 8 : 7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{fee.term}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{fee.academicYear}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₵{fee.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₵{fee.paidAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₵{fee.balance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                    {isParent && fee.balance > 0 && (
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Pay Now
                        </button>
                      </td>
                    )}
                    {isParent && fee.balance === 0 && (
                      <td className="px-6 py-4 text-sm text-gray-500">—</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
