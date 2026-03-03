import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // we can add other feature reducers here later e.g., tickets, projects
});

export default rootReducer;