import { createClient } from '@/lib/supabase/client';
import { TicketComment } from '../types';
import { store } from '@/store/store';

export const ticketCommentsService = {
    async getTicketsComments(ticketId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('ticket_comments')
            .select(`*, user:profiles!ticket_comments_user_id_fkey(name)`)
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as TicketComment[];
    },

    async getTicketComment(id: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('ticket_comments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as TicketComment;
    },

    async createTicketComment(ticketComment: Omit<TicketComment, 'id' | 'created_at' | 'updated_at'>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('ticket_comments')
            .insert([ticketComment])
            .select()
            .single();

        if (error) throw error;
        return data as TicketComment;
    },

    async updateTicketComment(id: string, updates: Partial<TicketComment>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('ticket_comments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as TicketComment;
    },

    async deleteTicketComment(id: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('ticket_comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
