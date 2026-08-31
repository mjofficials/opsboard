"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"

import { AppForm } from "@/components/form/AppForm"
import { AppInput } from "@/components/form/inputs/AppInput"
import { AppSelect } from "@/components/form/inputs/AppSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTickets } from "@/features/tickets/hooks/useTickets"

export const ticketCommentSchema = z.object({
    ticket_id: z.string("Ticket ID is required"),
    comment: z.string().min(3, "Comment must be at least 3 characters"),
})

export type TicketCommentFormValues = z.infer<typeof ticketCommentSchema>

interface TicketCommentFormProps {
    initialData?: TicketCommentFormValues
    onSubmit: (data: TicketCommentFormValues) => Promise<void>
    onCancel?: () => void
    title?: string
    description?: string
    submitText?: string
    isReadOnly?: boolean
}

export function TicketCommentForm({
    initialData,
    onSubmit,
    onCancel,
    title = "Ticket Details",
    description = "Enter the details for this ticket.",
    submitText = "Submit Ticket",
    isReadOnly = false
}: TicketCommentFormProps) {
    const router = useRouter();

    const { tickets, isLoading } = useTickets();

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

            <AppForm<TicketCommentFormValues>
                schema={ticketCommentSchema}
                onSubmit={onSubmit}
                defaultValues={initialData || {
                    ticket_id: undefined,
                    comment: "",
                }}
            >
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AppSelect
                            name="ticket_id"
                            label="Ticket"
                            options={tickets?.map((ticket) => ({
                                value: ticket.id,
                                label: ticket.title,
                            })) || []}
                            placeholder="Select Ticket"
                            disabled={isReadOnly || isLoading}
                            required
                        />

                        <AppInput
                            type="textarea"
                            name="comment"
                            label="Comment"
                            placeholder="Please type your comment..."
                            disabled={isReadOnly}
                            className="col-span-2"
                            required
                        />
                    </div>
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
