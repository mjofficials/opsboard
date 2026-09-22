export interface TicketComment {
    id: string;
    ticketId?: string;
    userId?: string;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
    user?: TicketCommentUser;
}

interface TicketCommentUser {
    name: string;
}