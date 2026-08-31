export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface UsersState {
    items: User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}