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

  const initAuth = useCallback(async () => {
    dispatch(setAuthLoading());
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
      dispatch(setAuthError(err.message));
    }
  }, [dispatch, queryClient]);

  // Keep track of whether we've initialized auth to prevent duplicate calls
  const initRef = useRef(false);

  // Set up auth state listener
  useEffect(() => {
    if (status === 'idle' && !initRef.current) {
      initRef.current = true;
      initAuth();
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return;

      if (session) {
        // Do not dispatch raw session, as it lacks role/org data.
        // initAuth will fetch the decorated session and update Redux without clearing the current user.
        initAuth();
      } else {
        queryClient.clear();
        dispatch(clearAuthSession());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [status, dispatch, initAuth, queryClient]);

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
