'use client';
import React, { useState, useEffect } from 'react';
import { GradeLevel, GradeLevelFormData } from '../types';
import { ICONS } from '../../../../../constants';

interface GradeLevelFormProps {
  gradeLevel?: GradeLevel | null;
  onSubmit: (data: GradeLevelFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string | null;
  existingGradeLevels?: GradeLevel[];
}

export default function GradeLevelForm({
  gradeLevel,
  onSubmit,
  onCancel,
  isSubmitting,
  error: externalError,
  existingGradeLevels = [],
}: GradeLevelFormProps) {
  const [formData, setFormData] = useState<GradeLevelFormData>({
    name: '',
    code: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof GradeLevelFormData, string>>>({});

  useEffect(() => {
    if (gradeLevel) {
      setFormData({
        name: gradeLevel.name,
        code: gradeLevel.code || '',
        description: gradeLevel.description || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
      });
    }
  }, [gradeLevel]);

  const validateForm = (data: GradeLevelFormData): Partial<Record<keyof GradeLevelFormData, string>> => {
    const errors: Partial<Record<keyof GradeLevelFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }

    if (data.code && data.code.trim()) {
      const existingCode = existingGradeLevels.find(
        gl => gl.code?.toLowerCase() === data.code.toLowerCase().trim() && gl.id !== gradeLevel?.id
      );
      if (existingCode) {
        errors.code = 'Code must be unique';
      }
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => {
            setFormData({ ...formData, code: e.target.value });
            if (formErrors.code) setFormErrors({ ...formErrors, code: undefined });
          }}
          className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            formErrors.code ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
        />
        {formErrors.code && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            {ICONS.Alert}
            {formErrors.code}
          </p>
        )}
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
              {gradeLevel ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            gradeLevel ? 'Update Grade Level' : 'Add Grade Level'
          )}
        </button>
      </div>
    </form>
  );
}
