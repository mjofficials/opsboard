import { apiClient } from '@/lib/api/apiClient';
import { TicketComment } from '../types';

export const ticketCommentsService = {
    async getTicketsComments(ticketId: string) {
        const { data } = await apiClient.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
        return data;
    },

    async getTicketComment(id: string) {
        const { data } = await apiClient.get<TicketComment>(`/ticket-comments/${id}`);
        return data;
    },

    async createTicketComment(ticketComment: Omit<TicketComment, 'id' | 'created_at' | 'updated_at'>) {
        const { data } = await apiClient.post<TicketComment>('/ticket-comments', ticketComment);
        return data;
    },

    async updateTicketComment(id: string, updates: Partial<TicketComment>) {
        const { data } = await apiClient.patch<TicketComment>(`/ticket-comments/${id}`, updates);
        return data;
    },

    async deleteTicketComment(id: string) {
        await apiClient.delete(`/ticket-comments/${id}`);
    }
};
