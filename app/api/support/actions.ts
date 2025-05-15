"use server"

import { createClient } from "@/utils/supabase/server"
import type {
  SupportTicket,
  TicketMessage,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketFilter,
  FaqItem,
  FaqFilter,
} from "@/types/support"
import { revalidatePath } from "next/cache"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Récupérer tous les tickets avec filtrage
export async function getTickets(filter?: TicketFilter): Promise<SupportTicket[]> {
  const supabase = createClient()

  // Construire la requête de base
  let query = supabase.from("support_tickets").select(
    `
      *,
      users!support_tickets_customer_id_fkey (
        name,
        email,
        avatar_url
      )
    `,
  )

  // Appliquer les filtres
  if (filter) {
    if (filter.status) {
      query = query.eq("status", filter.status)
    }

    if (filter.search) {
      query = query.or(
        `id.ilike.%${filter.search}%,subject.ilike.%${filter.search}%,users.name.ilike.%${filter.search}%,users.email.ilike.%${filter.search}%`,
      )
    }
  }

  // Exécuter la requête
  const { data: ticketsData, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des tickets:", error)
    throw new Error("Impossible de récupérer les tickets")
  }

  // Récupérer les messages pour chaque ticket
  const tickets: SupportTicket[] = []

  for (const ticketData of ticketsData) {
    const { data: ticketMessages, error: messagesError } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketData.id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Erreur lors de la récupération des messages de ticket:", messagesError)
      continue
    }

    // Formater les dates pour l'affichage
    const createdAt = new Date(ticketData.created_at)
    const formattedCreatedAt = format(createdAt, "dd/MM/yyyy HH:mm", { locale: fr })

    const updatedAt = new Date(ticketData.updated_at)
    const formattedUpdatedAt = format(updatedAt, "dd/MM/yyyy HH:mm", { locale: fr })

    // Formater les messages
    const messages: TicketMessage[] = ticketMessages.map((message) => {
      const messageTimestamp = new Date(message.created_at)
      const formattedTimestamp = format(messageTimestamp, "dd/MM/yyyy HH:mm", { locale: fr })

      return {
        id: message.id,
        ticket_id: message.ticket_id,
        sender: message.sender,
        content: message.content,
        timestamp: formattedTimestamp,
        created_at: message.created_at,
        updated_at: message.updated_at,
      }
    })

    tickets.push({
      id: ticketData.id,
      subject: ticketData.subject,
      customer_id: ticketData.customer_id,
      customer_name: ticketData.users.name,
      customer_email: ticketData.users.email,
      customer_avatar: ticketData.users.avatar_url,
      status: ticketData.status,
      priority: ticketData.priority,
      category: ticketData.category,
      created_at: formattedCreatedAt,
      updated_at: formattedUpdatedAt,
      messages: messages,
    })
  }

  return tickets
}

// Récupérer un ticket par ID
export async function getTicketById(id: string): Promise<SupportTicket | null> {
  const supabase = createClient()

  const { data: ticketData, error } = await supabase
    .from("support_tickets")
    .select(
      `
      *,
      users!support_tickets_customer_id_fkey (
        name,
        email,
        avatar_url
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erreur lors de la récupération du ticket:", error)
    return null
  }

  // Récupérer les messages du ticket
  const { data: ticketMessages, error: messagesError } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketData.id)
    .order("created_at", { ascending: true })

  if (messagesError) {
    console.error("Erreur lors de la récupération des messages du ticket:", messagesError)
    return null
  }

  // Formater les dates pour l'affichage
  const createdAt = new Date(ticketData.created_at)
  const formattedCreatedAt = format(createdAt, "dd/MM/yyyy HH:mm", { locale: fr })

  const updatedAt = new Date(ticketData.updated_at)
  const formattedUpdatedAt = format(updatedAt, "dd/MM/yyyy HH:mm", { locale: fr })

  // Formater les messages
  const messages: TicketMessage[] = ticketMessages.map((message) => {
    const messageTimestamp = new Date(message.created_at)
    const formattedTimestamp = format(messageTimestamp, "dd/MM/yyyy HH:mm", { locale: fr })

    return {
      id: message.id,
      ticket_id: message.ticket_id,
      sender: message.sender,
      content: message.content,
      timestamp: formattedTimestamp,
      created_at: message.created_at,
      updated_at: message.updated_at,
    }
  })

  return {
    id: ticketData.id,
    subject: ticketData.subject,
    customer_id: ticketData.customer_id,
    customer_name: ticketData.users.name,
    customer_email: ticketData.users.email,
    customer_avatar: ticketData.users.avatar_url,
    status: ticketData.status,
    priority: ticketData.priority,
    category: ticketData.category,
    created_at: formattedCreatedAt,
    updated_at: formattedUpdatedAt,
    messages: messages,
  }
}

// Créer un nouveau ticket
export async function createTicket(ticketData: {
  subject: string
  customer_id: string
  priority?: TicketPriority
  category?: TicketCategory
  message: string
}): Promise<SupportTicket | null> {
  const supabase = createClient()

  // Insérer le ticket
  const { data: newTicket, error } = await supabase
    .from("support_tickets")
    .insert([
      {
        subject: ticketData.subject,
        customer_id: ticketData.customer_id,
        priority: ticketData.priority || "medium",
        category: ticketData.category || "info",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création du ticket:", error)
    throw new Error("Impossible de créer le ticket")
  }

  // Ajouter le premier message
  const { error: messageError } = await supabase.from("ticket_messages").insert([
    {
      ticket_id: newTicket.id,
      sender: "customer",
      content: ticketData.message,
    },
  ])

  if (messageError) {
    console.error("Erreur lors de l'ajout du message:", messageError)
    // Supprimer le ticket si l'ajout du message échoue
    await supabase.from("support_tickets").delete().eq("id", newTicket.id)
    throw new Error("Impossible d'ajouter le message au ticket")
  }

  revalidatePath("/support")

  // Récupérer le ticket complet
  return await getTicketById(newTicket.id)
}

// Ajouter un message à un ticket
export async function addTicketMessage(ticketId: string, content: string, sender: "customer" | "agent"): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("ticket_messages").insert([
    {
      ticket_id: ticketId,
      sender,
      content,
    },
  ])

  if (error) {
    console.error("Erreur lors de l'ajout du message:", error)
    throw new Error("Impossible d'ajouter le message au ticket")
  }

  // Mettre à jour la date de mise à jour du ticket
  await supabase
    .from("support_tickets")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId)

  revalidatePath("/support")
}

// Mettre à jour le statut d'un ticket
export async function updateTicketStatus(id: string, status: TicketStatus): Promise<SupportTicket | null> {
  const supabase = createClient()

  const { error } = await supabase
    .from("support_tickets")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erreur lors de la mise à jour du statut du ticket:", error)
    throw new Error("Impossible de mettre à jour le statut du ticket")
  }

  revalidatePath("/support")

  // Récupérer le ticket mis à jour
  return await getTicketById(id)
}

// Mettre à jour la priorité d'un ticket
export async function updateTicketPriority(id: string, priority: TicketPriority): Promise<SupportTicket | null> {
  const supabase = createClient()

  const { error } = await supabase
    .from("support_tickets")
    .update({
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erreur lors de la mise à jour de la priorité du ticket:", error)
    throw new Error("Impossible de mettre à jour la priorité du ticket")
  }

  revalidatePath("/support")

  // Récupérer le ticket mis à jour
  return await getTicketById(id)
}

// Récupérer toutes les FAQ avec filtrage
export async function getFaqItems(filter?: FaqFilter): Promise<FaqItem[]> {
  const supabase = createClient()

  // Construire la requête de base
  let query = supabase.from("faq_items").select("*")

  // Appliquer les filtres
  if (filter) {
    if (filter.category) {
      query = query.eq("category", filter.category)
    }

    if (filter.is_published !== undefined) {
      query = query.eq("is_published", filter.is_published)
    }

    if (filter.search) {
      query = query.or(`question.ilike.%${filter.search}%,answer.ilike.%${filter.search}%`)
    }
  }

  // Exécuter la requête
  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des FAQ:", error)
    throw new Error("Impossible de récupérer les FAQ")
  }

  return data.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
    is_published: item.is_published,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }))
}

// Créer une nouvelle FAQ
export async function createFaqItem(faqData: {
  question: string
  answer: string
  category: TicketCategory
  is_published: boolean
}): Promise<FaqItem | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("faq_items")
    .insert([
      {
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        is_published: faqData.is_published,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de la FAQ:", error)
    throw new Error("Impossible de créer la FAQ")
  }

  revalidatePath("/support")

  return {
    id: data.id,
    question: data.question,
    answer: data.answer,
    category: data.category,
    is_published: data.is_published,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Mettre à jour une FAQ
export async function updateFaqItem(
  id: string,
  faqData: {
    question?: string
    answer?: string
    category?: TicketCategory
    is_published?: boolean
  },
): Promise<FaqItem | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("faq_items")
    .update({
      question: faqData.question,
      answer: faqData.answer,
      category: faqData.category,
      is_published: faqData.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la mise à jour de la FAQ:", error)
    throw new Error("Impossible de mettre à jour la FAQ")
  }

  revalidatePath("/support")

  return {
    id: data.id,
    question: data.question,
    answer: data.answer,
    category: data.category,
    is_published: data.is_published,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Supprimer une FAQ
export async function deleteFaqItem(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("faq_items").delete().eq("id", id)

  if (error) {
    console.error("Erreur lors de la suppression de la FAQ:", error)
    throw new Error("Impossible de supprimer la FAQ")
  }

  revalidatePath("/support")
}
