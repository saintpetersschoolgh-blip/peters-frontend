import { apiClient } from '../../../../../lib/api-client';
import { ClassRoom, ClassRoomFormData } from '../types';

const BASE_ENDPOINT = '/classrooms';

export const classroomService = {
  async getAll(): Promise<ClassRoom[]> {
    try {
      const response = await apiClient.get<ClassRoom[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      return [];
    }
  },

  async create(payload: ClassRoomFormData): Promise<ClassRoom> {
    try {
      const response = await apiClient.post<ClassRoom>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `cr-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        capacity: payload.capacity,
        location: payload.location,
        classTeacherId: payload.classTeacherId,
        gradeLevel: payload.gradeLevel,
        subjectIds: payload.subjectIds || [],
        studentIds: [],
        academicYear: payload.academicYear,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `cr-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        capacity: payload.capacity,
        location: payload.location,
        classTeacherId: payload.classTeacherId,
        gradeLevel: payload.gradeLevel,
        subjectIds: payload.subjectIds || [],
        studentIds: [],
        academicYear: payload.academicYear,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: ClassRoomFormData): Promise<ClassRoom> {
    try {
      const response = await apiClient.put<ClassRoom>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        capacity: payload.capacity,
        location: payload.location,
        classTeacherId: payload.classTeacherId,
        gradeLevel: payload.gradeLevel,
        subjectIds: payload.subjectIds || [],
        studentIds: [],
        academicYear: payload.academicYear,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        capacity: payload.capacity,
        location: payload.location,
        classTeacherId: payload.classTeacherId,
        gradeLevel: payload.gradeLevel,
        subjectIds: payload.subjectIds || [],
        studentIds: [],
        academicYear: payload.academicYear,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
