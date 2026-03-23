"use client"

import { useRouter } from "next/navigation"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { useAuth } from "@/features/auth/hooks/useAuth"

import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm"
import { toast } from "sonner"
import { ProjectStatus } from "@/features/projects/types"


export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addProject } = useProjects()

  const handleSubmit = async (data: ProjectFormValues) => {
    if (!user?.id) return

    // Setup base project metadata payload
    const newProject = {
      name: data.title,
      description: data.description,
      status: data.status as ProjectStatus,
      created_by: user.id
    }

    const { error } = await addProject(newProject)

    if (!error) {
      toast.success("Project created successfully")
      router.push("/projects")
    } else {
      toast.error("Failed to create project")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
      </div>

      <ProjectForm
        onSubmit={handleSubmit}
        title="Project Details"
        description="Enter the details for this new project."
        submitText="Submit Project"
      />
    </div>
  )
}
