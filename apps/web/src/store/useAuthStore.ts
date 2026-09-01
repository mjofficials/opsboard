import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Session, User } from '@/features/auth/types';

interface AuthStore extends AuthState {
  setAuthSession: (payload: { session: Session | null; user: User | null }) => void;
  setAuthLoading: () => void;
  setAuthError: (error: string) => void;
  clearAuthSession: () => void;
  setActiveOrganization: (orgId: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      status: 'idle',
      error: null,
      isInitialized: false,

      setAuthSession: (payload) => set((state) => {
        let newUser = payload.user;
        if (newUser && typeof window !== 'undefined') {
          const storedOrgId = localStorage.getItem('activeOrgId');
          if (storedOrgId) {
            const isMember = newUser.organizations?.some(
              (org) => org.organization_id === storedOrgId
            );
            if (isMember) {
              newUser = { ...newUser, organization_id: storedOrgId };
              const selectedOrg = newUser.organizations?.find(
                (org) => org.organization_id === storedOrgId
              );
              if (selectedOrg) {
                newUser.role = selectedOrg.role;
              }
            } else {
              localStorage.removeItem('activeOrgId');
            }
          } else if (newUser.organization_id) {
            localStorage.setItem('activeOrgId', newUser.organization_id);
          }
        }
        return {
          session: payload.session,
          user: newUser,
          status: 'succeeded',
          isInitialized: true,
          error: null,
        };
      }),

      setAuthLoading: () => set({ status: 'loading', error: null }),

      setAuthError: (error) => set({ status: 'failed', isInitialized: true, error }),

      clearAuthSession: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('activeOrgId');
        }
        set({
          session: null,
          user: null,
          status: 'idle',
          isInitialized: true,
          error: null,
        });
      },

      setActiveOrganization: (orgId: string) => set((state) => {
        if (!state.user) return state;
        
        const newUser = { ...state.user, organization_id: orgId };
        const selectedOrg = newUser.organizations?.find(
          (org) => org.organization_id === orgId
        );
        if (selectedOrg) {
          newUser.role = selectedOrg.role;
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('activeOrgId', orgId);
        }

        return { user: newUser };
      }),
    }),
    {
      name: 'auth-storage', // zustand persist handles localStorage for the store
      partialize: (state) => ({ user: state.user, session: state.session }), // only persist user/session
    }
  )
);
