import { apiClient } from '../../../../../lib/api-client';
import { GradeLevel, GradeLevelFormData } from '../types';

const BASE_ENDPOINT = '/grade-levels';

export const gradeLevelService = {
  async getAll(): Promise<GradeLevel[]> {
    try {
      const response = await apiClient.get<GradeLevel[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching grade levels:', error);
      return [];
    }
  },

  async create(payload: GradeLevelFormData): Promise<GradeLevel> {
    try {
      const response = await apiClient.post<GradeLevel>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `gl-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `gl-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        description: payload.description,
      };
    }
  },

  async update(id: string, payload: GradeLevelFormData): Promise<GradeLevel> {
    try {
      const response = await apiClient.put<GradeLevel>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        code: payload.code,
        description: payload.description,
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        code: payload.code,
        description: payload.description,
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
