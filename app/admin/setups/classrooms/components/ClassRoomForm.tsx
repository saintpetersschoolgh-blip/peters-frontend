'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ClassRoom, ClassRoomFormData, Teacher, Subject } from '../types';
import { GradeLevel } from '../../../../../types';
import { AcademicYear } from '../../../../../types';
import { ICONS } from '../../../../../constants';
import { gradeLevelService } from '../../../../../lib/services/gradeLevelService';
import { academicYearService } from '../../../../../lib/services/academicYearService';
import { apiClient } from '../../../../../lib/api-client';

interface ClassRoomFormProps {
  classroom?: ClassRoom | null;
  onSubmit: (data: ClassRoomFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function ClassRoomForm({
  classroom,
  onSubmit,
  onCancel,
  isSubmitting,
  error: externalError,
}: ClassRoomFormProps) {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ClassRoomFormData>({
    name: '',
    code: '',
    description: '',
    capacity: undefined,
    location: '',
    classTeacherId: '',
    gradeLevel: undefined,
    subjectIds: [],
    academicYear: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ClassRoomFormData, string>>>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };

    if (isSubjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubjectDropdownOpen]);

  useEffect(() => {
    if (classroom) {
      setFormData({
        name: classroom.name,
        code: classroom.code || '',
        description: classroom.description || '',
        capacity: classroom.capacity,
        location: classroom.location || '',
        classTeacherId: classroom.classTeacherId || '',
        gradeLevel: classroom.gradeLevel,
        subjectIds: classroom.subjectIds || [],
        academicYear: classroom.academicYear || '',
        startDate: classroom.startDate ? classroom.startDate.split('T')[0] : '',
        endDate: classroom.endDate ? classroom.endDate.split('T')[0] : '',
        isActive: classroom.isActive ?? true,
      });
    }
  }, [classroom]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradeLevelsData, academicYearsData] = await Promise.all([
        gradeLevelService.getAll(),
        academicYearService.getAll(),
      ]);

      try {
        const teachersData = await apiClient.get<Teacher[]>('/teachers');
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch {
        setTeachers([]);
      }

      try {
        const subjectsData = await apiClient.get<Subject[]>('/subjects');
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch {
        setSubjects([]);
      }

      setGradeLevels(gradeLevelsData.sort((a, b) => a.order - b.order));
      setAcademicYears(academicYearsData);
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data: ClassRoomFormData): Partial<Record<keyof ClassRoomFormData, string>> => {
    const errors: Partial<Record<keyof ClassRoomFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }

    if (data.capacity !== undefined && data.capacity <= 0) {
      errors.capacity = 'Capacity must be a positive number';
    }

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        errors.endDate = 'End date must be after start date';
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


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {externalError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
          <span className="text-red-600">{ICONS.Alert}</span>
          <span>{externalError}</span>
        </div>
      )}

      <div>
        <label className="label">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
          }}
          className={`input ${formErrors.name ? 'border-red-300 bg-red-50' : ''}`}
          required
          disabled={isSubmitting}
        />
        {formErrors.name && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
            <span className="text-red-600">{ICONS.Alert}</span>
            {formErrors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="input"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="label">Capacity</label>
          <input
            type="number"
            value={formData.capacity || ''}
            onChange={(e) => {
              setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined });
              if (formErrors.capacity) setFormErrors({ ...formErrors, capacity: undefined });
            }}
            min="1"
            className={`input ${formErrors.capacity ? 'border-red-300 bg-red-50' : ''}`}
            disabled={isSubmitting}
          />
          {formErrors.capacity && (
            <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
              <span className="text-red-600">{ICONS.Alert}</span>
              {formErrors.capacity}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="input resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="label">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="input"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Grade Level</label>
          <select
            value={formData.gradeLevel?.id || ''}
            onChange={(e) => {
              const selected = gradeLevels.find(gl => gl.id === e.target.value);
              setFormData({ ...formData, gradeLevel: selected });
            }}
            className="input"
            disabled={isSubmitting}
          >
            <option value="">Select Grade Level...</option>
            {gradeLevels.map(gl => (
              <option key={gl.id} value={gl.id}>{gl.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Class Teacher</label>
          <select
            value={formData.classTeacherId}
            onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
            className="input"
            disabled={isSubmitting}
          >
            <option value="">Select Teacher...</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} {teacher.staffNumber ? `(${teacher.staffNumber})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Subjects</label>
        <div className="relative" ref={subjectDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            className={`input text-left cursor-pointer ${
              isSubjectDropdownOpen ? 'border-slate-500 bg-slate-50' : ''
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 flex-1">
                {formData.subjectIds.length === 0 ? (
                  <span className="text-slate-400">Select subjects...</span>
                ) : (
                  formData.subjectIds.map(subjectId => {
                    const subject = subjects.find(s => s.id === subjectId);
                    return subject ? (
                      <span
                        key={subjectId}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md"
                      >
                        {subject.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({
                              ...formData,
                              subjectIds: formData.subjectIds.filter(id => id !== subjectId),
                            });
                          }}
                          className="hover:text-slate-900 ml-0.5"
                          disabled={isSubmitting}
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                )}
              </div>
              <span className={`ml-2 text-slate-500 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`}>
                <span className="text-slate-500">{ICONS.ChevronDown}</span>
              </span>
            </div>
          </button>

          {isSubjectDropdownOpen && (
            <div className="absolute z-10 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {subjects.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500">No subjects available</div>
              ) : (
                <div className="py-1">
                  {subjects.map(subject => {
                    const isSelected = formData.subjectIds.includes(subject.id);
                    return (
                      <label
                        key={subject.id}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-slate-100' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setFormData({
                              ...formData,
                              subjectIds: isSelected
                                ? formData.subjectIds.filter(id => id !== subject.id)
                                : [...formData.subjectIds, subject.id],
                            });
                          }}
                          className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm text-slate-700 flex-1">
                          {subject.name} <span className="text-slate-500">({subject.code})</span>
                        </span>
                        {isSelected && (
                          <span className="text-green-600">{ICONS.Check}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {formData.subjectIds.length > 0 && (
          <p className="text-xs text-slate-500 mt-1.5">
            {formData.subjectIds.length} subject{formData.subjectIds.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      <div>
        <label className="label">Academic Year</label>
        <select
          value={formData.academicYear}
          onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
          className="input"
          disabled={isSubmitting}
        >
          <option value="">Select Academic Year...</option>
          {academicYears.map(ay => (
            <option key={ay.id} value={ay.name}>{ay.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value });
              if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: undefined });
            }}
            className="input"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="label">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => {
              setFormData({ ...formData, endDate: e.target.value });
              if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: undefined });
            }}
            min={formData.startDate || undefined}
            className={`input ${formErrors.endDate ? 'border-red-300 bg-red-50' : ''}`}
            disabled={isSubmitting}
          />
          {formErrors.endDate && (
            <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
              <span className="text-red-600">{ICONS.Alert}</span>
              {formErrors.endDate}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
            disabled={isSubmitting}
          />
          <span className="text-sm font-medium text-slate-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {classroom ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>
              {ICONS.Add}
              {classroom ? 'Update ClassRoom' : 'Add ClassRoom'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
