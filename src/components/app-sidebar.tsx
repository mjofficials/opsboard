"use client"

import {
  AudioWaveform,
  Command,
  Folder,
  GalleryVerticalEnd,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  Ticket,
  User,
  Users
} from "lucide-react"
import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"

const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/users",
      icon: User,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
    },
    {
      title: "Teams",
      url: "/teams",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    }
  ],
  teams: [],
}

import { useAppSelector, useAppDispatch } from "@/store/store"
import { setActiveOrganization } from "@/features/auth/authSlice"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const userTeams = React.useMemo(() => {
    if (!user?.organizations?.length) return sidebarData.teams;
    return user.organizations.map((org) => ({
      name: org.organizations?.name || "Unknown Organization",
      logo: org.organizations?.logo_path || "/logos/default.svg",
      id: org.organization_id,
      role: org.role,
    }));
  }, [user?.organizations]);

  const activeTeam = React.useMemo(() => {
    return userTeams.find((t) => t.id === user?.organization_id) || userTeams[0];
  }, [user?.organization_id, userTeams]);

  const handleTeamChange = (teamId: string) => {
    dispatch(setActiveOrganization(teamId))
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={userTeams}
          activeTeam={activeTeam}
          onTeamChange={handleTeamChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={sidebarData.navMain.map(item => ({ ...item, isActive: pathname === item.url || pathname.startsWith(item.url + '/') }))}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
