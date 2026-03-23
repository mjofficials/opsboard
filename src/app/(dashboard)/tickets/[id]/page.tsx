"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TicketForm, TicketFormValues } from "@/features/tickets/components/TicketForm"
import { ticketService } from "@/features/tickets/services/ticketService"
import { Ticket } from "@/features/tickets/types"
import { AppLoader } from "@/components/common/AppLoader"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ViewTicketPage() {
    const router = useRouter()
    const { id } = useParams()
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadTicket() {
            try {
                const data = await ticketService.getTicket(id as string)
                if (!data) throw new Error("Ticket not found")
                setTicket(data)
            } catch (error) {
                console.error("Failed to load ticket for viewing", error)
                router.push("/tickets") // Redirect back to list on error
            } finally {
                setIsLoading(false)
            }
        }
        if (id) {
            loadTicket()
        }
    }, [id, router])

    if (isLoading) {
        return (
            <AppLoader title="Loading ticket data..." description="Please wait while we load the ticket data." />
        )
    }

    if (!ticket) {
        return null
    }

    const statusColors: Record<string, string> = {
        open: "bg-green-100 text-green-800 hover:bg-green-100",
        in_progress: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        resolved: "bg-slate-100 text-slate-800 hover:bg-slate-100",
        closed: "bg-slate-100 text-slate-800 hover:bg-slate-100",
    }

    const initialData: TicketFormValues = {
        title: ticket.title,
        description: ticket.description || "",
        priority: ticket.priority as any
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">View Ticket</h1>
                    <Badge variant="secondary" className={statusColors[ticket.status] || ""}>
                        {ticket.status.replace('-', ' ')}
                    </Badge>
                </div>
                <Button asChild variant="outline">
                    <Link href={`/tickets/${ticket.id}/edit`}>Edit Ticket</Link>
                </Button>
            </div>

            <TicketForm
                initialData={initialData}
                onSubmit={async () => { }}
                title={`Ticket: ${ticket.title}`}
                description={`Created on ${new Date(ticket.created_at).toLocaleDateString()} by ${ticket.created_by || 'Unknown'}`}
                isReadOnly={true}
            />
        </div>
    )
}
