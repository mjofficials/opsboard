"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"
import { useTickets } from "@/features/tickets/hooks/useTickets"
import { useAuth } from "@/features/auth/hooks/useAuth"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppForm } from "@/components/form/AppForm"
import { AppInput } from "@/components/form/inputs/AppInput"
import { TicketPriority, TicketStatus } from "@/features/tickets/types"

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a detailed description (minimum 10 characters)"),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
})

type TicketFormValues = z.infer<typeof ticketSchema>

export default function NewTicketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addTicket } = useTickets()

  const handleSubmit = async (data: TicketFormValues) => {
    if (!user?.id) return

    // Setup base ticket metadata payload
    const newTicket = {
      title: data.title,
      description: data.description,
      priority: data.priority as TicketPriority,
      status: 'open' as TicketStatus,
      created_by: user.id
    }

    const { error } = await addTicket(newTicket)

    if (!error) {
       router.push("/dashboard/tickets")
    } else {
       console.error("Failed to create ticket", error)
       // A realistic application might pop a toast here
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Ticket</h1>
      </div>

      <Card className="border-0 shadow-sm dark:border-zinc-800 sm:border">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>
            Enter the details for this new operations request or bug report.
          </CardDescription>
        </CardHeader>
        
        <AppForm<TicketFormValues>
          schema={ticketSchema}
          onSubmit={handleSubmit}
          defaultValues={{
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

            {/* In a real scenario you would have AppSelect and AppTextarea. We use AppInput as fallback */}
            <AppInput
              name="priority"
              label="Priority Level (low, medium, high, urgent)"
              placeholder="medium"
            />

            <AppInput 
              name="description" 
              label="Detailed Description" 
              placeholder="Please describe the issue in detail..." 
            />

          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Ticket
            </Button>
          </CardFooter>
        </AppForm>
      </Card>
    </div>
  )
}
