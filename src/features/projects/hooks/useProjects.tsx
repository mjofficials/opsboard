import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '../types';
import { projectService } from '../services/projectService';

export const useProjects = () => {
    const queryClient = useQueryClient();

    const {
        data: projects,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['projects'],
        queryFn: projectService.getProjects,
    });

    const invalidateProjects = () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const addMutation = useMutation({
        mutationFn: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
            projectService.createProject(projectData),
        onSuccess: invalidateProjects,
    });

    const editMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) =>
            projectService.updateProject(id, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => projectService.deleteProject(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.removeQueries({ queryKey: ['projects', variables] });
        },
    });

    // Wrapping mutations to maintain the same API return format `{ error }`
    const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            await addMutation.mutateAsync(projectData);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const editProject = async (id: string, updates: Partial<Project>) => {
        try {
            await editMutation.mutateAsync({ id, updates });
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const removeProject = async (id: string) => {
        try {
            await removeMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    return {
        projects,
        isLoading,
        isError,
        error: error ? (error as Error).message : null,
        addProject,
        editProject,
        removeProject,
        refreshProjects: refetch,
    };
};

export const useProject = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => projectService.getProject(id),
        enabled: !!id,
        initialData: () => {
            if (!id) return undefined;
            // Find the project in the existing 'projects' list cache
            const projects = queryClient.getQueryData<Project[]>(['projects']);
            return projects?.find((project) => project.id === id);
        },
    });
};
