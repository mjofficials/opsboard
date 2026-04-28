export type TeamMemberStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED';

export interface TeamMember {
    id: string;
    email: string;
    organization_id: string;
    role: string;
    status: TeamMemberStatus;
    created_at: string;
}

export interface TeamMembersState {
    items: TeamMember[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}