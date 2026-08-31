import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authService } from '../services/authService';
import { setAuthSession, setAuthLoading, setAuthError, clearAuthSession } from '../authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, session, status, error, isInitialized } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const initAuth = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      dispatch(setAuthLoading());
    }
    try {
      // In this NestJS version, we assume the user is logged in if we can fetch their profile
      // For now we will just assume if the cookie exists it works, but we should actually fetch /api/auth/me
      // or we can rely on login returning the user.
      // If we don't have a backend endpoint for /auth/me yet, let's just clear for now unless we have user state
      if (!user) {
        queryClient.clear();
        dispatch(clearAuthSession());
      } else {
        dispatch(setAuthSession({ session: null as any, user }));
      }
    } catch (err: any) {
      if (!options?.silent) {
        dispatch(setAuthError(err.message));
      }
    }
  }, [dispatch, queryClient, user]);

  const initRef = useRef(false);

  useEffect(() => {
    if (!isInitialized && !initRef.current) {
      initRef.current = true;
      initAuth();
    }
  }, [initAuth, isInitialized]);

  const login = async (email: string, password: string) => {
    dispatch(setAuthLoading());
    const { data, error } = await authService.login(email, password);
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    dispatch(setAuthSession({ session: null as any, user: data.user as any }));
    return { data };
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch(setAuthLoading());
    const { data, error } = await authService.register(name, email, password);
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    return { data };
  };

  const logout = async () => {
    dispatch(setAuthLoading());
    const { error } = await authService.logout();
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    queryClient.clear();
    dispatch(clearAuthSession());
  };

  const createOrganization = async (name: string) => {
    if (!user?.id) return { error: new Error('Not authenticated') };
    dispatch(setAuthLoading());
    const { data, error } = await authService.createOrganization(name);
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    // Update user locally
    dispatch(setAuthSession({ session: null as any, user: { ...user, organization_id: data.id } as any }));
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
