import { createClient } from '@/lib/supabase/client';
import { User } from '../types';

export const userService = {
  async getUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  async getUser(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as User;
  },

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_user_with_member', {
      p_name: user.name,
      p_email: user.email,
      p_role: user.role,
      p_status: user.status,
    });

    if (error) throw error;
    return data as User;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async deleteUser(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
