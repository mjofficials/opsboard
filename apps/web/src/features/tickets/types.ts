export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  project_id: string;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketsState {
  items: Ticket[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}