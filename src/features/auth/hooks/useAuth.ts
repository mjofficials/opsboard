import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authService } from '../services/authService';
import {
  setAuthSession,
  setAuthLoading,
  setAuthError,
  clearAuthSession,
} from '../authSlice';
import { createClient } from '@/lib/supabase/client';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, session, status, error } = useAppSelector((state) => state.auth);

  const initAuth = useCallback(async () => {
    dispatch(setAuthLoading());
    try {
      const { data: { session }, error } = await authService.getCurrentSession();
      if (error) throw error;
      
      if (session) {
        dispatch(setAuthSession({ session, user: session.user }));
      } else {
         dispatch(clearAuthSession());
      }
    } catch (err: any) {
      dispatch(setAuthError(err.message));
    }
  }, [dispatch]);

  // Set up auth state listener
  useEffect(() => {
    initAuth();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          dispatch(setAuthSession({ session, user: session.user }));
        } else {
          dispatch(clearAuthSession());
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, initAuth]);

  const login = async (email: string, password: string) => {
    dispatch(setAuthLoading());
    const { data, error } = await authService.login(email, password);
    if (error) {
      dispatch(setAuthError(error.message));
      return { error };
    }
    dispatch(setAuthSession({ session: data.session, user: data.user }));
    return { data };
  };

  const register = async (email: string, password: string) => {
    dispatch(setAuthLoading());
    const { data, error } = await authService.register(email, password);
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
    dispatch(clearAuthSession());
  };

  return {
    user,
    session,
    isLoading: status === 'loading',
    error,
    login,
    register,
    logout,
  };
};