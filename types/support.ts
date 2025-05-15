export type TicketStatus = "open" | "pending" | "closed"
export type TicketPriority = "high" | "medium" | "low"
export type TicketCategory = "order" | "refund" | "info" | "account" | "delivery" | "rewards"
export type MessageSender = "customer" | "agent"

export interface TicketMessage {
  id: string
  ticket_id: string
  sender: MessageSender
  content: string
  timestamp: string
  created_at?: string
  updated_at?: string
}

export interface SupportTicket {
  id: string
  subject: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_avatar?: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  created_at: string
  updated_at: string
  messages: TicketMessage[]
}

export interface TicketFilter {
  status?: TicketStatus
  search?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: TicketCategory
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface FaqFilter {
  category?: TicketCategory
  is_published?: boolean
  search?: string
}
