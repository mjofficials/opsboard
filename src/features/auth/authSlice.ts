import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Session } from './types';

const initialState: AuthState = {
  user: null,
  session: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession(state, action: PayloadAction<{ session: Session | null; user: User | null }>) {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.status = 'succeeded';
      state.error = null;
    },
    setAuthLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearAuthSession(state) {
      state.session = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setAuthSession, setAuthLoading, setAuthError, clearAuthSession } = authSlice.actions;
export default authSlice.reducer;