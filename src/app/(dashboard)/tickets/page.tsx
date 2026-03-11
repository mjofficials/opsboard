"use client"

import { AppTable } from "@/components/common/AppTable"
import { Button } from "@/components/ui/button"
import { useTickets } from "@/features/tickets/hooks/useTickets"
import { Ticket, TicketPriority } from "@/features/tickets/types"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function TicketsPage() {
  const router = useRouter()
  const { tickets, isLoading, isError, error, removeTicket } = useTickets()

  const priorityColorMap: Record<TicketPriority, string> = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-purple-100 text-purple-800 border-purple-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="capitalize px-2 py-1 rounded border text-xs bg-muted">
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <span className={`capitalize px-2 py-1 rounded border text-xs ${priorityColorMap[row.getValue("priority") as TicketPriority]}`}>
          {row.getValue("priority")}
        </span>
      ),
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

  const handleDelete = async (id: string) => {
    const { error } = await removeTicket(id)
    if (!error) {
      toast.success("Ticket deleted successfully")
    } else {
      toast.error("Failed to delete ticket")
    }
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-100 rounded-md">
        Failed to load tickets: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
        <Button onClick={() => router.push("/tickets/new")}>
          Create Ticket
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={tickets || []}
          handleView={(args) => router.push(`/tickets/${args.id}`)}
          handleEdit={(args) => router.push(`/tickets/${args.id}/edit`)}
          handleDelete={(args) => handleDelete(args.id)}
        />
      )}
    </div>
  )
}
