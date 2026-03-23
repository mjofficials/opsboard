"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLoader } from "@/components/common/AppLoader"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm"
import { useProject } from "@/features/projects/hooks/useProjects"
import { ProjectStatus } from "@/features/projects/types"

export default function ViewProjectPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: project, isLoading, isError } = useProject(id as string)

  useEffect(() => {
    if (isError) {
      console.error("Failed to load project for viewing")
      router.push("/projects") // Redirect back to list on error
    }
  }, [isError, router])

  if (isLoading) {
    return (
      <AppLoader title="Loading project data..." description="Please wait while we load the project data." />
    )
  }

  if (!project) {
    return null
  }

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-800 hover:bg-green-100",
    in_progress: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    resolved: "bg-slate-100 text-slate-800 hover:bg-slate-100",
    closed: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  }

  const initialData: ProjectFormValues = {
    title: project.name,
    description: project.description || "",
    status: project.status as ProjectStatus
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">View Project</h1>
          <Badge variant="secondary" className={statusColors[project.status] || ""}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
        </Button>
      </div>

      <ProjectForm
        initialData={initialData}
        onSubmit={async () => { }}
        title={`Project: ${project.name}`}
        description={`Created on ${new Date(project.created_at).toLocaleDateString()} by ${project.created_by || 'Unknown'}`}
        isReadOnly={true}
      />
    </div>
  )
}
