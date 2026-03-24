import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  organization_id?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type { Session };