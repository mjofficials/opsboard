export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface OrganizationMembership {
  organizationId: string;
  role: UserRole;
  organizations?: {
    name: string;
    logo_path?: string | null;
  } | null;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  organizationId?: string;
  role?: UserRole;
  organizations?: OrganizationMembership[];
}

export interface Session {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}