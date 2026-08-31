import { apiClient } from '@/lib/api/apiClient';
import { TeamMember } from '../types';

export const teamService = {
  async getTeamMembers() {
    const { data } = await apiClient.get<TeamMember[]>('/teams');
    return data;
  },

  async createTeamMember(teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await apiClient.post<TeamMember>('/teams', teamMemberData);
    return data;
  },

  async acceptTeamMember(id: string) {
    const { data } = await apiClient.post<TeamMember>(`/teams/${id}/accept`);
    return data;
  },

  async rejectTeamMember(id: string) {
    const { data } = await apiClient.post<TeamMember>(`/teams/${id}/reject`);
    return data;
  },

  async deleteTeamMember(id: string) {
    await apiClient.delete(`/teams/${id}`);
    return { error: null };
  },
};
