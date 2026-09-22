'use client';

import { Folder, LayoutDashboard, Settings2, User, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

const sidebarData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      url: '/users',
      icon: User,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: Folder,
    },
    {
      title: 'Teams',
      url: '/teams',
      icon: Users,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
  teams: [],
};

import { useAuthStore } from '@/store/useAuthStore';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, setActiveOrganization } = useAuthStore();

  const userTeams = React.useMemo(() => {
    const organizations = user?.organizations;
    if (!organizations?.length) return sidebarData.teams;
    return organizations.map((org) => {
      // Handle both flat response (from login API) and nested response (from me API)
      const typedOrg = org as unknown as { name?: string; logo_path?: string | null; organization?: { name: string; logo_path?: string | null } };
      const nestedOrg = typedOrg.organization || org.organizations;
      return {
        name: typedOrg.name || nestedOrg?.name || 'Unknown Organization',
        logo: typedOrg.logo_path || nestedOrg?.logo_path || '/logos/default.svg',
        id: org.organizationId,
        role: org.role,
      };
    });
  }, [user?.organizations]);

  const activeTeam = React.useMemo(() => {
    return userTeams.find((t) => t.id === user?.organizationId) || userTeams[0];
  }, [user?.organizationId, userTeams]);

  const handleTeamChange = (teamId: string) => {
    setActiveOrganization(teamId);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={userTeams} activeTeam={activeTeam} onTeamChange={handleTeamChange} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={sidebarData.navMain
            .filter((item) => {
              if (item.title === 'Users' || item.title === 'Teams') {
                return user?.role === 'ADMIN' || user?.role === 'OWNER';
              }
              return true;
            })
            .map((item) => ({
              ...item,
              isActive: pathname === item.url || pathname.startsWith(item.url + '/'),
            }))}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
