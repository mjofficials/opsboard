"use client"

import { AppTable } from "@/components/common/AppTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ColumnDef } from "@tanstack/react-table"
import { Project } from "@/features/projects/types";
import { toast } from "sonner";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, isLoading, isError, error, removeProject } = useProjects()

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      accessorKey: "description",
      header: "Description",
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
    const { error } = await removeProject(id)
    if (!error) {
      toast.success("Project deleted successfully")
    } else {
      toast.error("Failed to delete project")
    }
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-100 rounded-md">
        Failed to load projects: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => router.push("/projects/new")}>
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">Loading dataset...</div>
      ) : (
        <AppTable
          columns={columns}
          data={projects || []}
          handleView={(args) => router.push(`/projects/${args.id}`)}
          handleEdit={(args) => router.push(`/projects/${args.id}/edit`)}
          handleDelete={(args) => handleDelete(args.id)}
        />
      )}
    </div>
  );
}
