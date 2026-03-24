import { createClient } from '@/lib/supabase/client';
import { TeamMember } from '../types';

export const teamService = {
  async getTeamMembers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TeamMember[];
  },

  async createTeamMember(teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        email: teamMemberData.email,
        role: teamMemberData.role,
        organization_id: teamMemberData.organization_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TeamMember;
  },
};
