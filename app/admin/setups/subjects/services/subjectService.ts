import { apiClient } from '../../../../../lib/api-client';
import { Subject, SubjectFormData } from '../types';

const BASE_ENDPOINT = '/subjects';

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    try {
      const response = await apiClient.get<Subject[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  },

  async create(payload: SubjectFormData): Promise<Subject> {
    try {
      const response = await apiClient.post<Subject>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `subj-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        department: payload.department,
        creditHours: payload.creditHours,
        isCore: payload.isCore,
        isElective: payload.isElective,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `subj-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        department: payload.department,
        creditHours: payload.creditHours,
        isCore: payload.isCore,
        isElective: payload.isElective,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: SubjectFormData): Promise<Subject> {
    try {
      const response = await apiClient.put<Subject>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        code: payload.code,
        description: payload.description,
        department: payload.department,
        creditHours: payload.creditHours,
        isCore: payload.isCore,
        isElective: payload.isElective,
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
        department: payload.department,
        creditHours: payload.creditHours,
        isCore: payload.isCore,
        isElective: payload.isElective,
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
