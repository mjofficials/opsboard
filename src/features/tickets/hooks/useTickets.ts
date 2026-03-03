import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ticketService } from '../services/ticketService';
import { fetchTickets } from '../ticketSlice';
import { Ticket } from '../types';

export const useTickets = () => {
  const dispatch = useAppDispatch();
  const { items: tickets, status, error } = useAppSelector((state) => state.tickets);

  const loadTickets = useCallback(async () => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Optionally load automatically when component mounts, 
  // though for some apps you may choose to invoke this manually via pages.
  useEffect(() => {
    if (status === 'idle') {
       loadTickets();
    }
  }, [status, loadTickets]);

  const addTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await ticketService.createTicket(ticketData);
      // reload tickets list locally immediately upon creation success.
      await loadTickets(); 
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const editTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      await ticketService.updateTicket(id, updates);
      await loadTickets();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const removeTicket = async (id: string) => {
    try {
      await ticketService.deleteTicket(id);
      await loadTickets();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    tickets,
    isLoading: status === 'loading',
    isError: status === 'failed',
    error,
    addTicket,
    editTicket,
    removeTicket,
    refreshTickets: loadTickets,
  };
};
