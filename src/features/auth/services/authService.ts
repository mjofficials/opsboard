import { createClient } from '@/lib/supabase/client';

export const authService = {
  async login(email: string, password: string) {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { data: authData, error: authError };
    }

    const { data: orgData } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', authData.user.id)
      .single();

    if (orgData) {
      return {
        data: {
          ...authData,
          session: authData.session,
          user: {
            ...authData.user,
            organization_id: orgData.organization_id,
            role: orgData.role,
          }
        },
        error: null
      };
    }

    return { data: authData, error: null };
  },

  async register(name: string, email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
  },

  async logout() {
    const supabase = createClient();
    return supabase.auth.signOut();
  },

  async getCurrentSession() {
    const supabase = createClient();
    const { data: sessionData, error } = await supabase.auth.getSession();
    console.log('sessionData', sessionData);
    if (sessionData.session?.user) {
      const { data: orgData } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (orgData) {
        return {
          data: {
            ...sessionData,
            session: {
              ...sessionData.session,
              user: {
                ...sessionData.session.user,
                organization_id: orgData.organization_id,
                role: orgData.role,
              }
            }
          },
          error
        };
      }
    }

    return { data: sessionData, error };
  },

  async getCurrentUser() {
    const supabase = createClient();
    return supabase.auth.getUser();
  },
};