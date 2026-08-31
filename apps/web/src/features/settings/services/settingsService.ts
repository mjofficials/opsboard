import { createClient } from '@/lib/supabase/client';
import { Organization } from '../types';

export const settingsService = {
  async fetchOrganization(orgId: string): Promise<Organization> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    if (error) throw error;
    return data as Organization;
  },

  async updateOrganization(
    orgId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single();
    if (error) throw error;
    return data as Organization;
  },

  async uploadOrgAvatar(orgId: string, file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${orgId}/logo.${ext}`;
    const { error } = await supabase.storage
      .from('organization-logos')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('organization-logos').getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteOrganization(orgId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', orgId);
    if (error) throw error;
  },
};
