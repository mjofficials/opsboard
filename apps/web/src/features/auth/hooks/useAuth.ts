import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '../services/authService';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export const useAuth = () => {
  const { user, session, status, error, isInitialized, setAuthLoading, setAuthSession, clearAuthSession, setAuthError } = useAuthStore();
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
        setAuthSession({ session: null as any, user: data.user });
      }
    } catch (err: any) {
      if (!options?.silent) {
        setAuthError(err.message);
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
    setAuthSession({ session: null as any, user: data.user as any });
    return { data };
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthLoading();
    const { data, error } = await authService.register(name, email, password);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    setAuthSession({ session: null as any, user: data.user as any });
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
    setAuthSession({ session: null as any, user: { ...user, organization_id: data.id } as any });
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
  };
};
