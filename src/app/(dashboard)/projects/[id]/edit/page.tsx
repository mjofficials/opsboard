"use client"

import { AppLoader } from "@/components/common/AppLoader"
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm"
import { useProject, useProjects } from "@/features/projects/hooks/useProjects"
import { ProjectStatus } from "@/features/projects/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function EditProjectPage() {
    const router = useRouter()
    const { id } = useParams()
    const { editProject } = useProjects()
    const { data: project, isLoading, isError } = useProject(id as string)

    useEffect(() => {
        if (isError) {
            console.error("Failed to load project for editing")
            router.push("/projects") // or show 404
        }
    }, [isError, router])

    const handleSubmit = async (data: ProjectFormValues) => {
        // Only update the fields managed by the form to avoid overwriting status/etc accidentally
        const updates = {
            name: data.title,
            description: data.description,
            status: data.status as ProjectStatus
        }

        const { error } = await editProject(id as string, updates)

        if (!error) {
            router.push(`/projects`)
            toast.success("Project updated successfully")
        } else {
            toast.error("Failed to edit project")
        }
    }

    if (isLoading) {
        return (
            <AppLoader title="Loading project data..." description="Please wait while we load the project data." />
        )
    }

    if (!project) {
        return null // the useEffect redirects
    }

    const initialData: ProjectFormValues = {
        title: project.name,
        description: project.description || "",
        status: project.status as ProjectStatus
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            </div>

            <ProjectForm
                initialData={initialData}
                onSubmit={handleSubmit}
                title={`Editing Project: ${project.name}`}
                description="Update the details for this project."
                submitText="Save Changes"
                onCancel={() => router.push("/projects")}
            />
        </div>
    )
}
