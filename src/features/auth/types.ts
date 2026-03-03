import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type { User, Session };