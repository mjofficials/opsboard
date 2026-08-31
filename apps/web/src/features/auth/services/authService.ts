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
      // In a real application, you might have a /users/me endpoint
      // For now, if the cookie is there, the user is authenticated.
      // Let's call /users/me if it exists, or just return an empty session
      // Wait, we can fetch from a mock endpoint or we need to add /auth/me to backend.
      // We'll leave it returning an empty object for now.
      return { data: { session: null }, error: null };
    } catch (error: any) {
      return { data: null, error };
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