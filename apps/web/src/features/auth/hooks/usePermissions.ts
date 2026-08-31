import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const usePermissions = () => {
  const { user } = useAuth();

  const currentRole = user?.role as UserRole | undefined;

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!currentRole) return false;
    return allowedRoles.includes(currentRole);
  };

  const isOwner = currentRole === 'OWNER';
  const isAdmin = currentRole === 'ADMIN' || isOwner; // Owners usually implicitly have admin rights
  const isMember = currentRole === 'MEMBER' || isAdmin;

  return {
    currentRole,
    hasRole,
    isOwner,
    isAdmin,
    isMember,
  };
};
