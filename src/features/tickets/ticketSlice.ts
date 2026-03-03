import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TicketsState, Ticket } from './types';
import { createClient } from '@/lib/supabase/client';

const initialState: TicketsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tickets')
        .select('*');

      if (error) throw error;
      return data as Ticket[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
      setTickets(state, action: PayloadAction<Ticket[]>) {
        state.items = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTickets.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchTickets.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchTickets.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
        });
    },
  });
  
  export const { setTickets } = ticketSlice.actions;
  export default ticketSlice.reducer;
