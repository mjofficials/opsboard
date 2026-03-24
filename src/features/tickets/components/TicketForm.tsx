"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppForm } from "@/components/form/AppForm"
import { AppInput } from "@/components/form/inputs/AppInput"
import { AppSelect } from "@/components/form/inputs/AppSelect"

export const ticketSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Please provide a detailed description (minimum 10 characters)"),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const),
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
    const router = useRouter()

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
                    priority: "MEDIUM"
                }}
            >
                <CardContent className="space-y-4">
                    <AppInput
                        name="title"
                        label="Subject / Title"
                        placeholder="E.g. Database connection timeouts"
                        disabled={isReadOnly}
                    />

                    <AppSelect
                        name="status"
                        label="Status"
                        options={[
                            { value: "OPEN", label: "Open" },
                            { value: "IN_PROGRESS", label: "In Progress" },
                            { value: "RESOLVED", label: "Resolved" },
                            { value: "CLOSED", label: "Closed" },
                        ]}
                        placeholder="Select Status"
                        disabled={isReadOnly}
                    />

                    <AppSelect
                        name="priority"
                        label="Priority Level"
                        options={[
                            { value: "LOW", label: "Low" },
                            { value: "MEDIUM", label: "Medium" },
                            { value: "HIGH", label: "High" },
                            { value: "URGENT", label: "Urgent" },
                        ]}
                        placeholder="Select Priority"
                        disabled={isReadOnly}
                    />

                    <AppInput
                        name="description"
                        label="Detailed Description"
                        placeholder="Please describe the issue in detail..."
                        disabled={isReadOnly}
                    />
                </CardContent>
                <CardFooter className="flex justify-end mt-5">
                    <Button type="button" variant={isReadOnly ? "default" : "outline"} className={isReadOnly ? "" : "mr-4"} onClick={handleCancel}>
                        {isReadOnly ? "Back" : "Cancel"}
                    </Button>
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
