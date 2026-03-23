import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { Ticket } from '../types';

export const useTickets = () => {
  const queryClient = useQueryClient();

  const {
    data: tickets,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getTickets,
  });

  const invalidateTickets = () => {
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  };

  const addMutation = useMutation({
    mutationFn: (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => 
      ticketService.createTicket(ticketData),
    onSuccess: invalidateTickets,
  });

  const editMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Ticket> }) => 
      ticketService.updateTicket(id, updates),
    onSuccess: invalidateTickets,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => ticketService.deleteTicket(id),
    onSuccess: invalidateTickets,
  });

  // Wrapping mutations to maintain the same API return format `{ error }`
  const addTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addMutation.mutateAsync(ticketData);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const editTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      await editMutation.mutateAsync({ id, updates });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const removeTicket = async (id: string) => {
    try {
      await removeMutation.mutateAsync(id);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    tickets,
    isLoading,
    isError,
    error: error ? (error as Error).message : null,
    addTicket,
    editTicket,
    removeTicket,
    refreshTickets: refetch,
  };
};
