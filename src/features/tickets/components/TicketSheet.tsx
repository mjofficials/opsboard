"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTicket, useTickets } from "../hooks/useTickets"
import { TicketForm, TicketFormValues } from "./TicketForm"
import { Badge } from "@/components/ui/badge"

export type TicketSheetMode = "create" | "view" | "edit"

export interface TicketSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ticketId?: string
    mode?: TicketSheetMode
}

const STATUS_CLASSES: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
    INACTIVE: "bg-slate-100 text-slate-800 hover:bg-slate-100",
}

function TicketFormSkeleton() {
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
    TicketSheetMode,
    { title: (name?: string) => string }
> = {
    create: {
        title: () => "New Ticket",
    },
    view: {
        title: (name) => `View Ticket: ${name}`,
    },
    edit: {
        title: (name) => `Edit Ticket: ${name}`,
    },
}

export function TicketSheet({
    open,
    onOpenChange,
    ticketId,
    mode = "create",
}: TicketSheetProps) {
    const { user } = useAuth()
    const { addTicket, editTicket } = useTickets()
    const [isPending, setIsPending] = useState(false)

    const {
        data: ticket,
        isLoading: ticketLoading,
    } = useTicket(ticketId ?? "")

    const isCreate = mode === "create"
    const isView = mode === "view"
    const isEdit = mode === "edit"

    const header = HEADER[mode]

    const initialData: TicketFormValues | undefined =
        !isCreate && ticket
            ? {
                title: ticket.title,
                status: ticket.status,
                priority: ticket.priority,
                project_id: ticket.project_id,
                description: ticket.description,
            }
            : undefined

    const submitText = isPending
        ? isCreate
            ? "Creating…"
            : "Saving…"
        : isCreate
            ? "Create Ticket"
            : "Save Changes"

    const handleCreate = async (data: TicketFormValues) => {
        if (!user?.id || !user?.organization_id) {
            toast.error("User does not have an active organization")
            return
        }

        setIsPending(true)
        const { error } = await addTicket({
            title: data.title,
            status: data.status,
            priority: data.priority,
            project_id: data.project_id,
            description: data.description,
        })
        setIsPending(false)

        if (!error) {
            toast.success("Ticket created successfully")
            onOpenChange(false)
        } else {
            toast.error("Failed to create ticket")
        }
    }

    const handleEdit = async (data: TicketFormValues) => {
        if (!ticketId) return

        setIsPending(true)
        const { error } = await editTicket(ticketId, {
            title: data.title,
            status: data.status,
            priority: data.priority,
            project_id: data.project_id,
            description: data.description,
        })
        setIsPending(false)

        if (!error) {
            toast.success("Ticket updated successfully")
            onOpenChange(false)
        } else {
            toast.error("Failed to update ticket")
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
                            {header.title(ticket?.title)}
                        </SheetTitle>

                        {!isCreate && ticket && (
                            <Badge
                                variant="secondary"
                                className={`text-[10px] px-1.5 py-0 ${STATUS_CLASSES[ticket.status] ?? ""}`}
                            >
                                {ticket.status}
                            </Badge>
                        )}
                    </div>
                </SheetHeader>

                <Separator />

                <div className="flex-1 px-2 py-2">
                    {!isCreate && ticketLoading ? (
                        <TicketFormSkeleton />
                    ) : (
                        <TicketForm
                            key={`${mode}-${ticketId}`}
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
