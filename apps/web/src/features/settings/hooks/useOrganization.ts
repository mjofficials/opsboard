import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import { Organization } from '../types';

export const useOrganization = (orgId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => settingsService.fetchOrganization(orgId!),
    enabled: !!orgId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['organization', orgId] });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Organization>) =>
      settingsService.updateOrganization(orgId!, updates),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => settingsService.deleteOrganization(orgId!),
  });

  const updateOrganization = async (updates: Partial<Organization>) => {
    try {
      await updateMutation.mutateAsync(updates);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteOrganization = async () => {
    try {
      await deleteMutation.mutateAsync();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    organization,
    isLoading,
    isError,
    error: error ? (error as Error).message : null,
    updateOrganization,
    deleteOrganization,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
