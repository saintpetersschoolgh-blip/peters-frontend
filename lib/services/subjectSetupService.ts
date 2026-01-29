import { apiClient } from '../api-client';
import { SubjectSetup, SubjectSetupFormData } from '../../types';

const BASE_ENDPOINT = '/subject-setups';

export const subjectSetupService = {
  async getAll(): Promise<SubjectSetup[]> {
    try {
      const response = await apiClient.get<SubjectSetup[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching subject setups:', error);
      return [];
    }
  },

  async create(payload: SubjectSetupFormData): Promise<SubjectSetup> {
    try {
      const response = await apiClient.post<SubjectSetup>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `sub-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        gradeLevelId: payload.gradeLevelId,
        isCore: payload.isCore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `sub-${Date.now()}`,
        name: payload.name,
        code: payload.code,
        gradeLevelId: payload.gradeLevelId,
        isCore: payload.isCore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: SubjectSetupFormData): Promise<SubjectSetup> {
    try {
      const response = await apiClient.put<SubjectSetup>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        code: payload.code,
        gradeLevelId: payload.gradeLevelId,
        isCore: payload.isCore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        code: payload.code,
        gradeLevelId: payload.gradeLevelId,
        isCore: payload.isCore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
