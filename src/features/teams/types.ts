export type TeamMemberStatus = 'ACTIVE' | 'INACTIVE';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: TeamMemberStatus;
    created_by: string; // User ID
    organization_id: string; // Organization ID
    assignee_id?: string; // User ID
    created_at: string;
    updated_at: string;
}

export interface TeamMembersState {
    items: TeamMember[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}