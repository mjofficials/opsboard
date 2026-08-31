import { apiClient } from '@/lib/api/apiClient';
import { Organization } from '../types';

export const settingsService = {
  async fetchOrganization(orgId: string): Promise<Organization> {
    const { data } = await apiClient.get<Organization>(`/organizations/${orgId}`);
    return data;
  },

  async updateOrganization(
    orgId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    const { data } = await apiClient.patch<Organization>(`/organizations/${orgId}`, updates);
    return data;
  },

  async uploadOrgAvatar(orgId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<{ url: string }>(`/organizations/${orgId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.url;
  },

  async deleteOrganization(orgId: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}`);
  },
};
