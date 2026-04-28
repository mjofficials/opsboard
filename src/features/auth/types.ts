import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface OrganizationMembership {
  organization_id: string;
  role: string;
  organizations?: {
    name: string;
    logo_url?: string | null;
  } | null;
}

export interface User extends Omit<SupabaseUser, 'user_metadata'> {
  organization_id?: string;
  role?: string;
  organizations?: OrganizationMembership[];
  user_metadata?: {
    name?: string;
  } & SupabaseUser['user_metadata'];
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type { Session };