import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { Ticket } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

export const useTickets = () => {
  const queryClient = useQueryClient();
  const activeOrgId = useAuthStore((state) => state.user?.organization_id);

  const {
    data: tickets,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tickets', activeOrgId],
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
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['tickets', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => ticketService.deleteTicket(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.removeQueries({ queryKey: ['tickets', variables] });
    },
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

export const useTicket = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      // Find the ticket in the existing 'tickets' list cache
      const tickets = queryClient.getQueryData<Ticket[]>(['tickets']);
      return tickets?.find((t) => t.id === id);
    },
  });
};
