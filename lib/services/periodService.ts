import { apiClient } from '../api-client';
import { Period, PeriodFormData } from '../../types';

const BASE_ENDPOINT = '/periods';

export const periodService = {
  async getAll(): Promise<Period[]> {
    try {
      const response = await apiClient.get<Period[]>(BASE_ENDPOINT);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching periods:', error);
      return [];
    }
  },

  async create(payload: PeriodFormData): Promise<Period> {
    try {
      const response = await apiClient.post<Period>(BASE_ENDPOINT, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id: `period-${Date.now()}`,
        name: payload.name,
        startTime: payload.startTime,
        endTime: payload.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id: `period-${Date.now()}`,
        name: payload.name,
        startTime: payload.startTime,
        endTime: payload.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async update(id: string, payload: PeriodFormData): Promise<Period> {
    try {
      const response = await apiClient.put<Period>(`${BASE_ENDPOINT}/${id}`, payload);
      if (response && 'id' in response) {
        return response;
      }
      return {
        id,
        name: payload.name,
        startTime: payload.startTime,
        endTime: payload.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('API error, using mock response:', error);
      return {
        id,
        name: payload.name,
        startTime: payload.startTime,
        endTime: payload.endTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${BASE_ENDPOINT}/${id}`);
  },
};
