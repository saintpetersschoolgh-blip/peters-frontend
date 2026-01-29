'use client';
import React from 'react';
import { ClassRoom } from '../types';
import { ICONS } from '../../../../../constants';

interface ClassRoomTableProps {
  classrooms: ClassRoom[];
  onEdit: (classroom: ClassRoom) => void;
  onDelete: (classroom: ClassRoom) => void;
}

export default function ClassRoomTable({ classrooms, onEdit, onDelete }: ClassRoomTableProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (classrooms.length === 0) {
    return (
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Classrooms</h3>
        </div>
        <div className="px-6 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-slate-400">{ICONS.LayoutGrid}</div>
            <div>
              <p className="text-sm font-medium text-slate-900">No classrooms found</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add ClassRoom" to create your first classroom</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-900">Classrooms ({classrooms.length})</h3>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Grade Level</th>
              <th>Capacity</th>
              <th>Academic Year</th>
              <th>Class Teacher</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">{ICONS.LayoutGrid}</span>
                    </div>
                    <div className="font-medium text-slate-900 min-w-0 truncate">{classroom.name}</div>
                  </div>
                </td>
                <td>
                  <div className="font-mono text-slate-600">{classroom.code || '—'}</div>
                </td>
                <td>
                  <div className="text-slate-700">{classroom.gradeLevel?.name || '—'}</div>
                </td>
                <td>
                  <div className="text-slate-700">{classroom.capacity || '—'}</div>
                </td>
                <td>
                  <div className="text-slate-700">{classroom.academicYear || '—'}</div>
                </td>
                <td>
                  <div className="text-slate-700">
                    {classroom.classTeacherId ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Assigned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                        Not Assigned
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`badge ${classroom.isActive ? 'badge-success' : 'badge-neutral'}`}>
                    {classroom.isActive ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(classroom)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                      title="Edit classroom"
                    >
                      <span className="text-blue-600">{ICONS.PenTool}</span>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(classroom)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-colors"
                      title="Delete classroom"
                    >
                      <span className="text-red-600">{ICONS.Alert}</span>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
