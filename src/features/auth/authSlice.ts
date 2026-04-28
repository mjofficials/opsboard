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
    setActiveOrganization(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.organization_id = action.payload;
        // Also update role based on the selected organization if we have the organizations list
        const selectedOrg = state.user.organizations?.find(
          (org) => org.organization_id === action.payload
        );
        if (selectedOrg) {
          state.user.role = selectedOrg.role;
        }
      }
    },
  },
});

export const {
  setAuthSession,
  setAuthLoading,
  setAuthError,
  clearAuthSession,
  setActiveOrganization
} = authSlice.actions;
export default authSlice.reducer;