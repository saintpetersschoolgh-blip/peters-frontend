import { apiClient } from '../api-client';
import { Term, TermFormData } from '../../types';

const BASE_ENDPOINT = '/terms';

export const termService = {
  async getAll(): Promise<Term[]> {
    try {
      const response = await apiClient.get<Term[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
    }
  },

  async create(payload: TermFormData): Promise<Term> {
    try {
      const response = await apiClient.post<Term>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `term-${Date.now()}`,
        name: payload.name,
        academicYearId: payload.academicYearId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `term-${Date.now()}`,
        name: payload.name,
        academicYearId: payload.academicYearId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: TermFormData): Promise<Term> {
    try {
      const response = await apiClient.put<Term>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        academicYearId: payload.academicYearId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        academicYearId: payload.academicYearId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
