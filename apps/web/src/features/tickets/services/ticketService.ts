import { apiClient } from '@/lib/api/apiClient';
import { Ticket } from '../types';

export const ticketService = {
  async getTickets() {
    const { data } = await apiClient.get<Ticket[]>('/tickets');
    return data;
  },

  async getTicket(id: string) {
    const { data } = await apiClient.get<Ticket>(`/tickets/${id}`);
    return data;
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await apiClient.post<Ticket>('/tickets', ticket);
    return data;
  },

  async updateTicket(id: string, updates: Partial<Ticket>) {
    const { data } = await apiClient.patch<Ticket>(`/tickets/${id}`, updates);
    return data;
  },

  async deleteTicket(id: string) {
    await apiClient.delete(`/tickets/${id}`);
  }
};
