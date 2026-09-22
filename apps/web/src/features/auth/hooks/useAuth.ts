import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '../services/authService';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const { user, session, status, error, isInitialized, setAuthLoading, setAuthSession, clearAuthSession, setAuthError, clearAuthError } = useAuthStore();
  const queryClient = useQueryClient();

  const initAuth = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setAuthLoading();
    }
    try {
      const { data, error } = await authService.getCurrentSession();
      
      if (error || !data?.user) {
        queryClient.clear();
        clearAuthSession();
      } else {
        setAuthSession({ session: null, user: data.user });
      }
    } catch (err: unknown) {
      if (!options?.silent) {
        setAuthError(err instanceof Error ? err.message : String(err));
      }
    }
  }, [setAuthLoading, setAuthSession, clearAuthSession, setAuthError, queryClient]);

  const initRef = useRef(false);

  useEffect(() => {
    if (!isInitialized && !initRef.current) {
      initRef.current = true;
      initAuth();
    }
  }, [initAuth, isInitialized]);

  const login = async (email: string, password: string) => {
    setAuthLoading();
    const { data, error } = await authService.login(email, password);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    setAuthSession({ session: null, user: data.user as unknown as NonNullable<typeof user> });
    return { data };
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthLoading();
    const { data, error } = await authService.register(name, email, password);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    setAuthSession({ session: null, user: data.user as unknown as NonNullable<typeof user> });
    return { data };
  };

  const logout = async () => {
    setAuthLoading();
    const { error } = await authService.logout();
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    queryClient.clear();
    clearAuthSession();
  };

  const createOrganization = async (name: string) => {
    if (!user?.id) return { error: new Error('Not authenticated') };
    setAuthLoading();
    const { data, error } = await authService.createOrganization(name);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    // Update user locally
    setAuthSession({ session: null, user: { ...user, organizationId: data.id } as NonNullable<typeof user> });
    return { data };
  };

  return {
    user,
    session,
    isLoading: status === 'loading',
    isInitialized,
    error,
    login,
    register,
    logout,
    createOrganization,
    clearAuthError,
  };
};
