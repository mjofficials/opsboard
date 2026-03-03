import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import ticketReducer from '@/features/tickets/ticketSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketReducer,
});

export default rootReducer;