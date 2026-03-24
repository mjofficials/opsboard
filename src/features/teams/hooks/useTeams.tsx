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

    // Wrapping mutations to maintain the same API return format `{ error }`
    const addTeamMember = async (teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            await addMutation.mutateAsync(teamMemberData);
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
        refreshTeams: refetch,
    };
};
