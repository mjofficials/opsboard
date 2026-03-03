import { createClient } from '@/lib/supabase/client';

export const authService = {
  async login(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async register(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signUp({
      email,
      password,
    });
  },

  async logout() {
    const supabase = createClient();
    return supabase.auth.signOut();
  },

  async getCurrentSession() {
    const supabase = createClient();
    return supabase.auth.getSession();
  },

  async getCurrentUser() {
    const supabase = createClient();
    return supabase.auth.getUser();
  },
};