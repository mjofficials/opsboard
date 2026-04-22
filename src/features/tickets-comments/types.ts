export interface TicketComment {
    id: string;
    ticket_id?: string;
    user_id?: string;
    comment: string;
    created_at?: string;
    updated_at?: string;
}