"use client";

import React from 'react';
import { UserRole } from '@/features/auth/types';
import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { Lock } from 'lucide-react';

interface CanAccessProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({ roles, children, fallback }) => {
  const { hasRole, currentRole } = usePermissions();

  // If roles array is empty, we assume it's open to any authenticated user
  const isAllowed = roles.length === 0 || hasRole(roles);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border bg-muted/20">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold mb-1">Access Restricted</h3>
      <p className="text-xs text-muted-foreground max-w-[250px]">
        You don't have permission to view this content. Required role: {roles.join(' or ')}. Your role: {currentRole || 'Unknown'}.
      </p>
    </div>
  );
};
