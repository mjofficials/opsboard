import { apiClient } from '@/lib/api/apiClient';
import { Project } from '../types';

export const projectService = {
  async getProjects() {
    const { data } = await apiClient.get<Project[]>('/projects');
    return data;
  },

  async getProject(id: string) {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await apiClient.post<Project>('/projects', project);
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, updates);
    return data;
  },

  async deleteProject(id: string) {
    await apiClient.delete(`/projects/${id}`);
  }
};
