'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { SettingsSidebar } from '@/features/settings/components/SettingsSidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const isAdmin = user?.role === 'ADMIN';
  const isMember = user?.role === 'MEMBER';

  return (
    <div className="flex h-full gap-8 p-6">
      <SettingsSidebar isAdmin={isAdmin} isOwner={isOwner} isMember={isMember} />
      <div className="flex-1 min-w-0 max-w-2xl">
        {children}
      </div>
    </div>
  );
}
