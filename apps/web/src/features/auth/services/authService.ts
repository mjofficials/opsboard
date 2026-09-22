import { apiClient } from '@/lib/api/apiClient';
import { isAxiosError } from 'axios';

export const authService = {
  async login(email: string, password: string) {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      return { data, error: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { data: null, error: error.response?.data || error };
      }
      return { data: null, error };
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      return { data, error: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { data: null, error: error.response?.data || error };
      }
      return { data: null, error };
    }
  },

  async logout() {
    try {
      const { data } = await apiClient.post('/auth/logout');
      return { data, error: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { data: null, error: error.response?.data || error };
      }
      return { data: null, error };
    }
  },

  async getCurrentSession() {
    try {
      const { data } = await apiClient.get('/auth/me');
      return { data, error: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { data: null, error: error.response?.data || error };
      }
      return { data: null, error };
    }
  },

  async createOrganization(name: string) {
    try {
      const { data } = await apiClient.post('/organizations', { name });
      return { data, error: null };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { data: null, error: error.response?.data || error };
      }
      return { data: null, error };
    }
  },
};