import { createClient } from '@/lib/supabase/client';
import { Project } from '../types';

export const projectService = {
  async getProjects() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async getProject(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_project_with_member', {
      p_name: project.name,
      p_description: project.description,
      p_org_id: project.organization_id,
      p_user_id: project.created_by,
      p_status: project.status,
    });

    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
