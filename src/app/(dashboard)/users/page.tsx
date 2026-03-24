"use client"

import { AppTable } from "@/components/common/AppTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUsers } from "@/features/users/hooks/useUsers";
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/features/users/types";
import { toast } from "sonner";

export default function UsersPage() {
  const router = useRouter();
  const { users, isLoading, isError, error, removeUser } = useUsers()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const dateString: string = row.getValue("created_at")
        return dateString ? new Date(dateString).toLocaleDateString() : "Unknown"
      },
    }
  ];

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
        <Button onClick={() => router.push("/users/new")}>
          Create User
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={users || []}
          handleView={(args) => router.push(`/users/${args.id}`)}
          handleEdit={(args) => router.push(`/users/${args.id}/edit`)}
          handleDelete={(args) => handleDelete(args.id)}
        />
      )}
    </div>
  );
}
