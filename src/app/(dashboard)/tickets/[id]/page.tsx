import { ticketService } from "@/features/tickets/services/ticketService"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TicketPageProps {
    params: {
        id: string
    }
}

export default async function ViewTicketPage({ params }: TicketPageProps) {
    let ticket
    try {
        ticket = await ticketService.getTicket(params.id)
    } catch (error) {
        notFound()
    }

    if (!ticket) {
        notFound()
    }

    const priorityColors = {
        low: "bg-slate-100 text-slate-800",
        medium: "bg-blue-100 text-blue-800",
        high: "bg-orange-100 text-orange-800",
        urgent: "bg-red-100 text-red-800",
    }

    const statusColors = {
        open: "bg-green-100 text-green-800",
        in_progress: "bg-yellow-100 text-yellow-800",
        resolved: "bg-slate-100 text-slate-800",
        closed: "bg-slate-100 text-slate-800",
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ticket Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Viewing ticket #{ticket.id.slice(0, 8)}...
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/tickets">Back to List</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/tickets/${ticket.id}/edit`}>Edit Ticket</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className={statusColors[ticket.status] || ""}>
                                        {ticket.status.replace('-', ' ')}
                                    </Badge>
                                    <Badge variant="secondary" className={priorityColors[ticket.priority] || ""}>
                                        {ticket.priority}
                                    </Badge>
                                </div>
                            </div>
                            <CardDescription>
                                Created on {new Date(ticket.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Ticket ID</span>
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                    {ticket.id}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Created By</span>
                                <span>{ticket.created_by}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Created At</span>
                                <span>{new Date(ticket.created_at).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Last Updated</span>
                                <span>{new Date(ticket.updated_at).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
