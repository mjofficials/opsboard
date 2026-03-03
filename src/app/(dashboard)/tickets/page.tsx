"use client"

import { useTickets } from "@/features/tickets/hooks/useTickets"
import { AppTable } from "@/components/common/AppTable"
import { ColumnDef } from "@tanstack/react-table"
import { Ticket } from "@/features/tickets/types"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TicketsPage() {
  const router = useRouter()
  const { tickets, isLoading, isError, error } = useTickets()

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
        <span className="capitalize">{row.getValue("priority")}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const dateString: string = row.getValue("created_at")
        return dateString ? new Date(dateString).toLocaleDateString() : "Unknown"
      },
    },
  ]

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
        <Button onClick={() => router.push("/dashboard/tickets/new")}>
          Create Ticket
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable columns={columns} data={tickets || []} />
      )}
    </div>
  )
}
