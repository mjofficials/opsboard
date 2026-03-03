export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_by: string; // User ID
  assignee_id?: string; // User ID
  created_at: string;
  updated_at: string;
}

export interface TicketsState {
  items: Ticket[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}