"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { useProject, useProjects } from "@/features/projects/hooks/useProjects"
import { ProjectStatus } from "@/features/projects/types"
import { ProjectForm, ProjectFormValues } from "./ProjectForm"

export type ProjectSheetMode = "create" | "view" | "edit"

export interface ProjectSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  mode?: ProjectSheetMode
}

const STATUS_CLASSES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  INACTIVE: "bg-slate-100 text-slate-800 hover:bg-slate-100",
}

function ProjectFormSkeleton() {
  return (
    <div className="px-4 py-4 space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  )
}

const HEADER: Record<
  ProjectSheetMode,
  { title: (name?: string) => string; description: string }
> = {
  create: {
    title: () => "New Project",
    description:
      "Fill in the details below. The project will be visible to all members of your organization immediately.",
  },
  view: {
    title: (name) => `View Project: ${name}`,
    description: "Read-only snapshot of this project.",
  },
  edit: {
    title: (name) => `Edit Project: ${name}`,
    description: "Update the fields below and save your changes.",
  },
}

export function ProjectSheet({
  open,
  onOpenChange,
  projectId,
  mode = "create",
}: ProjectSheetProps) {
  const { user } = useAuth()
  const { addProject, editProject } = useProjects()
  const [isPending, setIsPending] = useState(false)

  const {
    data: project,
    isLoading: projectLoading,
  } = useProject(projectId ?? "")

  const isCreate = mode === "create"
  const isView = mode === "view"
  const isEdit = mode === "edit"

  const header = HEADER[mode]

  const initialData: ProjectFormValues | undefined =
    !isCreate && project
      ? {
        title: project.name,
        description: project.description ?? "",
        status: project.status as ProjectStatus,
      }
      : undefined

  const submitText = isPending
    ? isCreate
      ? "Creating…"
      : "Saving…"
    : isCreate
      ? "Create Project"
      : "Save Changes"

  const handleCreate = async (data: ProjectFormValues) => {
    if (!user?.id || !user?.organization_id) {
      toast.error("User does not have an active organization")
      return
    }

    setIsPending(true)
    const { error } = await addProject({
      name: data.title,
      description: data.description,
      status: data.status as ProjectStatus,
      created_by: user.id,
      organization_id: user.organization_id,
    })
    setIsPending(false)

    if (!error) {
      toast.success("Project created successfully")
      onOpenChange(false)
    } else {
      toast.error("Failed to create project")
    }
  }

  const handleEdit = async (data: ProjectFormValues) => {
    if (!projectId) return

    setIsPending(true)
    const { error } = await editProject(projectId, {
      name: data.title,
      description: data.description,
      status: data.status as ProjectStatus,
    })
    setIsPending(false)

    if (!error) {
      toast.success("Project updated successfully")
      onOpenChange(false)
    } else {
      toast.error("Failed to update project")
    }
  }

  const handleSubmit = isCreate ? handleCreate : handleEdit

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col gap-0 p-0 sm:max-w-md overflow-y-auto"
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Primary accent bar — design anchor */}
        <div className="h-0.5 w-full bg-primary shrink-0" />

        <SheetHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              {header.title(project?.name)}
            </SheetTitle>

            {!isCreate && project && (
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0 ${STATUS_CLASSES[project.status] ?? ""
                  }`}
              >
                {project.status}
              </Badge>
            )}
          </div>

          <SheetDescription className="text-sm">
            {header.description}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex-1 px-2 py-2">
          {!isCreate && projectLoading ? (
            <ProjectFormSkeleton />
          ) : (
            <ProjectForm
              key={`${mode}-${projectId}`}
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              title=""
              description=""
              submitText={submitText}
              isReadOnly={isView}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
