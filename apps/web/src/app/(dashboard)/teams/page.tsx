"use client"

import { AppTable } from "@/components/common/AppTable";
import { Button } from "@/components/ui/button";
import { useTeams } from "@/features/teams/hooks/useTeams";
import { TeamMember } from "@/features/teams/types";
import { ColumnDef } from "@tanstack/react-table";
import { UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import InviteModal, { InviteFormValues } from "@/features/teams/components/inviteModal";
import { useState } from "react";

export default function TeamsPage() {
  const router = useRouter();
  const { user } = useAuth()
  const { teams, isLoading, isError, error, addTeamMember, deleteTeamMember, acceptTeamMember, rejectTeamMember } = useTeams()
  const [isOpen, setIsOpen] = useState(false)

  const columns: ColumnDef<TeamMember>[] = [
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

  const handleSubmit = async (data: InviteFormValues) => {
    console.log(data)

    let payload = {
      email: data.email,
      role: data.role,
      organization_id: user?.organization_id,
    }
    const { error } = await addTeamMember(payload as Omit<TeamMember, 'id' | 'created_at'>)
    if (!error) {
      toast.success("Team member invited successfully")
    } else {
      toast.error("Failed to invite team member")
    }
    setIsOpen(false)
  }

  const handleAccept = async (id: string) => {
    console.log(id)
    const { error } = await acceptTeamMember(id)
    if (!error) {
      toast.success("Team member accepted successfully")
    } else {
      toast.error("Failed to accept team member")
    }
  }

  const handleReject = async (id: string) => {
    console.log(id)
    const { error } = await rejectTeamMember(id)
    if (!error) {
      toast.success("Team member rejected successfully")
    } else {
      toast.error("Failed to reject team member")
    }
  }

  const handleDelete = async (id: string) => {
    console.log(id)
    const { error } = await deleteTeamMember(id)
    if (!error) {
      toast.success("Team member deleted successfully")
    } else {
      toast.error("Failed to delete team member")
    }
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
          handleAccept={(args) => handleAccept(args.id)}
          handleReject={(args) => handleReject(args.id)}
          handleDelete={(args) => handleDelete(args.id)}
        />
      )}
    </div>
  );
}
