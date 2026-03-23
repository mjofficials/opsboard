"use client"

import { useRouter } from "next/navigation"
import { useTickets } from "@/features/tickets/hooks/useTickets"
import { useAuth } from "@/features/auth/hooks/useAuth"

import { TicketPriority, TicketStatus } from "@/features/tickets/types"
import { TicketForm, TicketFormValues } from "@/features/tickets/components/TicketForm"
import { toast } from "sonner"


export default function NewTicketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addTicket } = useTickets()

  const handleSubmit = async (data: TicketFormValues) => {
    if (!user?.id) return

    // Setup base ticket metadata payload
    const newTicket = {
      title: data.title,
      description: data.description,
      priority: data.priority as TicketPriority,
      status: data.status as TicketStatus,
      created_by: user.id
    }

    const { error } = await addTicket(newTicket)

    if (!error) {
      router.push("/tickets")
      toast.success("Ticket created successfully")
    } else {
      toast.error("Failed to create ticket")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Ticket</h1>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        title="Ticket Details"
        description="Enter the details for this new operations request or bug report."
        submitText="Submit Ticket"
      />
    </div>
  )
}
