/**
 * API Client Layer with Authentication
 *
 * TO CONNECT YOUR BACKEND:
 * 1. Change BASE_URL to your server address (e.g., 'http://localhost:5000/api')
 * 2. Ensure your backend has CORS enabled for this origin.
 */

import * as MOCK from '../constants';

const BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL 

// Get authentication headers
const getAuthHeaders = (): HeadersInit => {
  let token: string | null = null;
  try {
    token = localStorage.getItem('authToken');
  } catch {
    token = null;
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'An error occurred';

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
  } catch {
    errorMessage = response.statusText || `HTTP ${response.status}`;
  }

  // Handle authentication errors
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('lastActivity');
    window.location.hash = '#/login';
    throw new Error('Session expired. Please login again.');
  }

  // Handle forbidden access
  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }

  throw new Error(errorMessage);
};

// Intelligent fallback logic for demo purposes
const getMockData = (endpoint: string): any => {
  // Core setup data (used across multiple admin pages)
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const yyyyMmDd = (d: Date) => d.toISOString().split('T')[0];

  const DEMO_ACADEMIC_YEARS = [
    {
      id: 'ay-2024-2025',
      name: '2024-2025',
      startDate: '2024-09-01',
      endDate: '2025-07-31',
      createdAt: iso(new Date('2024-06-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-06-01T00:00:00Z')),
    },
    {
      id: 'ay-2025-2026',
      name: '2025-2026',
      startDate: '2025-09-01',
      endDate: '2026-07-31',
      createdAt: iso(new Date('2025-06-01T00:00:00Z')),
      updatedAt: iso(new Date('2025-06-01T00:00:00Z')),
    },
  ];

  const DEMO_GRADE_LEVELS = [
    {
      id: 'gl-10',
      name: 'Grade 10',
      code: 'G10',
      description: 'Junior High - Grade 10',
      order: 10,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'gl-11',
      name: 'Grade 11',
      code: 'G11',
      description: 'Senior High - Grade 11',
      order: 11,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'gl-12',
      name: 'Grade 12',
      code: 'G12',
      description: 'Senior High - Grade 12',
      order: 12,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
  ];

  const DEMO_PERIODS = [
    { id: 'period-1', name: 'Period 1', startTime: '08:00', endTime: '08:45', createdAt: iso(new Date('2024-01-01T00:00:00Z')), updatedAt: iso(new Date('2024-01-01T00:00:00Z')) },
    { id: 'period-2', name: 'Period 2', startTime: '08:50', endTime: '09:35', createdAt: iso(new Date('2024-01-01T00:00:00Z')), updatedAt: iso(new Date('2024-01-01T00:00:00Z')) },
    { id: 'period-3', name: 'Period 3', startTime: '09:40', endTime: '10:25', createdAt: iso(new Date('2024-01-01T00:00:00Z')), updatedAt: iso(new Date('2024-01-01T00:00:00Z')) },
    { id: 'period-4', name: 'Break', startTime: '10:25', endTime: '10:45', createdAt: iso(new Date('2024-01-01T00:00:00Z')), updatedAt: iso(new Date('2024-01-01T00:00:00Z')) },
    { id: 'period-5', name: 'Period 4', startTime: '10:45', endTime: '11:30', createdAt: iso(new Date('2024-01-01T00:00:00Z')), updatedAt: iso(new Date('2024-01-01T00:00:00Z')) },
  ];

  const DEMO_SUBJECTS = [
    {
      id: 'subj-math',
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Core mathematics',
      department: 'Mathematics',
      creditHours: 3,
      isCore: true,
      isElective: false,
      isActive: true,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'subj-eng',
      name: 'English Language',
      code: 'ENG101',
      description: 'Reading and writing skills',
      department: 'Languages',
      creditHours: 3,
      isCore: true,
      isElective: false,
      isActive: true,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
    {
      id: 'subj-ict',
      name: 'ICT',
      code: 'ICT101',
      description: 'Introduction to computing',
      department: 'ICT',
      creditHours: 2,
      isCore: false,
      isElective: true,
      isActive: true,
      createdAt: iso(new Date('2024-01-01T00:00:00Z')),
      updatedAt: iso(new Date('2024-01-01T00:00:00Z')),
    },
  ];

  const DEMO_CLASSROOMS = [
    {
      id: 'cr-10a',
      name: 'Grade 10A',
      code: 'G10A',
      description: 'Main block - Room 101',
      capacity: 40,
      location: 'Room 101',
      classTeacherId: 'teacher001',
      gradeLevel: DEMO_GRADE_LEVELS[0],
      subjectIds: ['subj-math', 'subj-eng', 'subj-ict'],
      studentIds: [],
      academicYear: DEMO_ACADEMIC_YEARS[1].name,
      startDate: '2025-09-01',
      endDate: '2026-07-31',
      isActive: true,
      createdAt: iso(new Date('2025-09-01T00:00:00Z')),
      updatedAt: iso(new Date('2025-09-01T00:00:00Z')),
    },
    {
      id: 'cr-10b',
      name: 'Grade 10B',
      code: 'G10B',
      description: 'Main block - Room 102',
      capacity: 40,
      location: 'Room 102',
      classTeacherId: 'teacher002',
      gradeLevel: DEMO_GRADE_LEVELS[0],
      subjectIds: ['subj-math', 'subj-eng'],
      studentIds: [],
      academicYear: DEMO_ACADEMIC_YEARS[1].name,
      startDate: '2025-09-01',
      endDate: '2026-07-31',
      isActive: true,
      createdAt: iso(new Date('2025-09-01T00:00:00Z')),
      updatedAt: iso(new Date('2025-09-01T00:00:00Z')),
    },
  ];

  const DEMO_TERMS = [
    {
      id: 'term-1-2025-2026',
      name: 'Term 1',
      academicYearId: DEMO_ACADEMIC_YEARS[1].id,
      academicYear: DEMO_ACADEMIC_YEARS[1],
      startDate: '2025-09-01',
      endDate: '2025-12-12',
      createdAt: iso(new Date('2025-08-15T00:00:00Z')),
      updatedAt: iso(new Date('2025-08-15T00:00:00Z')),
    },
    {
      id: 'term-2-2025-2026',
      name: 'Term 2',
      academicYearId: DEMO_ACADEMIC_YEARS[1].id,
      academicYear: DEMO_ACADEMIC_YEARS[1],
      startDate: '2026-01-06',
      endDate: '2026-03-27',
      createdAt: iso(new Date('2025-12-20T00:00:00Z')),
      updatedAt: iso(new Date('2025-12-20T00:00:00Z')),
    },
    {
      id: 'term-3-2025-2026',
      name: 'Term 3',
      academicYearId: DEMO_ACADEMIC_YEARS[1].id,
      academicYear: DEMO_ACADEMIC_YEARS[1],
      startDate: '2026-04-14',
      endDate: '2026-07-31',
      createdAt: iso(new Date('2026-03-28T00:00:00Z')),
      updatedAt: iso(new Date('2026-03-28T00:00:00Z')),
    },
  ];

  // Setup pages driven by apiClient (no backend) should still show demo rows.
  if (endpoint.includes('/academic-years')) return DEMO_ACADEMIC_YEARS;
  if (endpoint.includes('/terms')) return DEMO_TERMS;
  if (endpoint.includes('/periods')) return DEMO_PERIODS;
  if (endpoint.includes('/grade-levels')) return DEMO_GRADE_LEVELS;
  if (endpoint.includes('/subjects')) return DEMO_SUBJECTS;
  if (endpoint.includes('/classrooms')) return DEMO_CLASSROOMS;
  if (endpoint.includes('/classroom-setups')) {
    return [
      {
        id: 'crs-10',
        name: 'Grade 10 (Setup)',
        gradeLevelId: DEMO_GRADE_LEVELS[0].id,
        gradeLevel: DEMO_GRADE_LEVELS[0],
        capacity: 40,
        createdAt: iso(new Date('2025-08-01T00:00:00Z')),
        updatedAt: iso(new Date('2025-08-01T00:00:00Z')),
      },
    ];
  }
  if (endpoint.includes('/subject-setups')) {
    return [
      {
        id: 'subs-math',
        name: 'Mathematics (Setup)',
        code: 'MATH101',
        gradeLevelId: DEMO_GRADE_LEVELS[0].id,
        gradeLevel: DEMO_GRADE_LEVELS[0],
        isCore: true,
        createdAt: iso(new Date('2025-08-01T00:00:00Z')),
        updatedAt: iso(new Date('2025-08-01T00:00:00Z')),
      },
    ];
  }

  if (endpoint.includes('/students/top')) return MOCK.TOP_STUDENTS;
  if (endpoint.includes('/students')) return MOCK.MOCK_STUDENTS;
  if (endpoint.includes('/teachers/top')) return MOCK.TOP_TEACHERS;
  if (endpoint.includes('/teachers')) return MOCK.MOCK_TEACHERS;
  if (endpoint.includes('/exams/upcoming')) return MOCK.UPCOMING_EXAMS;
  if (endpoint.includes('/exams')) return MOCK.UPCOMING_EXAMS;
  if (endpoint.includes('/fees/recent')) return MOCK.RECENT_FEES;
  if (endpoint.includes('/fees')) return MOCK.RECENT_FEES;
  if (endpoint.includes('/attendance/recent')) return [];
  if (endpoint.includes('/attendance')) return [];
  if (endpoint.includes('/classwork')) return [];
  if (endpoint.includes('/homework')) return [];
  if (endpoint.includes('/notifications/flagged')) return [];
  if (endpoint.includes('/auth/me')) return null;
  if (endpoint.includes('/dashboard/stats')) return {
    totalStudents: 0,
    totalTeachers: 0,
    averageAttendance: 0,
    totalRevenue: 0
  };
  // Example timestamped list endpoints fallback to a small sample row
  if (endpoint.includes('/notifications/results')) {
    return [
      { id: 'nr-1', title: 'Exam Results Published', date: yyyyMmDd(now), createdAt: iso(now) },
    ];
  }
  return [];
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // If 404 or network error, try fallback
        if (response.status === 404 || !navigator.onLine) {
          console.warn(`API not available for ${endpoint}. Using fallback data.`);
          return getMockData(endpoint) as unknown as T;
        }

        throw await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      // Network error fallback
      if (!navigator.onLine || error instanceof TypeError) {
        console.warn(`Network error for ${endpoint}. Using fallback data.`);
        return getMockData(endpoint) as unknown as T;
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      if (!navigator.onLine || error instanceof TypeError) {
        console.warn(`Network error for POST ${endpoint}. Simulating success.`);
        return { status: 'success', simulated: true, data } as unknown as T;
      }
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      if (!navigator.onLine || error instanceof TypeError) {
        console.warn(`Network error for PUT ${endpoint}. Simulating success.`);
        return { status: 'success', simulated: true } as unknown as T;
      }
      throw error;
    }
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      if (!navigator.onLine || error instanceof TypeError) {
        console.warn(`Network error for PATCH ${endpoint}. Simulating success.`);
        return { status: 'success', simulated: true } as unknown as T;
      }
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw await handleApiError(response);
      }

      return response.status === 204 ? ({} as T) : await response.json();
    } catch (error) {
      if (!navigator.onLine || error instanceof TypeError) {
        console.warn(`Network error for DELETE ${endpoint}. Simulating success.`);
        return { status: 'success', simulated: true } as unknown as T;
      }
      throw error;
    }
  }
};
