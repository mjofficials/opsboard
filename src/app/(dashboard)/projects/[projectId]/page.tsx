"use client"

import { use, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTickets } from "@/features/tickets/hooks/useTickets"
import { useProject } from "@/features/projects/hooks/useProjects"
import { TicketPriority } from "@/features/tickets/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ticket as TicketIcon } from "lucide-react"
import { TicketWorkspaceDetail } from "@/features/tickets/components/TicketWorkspaceDetail"
import { toTitleCase } from "@/lib/utils"

const priorityColorMap: Record<TicketPriority, string> = {
  LOW: "bg-green-100 text-green-800 border-green-200",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
  HIGH: "bg-purple-100 text-purple-800 border-purple-200",
}

export default function ProjectWorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { projectId } = use(params)

  const ticketId = searchParams.get("ticketId")

  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { tickets, isLoading: ticketsLoading } = useTickets()

  const projectTickets = tickets?.filter(t => t.project_id === projectId) || []

  if (projectLoading || ticketsLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading workspace...</div>
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Project not found.
        <br />
        <Button variant="link" onClick={() => router.push("/projects")}>Go back to projects</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b shrink-0">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => router.push("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden pt-4 gap-6">
        {/* Left Pane: Ticket List */}
        <div className="w-1/3 flex flex-col border rounded-lg bg-card shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b bg-muted/30 font-medium flex items-center justify-between">
            <span>Issues ({projectTickets.length})</span>
            {/* New Ticket button can go here if needed */}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {projectTickets.length === 0 ? (
              <div className="text-center p-8 text-sm text-muted-foreground">No tickets in this project yet.</div>
            ) : (
              projectTickets.map((ticket) => {
                const isSelected = ticket.id === ticketId;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => router.push(`/projects/${projectId}?ticketId=${ticket.id}`)}
                    className={`w-full text-left p-3 rounded-md transition-colors border cursor-pointer ${isSelected
                      ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                      : "bg-background border-transparent hover:border-border hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="font-medium text-sm line-clamp-1">{ticket.title}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize whitespace-nowrap ${priorityColorMap[ticket.priority as TicketPriority]}`}>
                        {toTitleCase(ticket.priority)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="capitalize">{toTitleCase(ticket.status)}</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Ticket Detail & Comments */}
        <div className="flex-1 flex flex-col border rounded-lg bg-card shadow-sm overflow-hidden">
          {ticketId ? (
            <TicketWorkspaceDetail ticketId={ticketId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <TicketIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
