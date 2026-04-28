"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppForm } from "@/components/form/AppForm"
import { AppInput } from "@/components/form/inputs/AppInput"
import { AppSelect } from "@/components/form/inputs/AppSelect"
import { useProjects } from "@/features/projects/hooks/useProjects"
import { TicketPriority, TicketStatus } from "../enums"
import { toTitleCase } from "@/lib/utils"

export const ticketSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string(),
    status: z.enum(["OPEN", "IN_PROGRESS", "DONE"] as const),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"] as const),
    project_id: z.string().min(1, "Project is required"),
})

export type TicketFormValues = z.infer<typeof ticketSchema>

interface TicketFormProps {
    initialData?: TicketFormValues
    onSubmit: (data: TicketFormValues) => Promise<void>
    onCancel?: () => void
    title?: string
    description?: string
    submitText?: string
    isReadOnly?: boolean
}

export function TicketForm({
    initialData,
    onSubmit,
    onCancel,
    title = "Ticket Details",
    description = "Enter the details for this ticket.",
    submitText = "Submit Ticket",
    isReadOnly = false
}: TicketFormProps) {
    const router = useRouter();

    const { projects, isLoading } = useProjects();

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            router.back()
        }
    }

    return (
        <Card className="border-0 shadow-sm dark:border-zinc-800 sm:border">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <AppForm<TicketFormValues>
                schema={ticketSchema}
                onSubmit={onSubmit}
                defaultValues={initialData || {
                    title: "",
                    description: "",
                    status: "OPEN",
                    priority: "MEDIUM",
                    project_id: ""
                }}
            >
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AppInput
                            name="title"
                            label="Ticket Title"
                            placeholder="Enter ticket title"
                            disabled={isReadOnly}
                            required
                        />

                        <AppSelect
                            name="project_id"
                            label="Project"
                            options={projects?.map((project) => ({
                                value: project.id,
                                label: project.name,
                            })) || []}
                            placeholder="Select Project"
                            disabled={isReadOnly || isLoading}
                            required
                        />

                        <AppSelect
                            name="status"
                            label="Status"
                            options={Object.values(TicketStatus).map((status) => ({
                                value: status,
                                label: toTitleCase(status),
                            }))}
                            placeholder="Select Status"
                            disabled={isReadOnly}
                            required
                        />

                        <AppSelect
                            name="priority"
                            label="Priority Level"
                            options={Object.values(TicketPriority).map((priority) => ({
                                value: priority,
                                label: toTitleCase(priority),
                            }))}
                            placeholder="Select Priority"
                            disabled={isReadOnly}
                            required
                        />

                        <AppInput
                            type="textarea"
                            name="description"
                            label="Detailed Description"
                            placeholder="Please describe the issue in detail..."
                            disabled={isReadOnly}
                            className="col-span-2"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end mt-5">
                    {isReadOnly && (
                        <Button type="button" variant="outline" className="mr-4" onClick={() => { router.push("/projects") }}>
                            Back
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="button" variant="outline" className="mr-4" onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button type="submit">
                            {submitText}
                        </Button>
                    )}
                </CardFooter>
            </AppForm>
        </Card>
    )
}
