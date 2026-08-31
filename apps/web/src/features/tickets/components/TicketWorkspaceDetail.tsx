"use client"

import { useState, useEffect } from "react"
import { useTicket, useTickets } from "@/features/tickets/hooks/useTickets"
import { TicketForm, TicketFormValues } from "@/features/tickets/components/TicketForm"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Edit2, Trash2, X } from "lucide-react"
import { TicketCommentsSection } from "@/features/tickets-comments/components/TicketCommentsSection"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TicketWorkspaceDetailProps {
  ticketId: string
}

export function TicketWorkspaceDetail({ ticketId }: TicketWorkspaceDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { data: ticket, isLoading } = useTicket(ticketId)
  const { editTicket, removeTicket } = useTickets()

  // Reset editing state when a new ticket is selected
  useEffect(() => {
    setIsEditing(false)
  }, [ticketId])

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading ticket details...</div>
  }

  if (!ticket) {
    return <div className="p-8 text-center text-muted-foreground">Ticket not found.</div>
  }

  const initialData: TicketFormValues = {
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    description: ticket.description,
  }

  const handleEdit = async (data: TicketFormValues) => {
    const { error } = await editTicket(ticketId, data)
    if (!error) {
      toast.success("Ticket updated successfully")
      setIsEditing(false)
    } else {
      toast.error("Failed to update ticket", { description: error })
    }
  }

  const handleDelete = async (ticketId: string) => {
    const { error } = await removeTicket(ticketId)
    if (!error) {
      toast.success("Ticket deleted successfully")
    } else {
      toast.error("Failed to delete ticket", { description: error })
    }
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Top action bar */}
        <div className="flex justify-between items-center p-4 border-b shrink-0 bg-muted/10">
          <h2 className="text-lg font-semibold tracking-tight">
            {isEditing ? "Edit Ticket" : ticket.title}
          </h2>
          <div>
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Ticket
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel Editing
              </Button>
            )}

            {!isEditing && (
              <Button size="sm" variant="destructive" className="ml-2" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 flex-1">
          <TicketForm
            key={`${ticketId}-${isEditing}`}
            initialData={initialData}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            title=""
            description=""
            submitText="Save Changes"
            isReadOnly={!isEditing}
          />

          <div className="mt-8">
            <TicketCommentsSection ticketId={ticketId} />
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Are you sure you want to delete this ticket?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => handleDelete?.(ticketId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
