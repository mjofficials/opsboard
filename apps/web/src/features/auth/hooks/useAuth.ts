import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authService } from '../services/authService';
import { setAuthSession, setAuthLoading, setAuthError, clearAuthSession } from '../authSlice';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, session, status, error, isInitialized } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const initAuth = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      dispatch(setAuthLoading());
    }
    try {
      const {
        data: { session },
        error,
      } = await authService.getCurrentSession();
      if (error) throw error;

      if (session) {
        dispatch(setAuthSession({ session, user: session.user as any }));
      } else {
        queryClient.clear();
        dispatch(clearAuthSession());
      }
    } catch (err: any) {
      if (!options?.silent) {
        dispatch(setAuthError(err.message));
      }
    }
  }, [dispatch, queryClient]);

  // Keep track of whether we've initialized auth to prevent duplicate calls
  const initRef = useRef(false);
  const sessionRef = useRef(session);

  // Keep session ref up-to-date to avoid stale closures in event listener
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // 1. Initial auth run on mount
  useEffect(() => {
    if (!isInitialized && !initRef.current) {
      initRef.current = true;
      initAuth();
    }
  }, [initAuth, isInitialized]);

  // 2. Separate auth state listener to avoid subscription churn
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (session) {
        const currentSession = sessionRef.current;
        const tokenChanged = !currentSession || currentSession.access_token !== session.access_token;
        
        if (tokenChanged) {
          initAuth({ silent: !!currentSession });
        }
      } else {
        queryClient.clear();
        dispatch(clearAuthSession());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, initAuth, queryClient]);

  const login = async (email: string, password: string) => {
    dispatch(setAuthLoading());
    const { data, error } = await authService.login(email, password);
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    dispatch(setAuthSession({ session: data.session, user: data.user as any }));
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
    // Re-hydrate Redux: getCurrentSession will now find the org and decorate user
    await initAuth();
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
