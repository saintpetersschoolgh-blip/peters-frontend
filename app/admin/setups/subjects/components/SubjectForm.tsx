'use client';
import React, { useState, useEffect } from 'react';
import { Subject, SubjectFormData } from '../types';
import { ICONS } from '../../../../../constants';

interface SubjectFormProps {
  subject?: Subject | null;
  onSubmit: (data: SubjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function SubjectForm({
  subject,
  onSubmit,
  onCancel,
  isSubmitting,
  error: externalError,
}: SubjectFormProps) {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    code: '',
    description: '',
    department: '',
    creditHours: undefined,
    isCore: false,
    isElective: false,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SubjectFormData, string>>>({});

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code || '',
        description: subject.description || '',
        department: subject.department || '',
        creditHours: subject.creditHours,
        isCore: subject.isCore ?? false,
        isElective: subject.isElective ?? false,
        isActive: subject.isActive ?? true,
      });
    }
  }, [subject]);

  const validateForm = (data: SubjectFormData): Partial<Record<keyof SubjectFormData, string>> => {
    const errors: Partial<Record<keyof SubjectFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }

    if (data.creditHours !== undefined && data.creditHours <= 0) {
      errors.creditHours = 'Credit Hours must be a positive number';
    }

    if (!data.isCore && !data.isElective) {
      errors.isCore = 'Subject must be either Core or Elective (at least one must be selected)';
      errors.isElective = 'Subject must be either Core or Elective (at least one must be selected)';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {externalError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          {ICONS.Alert}
          <span>{externalError}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
          }}
          className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          required
          disabled={isSubmitting}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            {ICONS.Alert}
            {formErrors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Credit Hours</label>
        <input
          type="number"
          value={formData.creditHours || ''}
          onChange={(e) => {
            setFormData({ ...formData, creditHours: e.target.value ? parseInt(e.target.value) : undefined });
            if (formErrors.creditHours) setFormErrors({ ...formErrors, creditHours: undefined });
          }}
          min="1"
          className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            formErrors.creditHours ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
        />
        {formErrors.creditHours && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            {ICONS.Alert}
            {formErrors.creditHours}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isCore}
              onChange={(e) => {
                setFormData({ ...formData, isCore: e.target.checked });
                if (formErrors.isCore || formErrors.isElective) {
                  setFormErrors({ ...formErrors, isCore: undefined, isElective: undefined });
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-gray-700">Is Core</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isElective}
              onChange={(e) => {
                setFormData({ ...formData, isElective: e.target.checked });
                if (formErrors.isCore || formErrors.isElective) {
                  setFormErrors({ ...formErrors, isCore: undefined, isElective: undefined });
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="text-sm font-medium text-gray-700">Is Elective</span>
          </label>
        </div>

        {(formErrors.isCore || formErrors.isElective) && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            {ICONS.Alert}
            {formErrors.isCore || formErrors.isElective}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm font-medium text-gray-700">Is Active</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {subject ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            subject ? 'Update Subject' : 'Add Subject'
          )}
        </button>
      </div>
    </form>
  );
}
