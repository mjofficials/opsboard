"use client"

import { useState } from "react"
import { useTicketsComments } from "@/features/tickets-comments/hooks/useTicketsComments"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { MessageSquare, Send } from "lucide-react"

interface TicketCommentsSectionProps {
  ticketId: string
}

export function TicketCommentsSection({ ticketId }: TicketCommentsSectionProps) {
  const { ticketsComments, addTicketComment, isLoading } = useTicketsComments(ticketId)
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter comments for the current ticket and sort oldest to newest (better for conversational UI)
  const ticketComments = ticketsComments
    ?.filter((c) => c.ticket_id === ticketId)
    ?.sort((a, b) => new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime()) || []

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const { error } = await addTicketComment({
      ticket_id: ticketId,
      comment: newComment.trim(),
      user_id: user?.id,
    })
    setIsSubmitting(false)

    if (!error) {
      setNewComment("")
      toast.success("Comment added")
    } else {
      toast.error("Failed to add comment")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b bg-muted/30 font-medium flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Activity & Comments
      </div>

      {/* Comments List */}
      <div className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-muted-foreground animate-pulse py-4">Loading comments...</div>
        ) : ticketComments.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          ticketComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{comment.user?.name}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{comment.user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at || "").toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md border">
                  {comment.comment}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/10">
        <div className="relative">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... (Ctrl+Enter to send)"
            className="min-h-[80px] resize-none pr-12 bg-background"
            disabled={isSubmitting}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8"
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
