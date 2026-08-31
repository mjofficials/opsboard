import { apiClient } from '@/lib/api/apiClient';
import { User } from '../types';

export const userService = {
  async getUsers() {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async getUser(id: string) {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await apiClient.post<User>('/users', user);
    return data;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data } = await apiClient.patch<User>(`/users/${id}`, updates);
    return data;
  },

  async deleteUser(id: string) {
    await apiClient.delete(`/users/${id}`);
  }
};
