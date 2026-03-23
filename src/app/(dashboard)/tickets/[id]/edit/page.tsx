"use client"

import { AppLoader } from "@/components/common/AppLoader"
import { TicketForm, TicketFormValues } from "@/features/tickets/components/TicketForm"
import { useTicket, useTickets } from "@/features/tickets/hooks/useTickets"
import { TicketPriority, TicketStatus } from "@/features/tickets/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function EditTicketPage() {
    const router = useRouter()
    const { id } = useParams()
    const { editTicket } = useTickets()
    const { data: ticket, isLoading, isError } = useTicket(id as string)

    useEffect(() => {
        if (isError) {
            console.error("Failed to load ticket for editing")
            router.push("/tickets") // or show 404
        }
    }, [isError, router])

    const handleSubmit = async (data: TicketFormValues) => {
        // Only update the fields managed by the form to avoid overwriting status/etc accidentally
        const updates = {
            title: data.title,
            description: data.description,
            status: data.status as TicketStatus,
            priority: data.priority as TicketPriority,
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
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority
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
