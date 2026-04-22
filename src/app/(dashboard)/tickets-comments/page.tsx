"use client"

import { AppTable } from "@/components/common/AppTable"
import { Button } from "@/components/ui/button"
import { TicketCommentSheet, TicketCommentSheetMode } from "@/features/tickets-comments/components/TicketCommentSheet"
import { useTicketsComments } from "@/features/tickets-comments/hooks/useTicketsComments"
import { TicketComment } from "@/features/tickets-comments/types"
import { TicketPriority } from "@/features/tickets/enums"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface SheetState {
  open: boolean
  mode: TicketCommentSheetMode
  ticketCommentId?: string
}
const CLOSED: SheetState = { open: false, mode: "create" }

export default function TicketCommentsPage() {
  const router = useRouter()
  const { ticketsComments, isLoading, isError, error, removeTicketComment } = useTicketsComments()
  const [sheet, setSheet] = useState<SheetState>(CLOSED)

  const columns: ColumnDef<TicketComment>[] = [
    {
      accessorKey: "ticket_id",
      header: "Ticket ID",
    },
    {
      accessorKey: "comment",
      header: "Comment",
    },
    {
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const dateString: string = row.getValue("created_at")
        return dateString ? new Date(dateString).toLocaleDateString() : "Unknown"
      },
    }
  ];

  const openSheet = (mode: TicketCommentSheetMode, ticketCommentId?: string) =>
    setSheet({ open: true, mode, ticketCommentId })

  const handleDelete = async (id: string) => {
    const { error } = await removeTicketComment(id)
    if (!error) {
      toast.success("Comment deleted successfully")
    } else {
      toast.error("Failed to delete comment")
    }
  }

  if (isError) {
    toast.error("Failed to load tickets", {
      description: error
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ticket Comments</h1>
        <Button onClick={() => openSheet("create")}>
          Create Ticket Comment
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={ticketsComments || []}
          handleView={(row) => openSheet("view", row.id)}
          handleEdit={(row) => openSheet("edit", row.id)}
          handleDelete={(row) => handleDelete(row.id)}
        />
      )}

      {/* Ticket Sheet */}
      <TicketCommentSheet
        open={sheet.open}
        mode={sheet.mode}
        ticketCommentId={sheet.ticketCommentId}
        onOpenChange={(open) => {
          if (!open) setSheet(CLOSED)
          else setSheet((s) => ({ ...s, open: true }))
        }}
      />
    </div>
  )
}
