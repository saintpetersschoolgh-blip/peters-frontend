'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ExamResult } from '../../../../types';
import { ICONS } from '../../../../constants';

const IMPORTED_RESULTS_KEY = 'importedExamResults';

export default function HeadMasterExamApprovalsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMPORTED_RESULTS_KEY);
      setResults(raw ? (JSON.parse(raw) as ExamResult[]) : []);
    } catch {
      setResults([]);
    }
  }, []);

  const filtered = useMemo(() => {
    return results.filter(result => {
      const name = `${result.student?.firstName ?? ''} ${result.student?.lastName ?? ''}`.toLowerCase();
      const admission = result.student?.admissionNumber?.toLowerCase() ?? '';
      const exam = result.exam?.title?.toLowerCase() ?? '';
      const searchTerm = search.toLowerCase();
      const matchesSearch = name.includes(searchTerm) || admission.includes(searchTerm) || exam.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || 
        (statusFilter === 'PENDING' && !result.isPublished) ||
        (statusFilter === 'APPROVED' && result.isPublished);
      return matchesSearch && matchesStatus;
    });
  }, [results, search, statusFilter]);

  const stats = useMemo(() => {
    const total = results.length;
    const pending = results.filter(r => !r.isPublished).length;
    const approved = results.filter(r => r.isPublished).length;
    return { total, pending, approved };
  }, [results]);

  const handleApprove = (id: string) => {
    setResults(prev => {
      const next = prev.map(item =>
        item.id === id ? { ...item, isPublished: true, updatedAt: new Date().toISOString() } : item
      );
      try {
        localStorage.setItem(IMPORTED_RESULTS_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setResults(prev => {
      const next = prev.map(item =>
        selectedIds.has(item.id) ? { ...item, isPublished: true, updatedAt: new Date().toISOString() } : item
      );
      try {
        localStorage.setItem(IMPORTED_RESULTS_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pendingIds = filtered.filter(r => !r.isPublished).map(r => r.id);
    if (pendingIds.every(id => selectedIds.has(id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingIds));
    }
  };

  const pendingSelected = filtered.filter(r => !r.isPublished && selectedIds.has(r.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Results Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve teacher-submitted exam results</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
          <div className="text-sm text-slate-500">Total Results</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-amber-50 rounded-lg shadow p-4 border border-amber-200">
          <div className="text-sm text-amber-700">Pending Approval</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-700">Approved</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, admission number, or exam..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'PENDING' | 'APPROVED')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {pendingSelected > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {pendingSelected} result{pendingSelected !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkApprove}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {ICONS.Check}
            Approve Selected
          </button>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Submitted Results ({filtered.length})</h3>
          {filtered.some(r => !r.isPublished) && (
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {filtered.filter(r => !r.isPublished).every(r => selectedIds.has(r.id)) ? 'Deselect All' : 'Select All Pending'}
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={filtered.filter(r => !r.isPublished).length > 0 && 
                             filtered.filter(r => !r.isPublished).every(r => selectedIds.has(r.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(result => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {!result.isPublished && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(result.id)}
                        onChange={() => toggleSelect(result.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{result.student?.firstName} {result.student?.lastName}</div>
                    <div className="text-xs text-gray-500">{result.student?.admissionNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{result.exam?.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="font-medium">{result.score}</span>/{result.exam?.totalScore}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.grade === 'A' ? 'bg-green-100 text-green-800' :
                      result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      result.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {result.isPublished ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {!result.isPublished ? (
                      <button
                        onClick={() => handleApprove(result.id)}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                      >
                        {ICONS.Check}
                        Approve
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
