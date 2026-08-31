import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../services/teamService';
import { TeamMember } from '../types';

export const useTeams = () => {
    const queryClient = useQueryClient();

    const {
        data: teams,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['teams'],
        queryFn: teamService.getTeamMembers,
    });

    const invalidateTeams = () => {
        queryClient.invalidateQueries({ queryKey: ['teams'] });
    };

    const addMutation = useMutation({
        mutationFn: (teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) =>
            teamService.createTeamMember(teamMemberData),
        onSuccess: invalidateTeams,
    });

    const acceptMutation = useMutation({
        mutationFn: (id: string) => teamService.acceptTeamMember(id),
        onSuccess: invalidateTeams,
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => teamService.rejectTeamMember(id),
        onSuccess: invalidateTeams,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => teamService.deleteTeamMember(id),
        onSuccess: invalidateTeams,
    });

    // Wrapping mutations to maintain the same API return format `{ error }`
    const addTeamMember = async (teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            await addMutation.mutateAsync(teamMemberData);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const deleteTeamMember = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const acceptTeamMember = async (id: string) => {
        try {
            await acceptMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const rejectTeamMember = async (id: string) => {
        try {
            await rejectMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    return {
        teams,
        isLoading,
        isError,
        error: error ? (error as Error).message : null,
        addTeamMember,
        deleteTeamMember,
        acceptTeamMember,
        rejectTeamMember,
        refreshTeams: refetch,
    };
};
