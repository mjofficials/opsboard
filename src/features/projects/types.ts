export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    created_by: string; // User ID
    assignee_id?: string; // User ID
    created_at: string;
    updated_at: string;
}

export interface ProjectsState {
    items: Project[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}