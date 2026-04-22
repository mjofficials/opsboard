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
      title: "Tickets",
      url: "/tickets",
      icon: Ticket,
    },
    {
      title: "Ticket Comments",
      url: "/tickets-comments",
      icon: MessageSquare
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
  teams: [
    {
      name: "OpsBoard",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
    },
    {
      name: "Evil Corp.",
      logo: Command,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
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
