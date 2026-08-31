"use client"

import { useEffect, useRef } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme()
  const { user, session, isLoading, isInitialized, logout } = useAuth()
  const initialRedirectDone = useRef(false);

  useEffect(() => {
    // Wait until auth has fully resolved before making guard decisions
    if (isLoading || !isInitialized) return;

    if (!session) {
      router.replace('/login');
      return;
    }

    if (!user?.organization_id) {
      router.replace('/onboarding');
      return;
    }

    // Persist current page: Check for a last visited page on initial load
    if (typeof window !== 'undefined' && !initialRedirectDone.current) {
      initialRedirectDone.current = true;
      const storedPage = localStorage.getItem('lastVisitedPage');
      console.log({ storedPage, pathname });
      if (storedPage && storedPage !== pathname) {
        router.replace(storedPage);
        return;
      }
    }
  }, [session, user, isLoading, isInitialized, router, pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined' && pathname && pathname !== '/login' && pathname !== '/register' && pathname !== '/onboarding') {
      localStorage.setItem('lastVisitedPage', pathname);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastVisitedPage');
    }
    router.push("/login");
  }

  // Render nothing while auth is resolving or a redirect is pending
  if (isLoading || !isInitialized || !session || !user?.organization_id) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex items-center justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Logout Button */}
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleLogout()}>Logout</Button>
            {/* User */}
            <NavUser user={{
              name: user?.name || "User",
              email: user?.email || "No Email",
              role: user?.role || "No Role",
              avatar: "/avatars/shadcn.jpg"
            }} />
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
