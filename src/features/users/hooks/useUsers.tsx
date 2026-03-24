import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { userService } from '../services/userService';

export const useUsers = () => {
    const queryClient = useQueryClient();

    const {
        data: users,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
    });

    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    const addMutation = useMutation({
        mutationFn: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) =>
            userService.createUser(userData),
        onSuccess: invalidateUsers,
    });

    const editMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
            userService.updateUser(id, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.removeQueries({ queryKey: ['users', variables] });
        },
    });

    // Wrapping mutations to maintain the same API return format `{ error }`
    const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            await addMutation.mutateAsync(userData);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const editUser = async (id: string, updates: Partial<User>) => {
        try {
            await editMutation.mutateAsync({ id, updates });
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    const removeUser = async (id: string) => {
        try {
            await removeMutation.mutateAsync(id);
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    return {
        users,
        isLoading,
        isError,
        error: error ? (error as Error).message : null,
        addUser,
        editUser,
        removeUser,
        refreshUsers: refetch,
    };
};

export const useUser = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['users', id],
        queryFn: () => userService.getUser(id),
        initialData: () => {
            // Find the user in the existing 'users' list cache
            const users = queryClient.getQueryData<User[]>(['users']);
            return users?.find((user) => user.id === id);
        },
    });
};
