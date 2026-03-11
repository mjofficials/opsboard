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
    priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
})

export type TicketFormValues = z.infer<typeof ticketSchema>

interface TicketFormProps {
    initialData?: TicketFormValues
    onSubmit: (data: TicketFormValues) => Promise<void>
    onCancel?: () => void
    title?: string
    description?: string
    submitText?: string
}

export function TicketForm({
    initialData,
    onSubmit,
    onCancel,
    title = "Ticket Details",
    description = "Enter the details for this ticket.",
    submitText = "Submit Ticket"
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
                    priority: "medium"
                }}
            >
                <CardContent className="space-y-4">
                    <AppInput
                        name="title"
                        label="Subject / Title"
                        placeholder="E.g. Database connection timeouts"
                    />

                    <AppSelect
                        name="priority"
                        label="Priority Level"
                        options={[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                            { value: "urgent", label: "Urgent" },
                        ]}
                        placeholder="Select Priority"
                    />

                    <AppInput
                        name="description"
                        label="Detailed Description"
                        placeholder="Please describe the issue in detail..."
                    />
                </CardContent>
                <CardFooter className="flex justify-end mt-5">
                    <Button type="button" variant="outline" className="mr-4" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {submitText}
                    </Button>
                </CardFooter>
            </AppForm>
        </Card>
    )
}
