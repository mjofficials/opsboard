"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTickets } from "@/features/tickets/hooks/useTickets"
import { TicketForm, TicketFormValues } from "@/features/tickets/components/TicketForm"
import { ticketService } from "@/features/tickets/services/ticketService"
import { Ticket } from "@/features/tickets/types"
import { toast } from "sonner"
import { AppLoader } from "@/components/common/AppLoader"

export default function EditTicketPage() {
    const router = useRouter()
    const { id } = useParams()
    const { editTicket } = useTickets()
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        console.log("Editing ticket with ID:", id)
        async function loadTicket() {
            try {
                const data = await ticketService.getTicket(id as string)
                setTicket(data)
            } catch (error) {
                console.error("Failed to load ticket for editing", error)
                router.push("/tickets") // or show 404
            } finally {
                setIsLoading(false)
            }
        }
        loadTicket()
    }, [id, router])

    const handleSubmit = async (data: TicketFormValues) => {
        // Only update the fields managed by the form to avoid overwriting status/etc accidentally
        const updates = {
            title: data.title,
            description: data.description,
            priority: data.priority,
        }

        const { error } = await editTicket(id as string, updates)

        if (!error) {
            router.push(`/tickets`)
            toast.success("Ticket updated successfully")
        } else {
            toast.error("Failed to edit ticket")
        }
    }

    if (isLoading) {
        return (
            <AppLoader title="Loading ticket data..." description="Please wait while we load the ticket data." />
        )
    }

    if (!ticket) {
        return null // the useEffect redirects
    }

    const initialData: TicketFormValues = {
        title: ticket.title,
        description: ticket.description || "",
        priority: ticket.priority as any
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Ticket</h1>
            </div>

            <TicketForm
                initialData={initialData}
                onSubmit={handleSubmit}
                title={`Editing Ticket: ${ticket.title}`}
                description="Update the details for this ticket."
                submitText="Save Changes"
                onCancel={() => router.push("/tickets")}
            />
        </div>
    )
}
