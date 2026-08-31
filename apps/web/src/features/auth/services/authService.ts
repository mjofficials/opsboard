import { apiClient } from '@/lib/api/apiClient';

export const authService = {
  async login(email: string, password: string) {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || error };
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || error };
    }
  },

  async logout() {
    try {
      const { data } = await apiClient.post('/auth/logout');
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || error };
    }
  },

  async getCurrentSession() {
    try {
      const { data } = await apiClient.get('/auth/me');
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || error };
    }
  },

  async createOrganization(name: string) {
    try {
      const { data } = await apiClient.post('/organizations', { name });
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || error };
    }
  },
};