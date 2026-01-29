'use client';
import React from 'react';
import { GradeLevel } from '../types';
import { ICONS } from '../../../../../constants';

interface GradeLevelTableProps {
  gradeLevels: GradeLevel[];
  onEdit: (gradeLevel: GradeLevel) => void;
  onDelete: (gradeLevel: GradeLevel) => void;
}

export default function GradeLevelTable({ gradeLevels, onEdit, onDelete }: GradeLevelTableProps) {
  if (gradeLevels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Grade Levels (0)</h3>
        </div>
        <div className="px-6 py-12 text-center text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <div className="text-gray-400">{ICONS.Cap}</div>
            <div>
              <p className="text-lg font-medium text-gray-900">No grade levels found</p>
              <p className="text-sm text-gray-500 mt-1">Click "Add Grade Level" to create your first grade level</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Grade Levels ({gradeLevels.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gradeLevels.map((gradeLevel) => (
              <tr key={gradeLevel.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-blue-600">{ICONS.Cap}</div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{gradeLevel.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">{gradeLevel.code || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate">
                    {gradeLevel.description || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(gradeLevel)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(gradeLevel)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
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
    </div>
  );
}
