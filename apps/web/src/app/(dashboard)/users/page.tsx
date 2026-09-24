"use client"

import { useState } from "react"
import { AppTable } from "@/components/common/AppTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUsers } from "@/features/users/hooks/useUsers";
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/features/users/types";
import { toast } from "sonner";
import { UserSheet, UserSheetMode } from "@/features/users/components/UserSheet";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface SheetState {
  open: boolean
  mode: UserSheetMode
  userId?: string
}

const CLOSED: SheetState = { open: false, mode: "create" }

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth()
  const { users, isLoading, isError, error, removeUser } = useUsers()

  const isAdminOrOwner = user?.role === 'ADMIN' || user?.role === 'OWNER'

  const [sheet, setSheet] = useState<SheetState>(CLOSED)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Button variant="link" className="cursor-pointer" onClick={() => openSheet("view", row.original.id as string)}>
          {row.getValue("name")}
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
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
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const dateString: string = row.getValue("created_at")
        return dateString ? new Date(dateString).toLocaleDateString() : "Unknown"
      },
    }
  ];

  const openSheet = (mode: UserSheetMode, userId?: string) =>
    setSheet({ open: true, mode, userId })

  const handleDelete = async (id: string) => {
    const { error } = await removeUser(id)
    if (!error) {
      toast.success("User deleted successfully")
    } else {
      toast.error("Failed to delete user")
    }
  }

  if (isError) {
    toast.error("Failed to load users", {
      description: error
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        {isAdminOrOwner && (
          <Button onClick={() => openSheet("create")}>
            Create User
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={users || []}
          handleView={(row) => openSheet("view", row.id)}
          handleEdit={isAdminOrOwner ? (row) => openSheet("edit", row.id) : undefined}
          handleDelete={isAdminOrOwner ? (row) => handleDelete(row.id) : undefined}
        />
      )}

      {/* User Sheet */}
      <UserSheet
        open={sheet.open}
        mode={sheet.mode}
        userId={sheet.userId}
        onOpenChange={(open) => {
          if (!open) setSheet(CLOSED)
          else setSheet((s) => ({ ...s, open: true }))
        }}
      />
    </div>
  );
}
