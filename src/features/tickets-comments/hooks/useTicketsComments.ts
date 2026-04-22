import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketCommentsService } from '../services/ticketsCommentsService';
import { TicketComment } from '../types';

export const useTicketsComments = () => {
    const queryClient = useQueryClient();

    const {
        data: ticketsComments,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['tickets-comments'],
        queryFn: ticketCommentsService.getTicketsComments,
    });

    const invalidateTicketsComments = () => {
        queryClient.invalidateQueries({ queryKey: ['tickets-comments'] });
    };

    const addMutation = useMutation({
        mutationFn: (ticketData: Omit<TicketComment, 'id' | 'created_at' | 'updated_at'>) =>
            ticketCommentsService.createTicketComment(ticketData),
        onSuccess: invalidateTicketsComments,
    });

    const editMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<TicketComment> }) =>
            ticketCommentsService.updateTicketComment(id, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets-comments'] });
            queryClient.invalidateQueries({ queryKey: ['tickets-comments', variables.id] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => ticketCommentsService.deleteTicketComment(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets-comments'] });
            queryClient.removeQueries({ queryKey: ['tickets-comments', variables] });
        },
    });

    // Wrapping mutations to maintain the same API return format `{ error }`
    const addTicketComment = async (ticketCommentData: Omit<TicketComment, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            await addMutation.mutateAsync(ticketCommentData);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const editTicketComment = async (id: string, updates: Partial<TicketComment>) => {
        try {
            await editMutation.mutateAsync({ id, updates });
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const removeTicketComment = async (id: string) => {
        try {
            await removeMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    return {
        ticketsComments,
        isLoading,
        isError,
        error: error ? (error as Error).message : null,
        addTicketComment,
        editTicketComment,
        removeTicketComment,
        refreshTicketsComments: refetch,
    };
};

export const useTicketComment = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['tickets', id],
        queryFn: () => ticketCommentsService.getTicketComment(id),
        enabled: !!id,
        initialData: () => {
            if (!id) return undefined;
            // Find the ticket in the existing 'tickets-comments' list cache
            const ticketComments = queryClient.getQueryData<TicketComment[]>(['tickets-comments']);
            return ticketComments?.find((t) => t.id === id);
        },
    });
};
