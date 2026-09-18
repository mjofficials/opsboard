export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  projectId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsState {
  items: Ticket[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}