import { createClient } from '@/lib/supabase/client';
import { Ticket } from '../types';

export const ticketService = {
  async getTickets() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tickets_with_project_details')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: user, error: userError } = await supabase.auth.getUser()

    console.log("DATA:", data);
    console.log("USER:", user?.user?.id);

    if (error) throw error;
    return data as Ticket[];
  },

  async getTicket(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticket])
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  async updateTicket(id: string, updates: Partial<Ticket>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  async deleteTicket(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('tickets')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
  }
};
