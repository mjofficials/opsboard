"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"

import { AppTable } from "@/components/common/AppTable"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { Project } from "@/features/projects/types"
import { ProjectSheet, ProjectSheetMode } from "@/features/projects/components/ProjectSheet"

interface SheetState {
  open: boolean
  mode: ProjectSheetMode
  projectId?: string
}

const CLOSED: SheetState = { open: false, mode: "create" }

export default function ProjectsPage() {
  const { projects, isLoading, isError, error, removeProject } = useProjects()

  const [sheet, setSheet] = useState<SheetState>(CLOSED)

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
        return dateString
          ? new Date(dateString).toLocaleDateString()
          : "Unknown"
      },
    },
  ]

  const openSheet = (mode: ProjectSheetMode, projectId?: string) =>
    setSheet({ open: true, mode, projectId })

  const handleDelete = async (id: string) => {
    const { error } = await removeProject(id)
    if (!error) {
      toast.success("Project deleted successfully")
    } else {
      toast.error("Failed to delete project")
    }
  }

  if (isError) {
    toast.error("Failed to load projects", { description: error })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => openSheet("create")}>Create Project</Button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">
          Loading dataset...
        </div>
      ) : (
        <AppTable
          columns={columns}
          data={projects || []}
          handleView={(row) => openSheet("view", row.id)}
          handleEdit={(row) => openSheet("edit", row.id)}
          handleDelete={(row) => handleDelete(row.id)}
        />
      )}

      {/* Project Sheet */}
      <ProjectSheet
        open={sheet.open}
        mode={sheet.mode}
        projectId={sheet.projectId}
        onOpenChange={(open) => {
          if (!open) setSheet(CLOSED)
          else setSheet((s) => ({ ...s, open: true }))
        }}
      />
    </div>
  )
}
