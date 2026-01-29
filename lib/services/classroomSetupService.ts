import { apiClient } from '../api-client';
import { ClassroomSetup, ClassroomSetupFormData } from '../../types';

const BASE_ENDPOINT = '/classroom-setups';

export const classroomSetupService = {
  async getAll(): Promise<ClassroomSetup[]> {
    try {
      const response = await apiClient.get<ClassroomSetup[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching classroom setups:', error);
      return [];
    }
  },

  async create(payload: ClassroomSetupFormData): Promise<ClassroomSetup> {
    try {
      const response = await apiClient.post<ClassroomSetup>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `cr-${Date.now()}`,
        name: payload.name,
        gradeLevelId: payload.gradeLevelId,
        capacity: payload.capacity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `cr-${Date.now()}`,
        name: payload.name,
        gradeLevelId: payload.gradeLevelId,
        capacity: payload.capacity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: ClassroomSetupFormData): Promise<ClassroomSetup> {
    try {
      const response = await apiClient.put<ClassroomSetup>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        gradeLevelId: payload.gradeLevelId,
        capacity: payload.capacity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        gradeLevelId: payload.gradeLevelId,
        capacity: payload.capacity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
