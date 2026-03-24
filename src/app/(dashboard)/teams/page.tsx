"use client"

import { AppTable } from "@/components/common/AppTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTeams } from "@/features/teams/hooks/useTeams";
import { ColumnDef } from "@tanstack/react-table"
import { TeamMember } from "@/features/teams/types";
import { toast } from "sonner";
import { UserPlusIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { AppForm } from "@/components/form/AppForm";
import InviteModal, { InviteFormValues } from "@/features/teams/components/inviteModal";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function TeamsPage() {
  const router = useRouter();
  const { user } = useAuth()
  const { teams, isLoading, isError, error, addTeamMember } = useTeams()
  const [isOpen, setIsOpen] = useState(false)

  const columns: ColumnDef<TeamMember>[] = [
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
      cell: ({ row }) => (
        <span className="capitalize px-2 py-1 rounded border text-xs bg-muted">
          {row.getValue("role")}
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

  const handleSubmit = async (data: InviteFormValues) => {
    console.log(data)

    let payload = {
      email: data.email,
      role: data.role,
      organization_id: user?.organization_id,
    }
    const { error } = await addTeamMember(payload as Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>)
    if (!error) {
      toast.success("Team member invited successfully")
    } else {
      toast.error("Failed to invite team member")
    }
    setIsOpen(false)
  }

  const handleDelete = async (id: string) => {
    console.log(id)
  }

  if (isError) {
    toast.error("Failed to load team members", {
      description: error
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <Button onClick={() => setIsOpen(true)}>
          <UserPlusIcon className="h-4 w-4" />
          Invite Team Member
        </Button>
      </div>

      {/* Invite Modal */}
      <InviteModal onSubmit={handleSubmit} isOpen={isOpen} setIsOpen={setIsOpen} />

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={teams || []}
          handleView={(args) => router.push(`/teams/${args.id}`)}
          handleEdit={(args) => router.push(`/teams/${args.id}/edit`)}
          handleDelete={(args) => handleDelete(args.id)}
        />
      )}
    </div>
  );
}
