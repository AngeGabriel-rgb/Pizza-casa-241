"use server"

import { createClient } from "@/utils/supabase/server"
import type { Order, OrderItem, OrderStatus, OrderFilter } from "@/types/order"
import { revalidatePath } from "next/cache"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Récupérer toutes les commandes avec filtrage
export async function getOrders(filter?: OrderFilter): Promise<Order[]> {
  const supabase = createClient()

  // Construire la requête de base
  let query = supabase.from("orders").select(
    `
      *,
      users!orders_customer_id_fkey (
        name,
        email,
        avatar_url
      ),
      pizzerias!orders_pizzeria_id_fkey (
        name
      )
    `,
  )

  // Appliquer les filtres
  if (filter) {
    if (filter.status) {
      query = query.eq("status", filter.status)
    }

    if (filter.search) {
      query = query.or(`id.ilike.%${filter.search}%`)
    }

    // Filtrage par période
    if (filter.period) {
      const today = new Date()
      let startDate: Date
      let endDate = new Date()

      switch (filter.period) {
        case "today":
          startDate = today
          break
        case "yesterday":
          startDate = new Date(today)
          startDate.setDate(today.getDate() - 1)
          endDate = new Date(startDate)
          break
        case "week":
          startDate = new Date(today)
          startDate.setDate(today.getDate() - 7)
          break
        case "month":
          startDate = new Date(today)
          startDate.setMonth(today.getMonth() - 1)
          break
        case "custom":
          if (filter.startDate) {
            startDate = new Date(filter.startDate)
            if (filter.endDate) {
              endDate = new Date(filter.endDate)
            }
          } else {
            startDate = new Date(0) // Si pas de date de début spécifiée, prendre depuis le début
          }
          break
        default:
          startDate = new Date(0)
      }

      query = query
        .gte("order_date", startDate.toISOString().split("T")[0])
        .lte("order_date", endDate.toISOString().split("T")[0])
    }
  }

  // Exécuter la requête
  const { data: ordersData, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    throw new Error("Impossible de récupérer les commandes")
  }

  // Récupérer les articles pour chaque commande
  const orders: Order[] = []

  for (const orderData of ordersData) {
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderData.id)

    if (itemsError) {
      console.error("Erreur lors de la récupération des articles de commande:", itemsError)
      continue
    }

    // Formater la date pour l'affichage
    const orderDate = new Date(orderData.order_date)
    const formattedDate = format(orderDate, "dd/MM/yyyy", { locale: fr })

    // Formater l'heure pour l'affichage
    const timeParts = orderData.order_time.split(":")
    const formattedTime = `${timeParts[0]}:${timeParts[1]}`

    orders.push({
      id: orderData.id,
      customer_id: orderData.customer_id,
      customer_name: orderData.users.name,
      customer_email: orderData.users.email,
      customer_avatar: orderData.users.avatar_url,
      pizzeria_id: orderData.pizzeria_id,
      pizzeria_name: orderData.pizzerias.name,
      total: orderData.total,
      status: orderData.status,
      date: formattedDate,
      time: formattedTime,
      items: orderItems as OrderItem[],
      delivery_fee: orderData.delivery_fee,
      payment_method: orderData.payment_method,
      created_at: orderData.created_at,
      updated_at: orderData.updated_at,
    })
  }

  return orders
}

// Récupérer une commande par ID
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient()

  const { data: orderData, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      users!orders_customer_id_fkey (
        name,
        email,
        avatar_url
      ),
      pizzerias!orders_pizzeria_id_fkey (
        name
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erreur lors de la récupération de la commande:", error)
    return null
  }

  // Récupérer les articles de la commande
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderData.id)

  if (itemsError) {
    console.error("Erreur lors de la récupération des articles de commande:", itemsError)
    return null
  }

  // Formater la date pour l'affichage
  const orderDate = new Date(orderData.order_date)
  const formattedDate = format(orderDate, "dd/MM/yyyy", { locale: fr })

  // Formater l'heure pour l'affichage
  const timeParts = orderData.order_time.split(":")
  const formattedTime = `${timeParts[0]}:${timeParts[1]}`

  return {
    id: orderData.id,
    customer_id: orderData.customer_id,
    customer_name: orderData.users.name,
    customer_email: orderData.users.email,
    customer_avatar: orderData.users.avatar_url,
    pizzeria_id: orderData.pizzeria_id,
    pizzeria_name: orderData.pizzerias.name,
    total: orderData.total,
    status: orderData.status,
    date: formattedDate,
    time: formattedTime,
    items: orderItems as OrderItem[],
    delivery_fee: orderData.delivery_fee,
    payment_method: orderData.payment_method,
    created_at: orderData.created_at,
    updated_at: orderData.updated_at,
  }
}

// Créer une nouvelle commande
export async function createOrder(orderData: {
  customer_id: string
  pizzeria_id: string
  items: { name: string; quantity: number; price: number }[]
  delivery_fee?: number
  payment_method?: string
}): Promise<Order | null> {
  const supabase = createClient()

  // Calculer le total de la commande
  const itemsTotal = orderData.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = orderData.delivery_fee || 2.99
  const total = itemsTotal + deliveryFee

  // Insérer la commande
  const { data: newOrder, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_id: orderData.customer_id,
        pizzeria_id: orderData.pizzeria_id,
        total,
        delivery_fee: deliveryFee,
        payment_method: orderData.payment_method || "card",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de la commande:", error)
    throw new Error("Impossible de créer la commande")
  }

  // Insérer les articles de la commande
  const orderItems = orderData.items.map((item) => ({
    order_id: newOrder.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Erreur lors de l'ajout des articles de commande:", itemsError)
    // Supprimer la commande si l'ajout des articles échoue
    await supabase.from("orders").delete().eq("id", newOrder.id)
    throw new Error("Impossible d'ajouter les articles à la commande")
  }

  revalidatePath("/commandes")

  // Récupérer la commande complète
  return await getOrderById(newOrder.id)
}

// Mettre à jour le statut d'une commande
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const supabase = createClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erreur lors de la mise à jour du statut de la commande:", error)
    throw new Error("Impossible de mettre à jour le statut de la commande")
  }

  revalidatePath("/commandes")

  // Récupérer la commande mise à jour
  return await getOrderById(id)
}

// Supprimer une commande
export async function deleteOrder(id: string): Promise<void> {
  const supabase = createClient()

  // Supprimer d'abord les articles de la commande (contrainte de clé étrangère)
  const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", id)

  if (itemsError) {
    console.error("Erreur lors de la suppression des articles de commande:", itemsError)
  }

  // Supprimer la commande
  const { error } = await supabase.from("orders").delete().eq("id", id)

  if (error) {
    console.error("Erreur lors de la suppression de la commande:", error)
    throw new Error("Impossible de supprimer la commande")
  }

  revalidatePath("/commandes")
}

// Obtenir des statistiques sur les commandes
export async function getOrderStats() {
  const supabase = createClient()

  // Nombre total de commandes
  const { count: totalOrders, error: countError } = await supabase.from("orders").select("*", { count: "exact" })

  if (countError) {
    console.error("Erreur lors du comptage des commandes:", countError)
    throw new Error("Impossible de compter les commandes")
  }

  // Chiffre d'affaires total
  const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")

  if (revenueError) {
    console.error("Erreur lors du calcul du chiffre d'affaires:", revenueError)
    throw new Error("Impossible de calculer le chiffre d'affaires")
  }

  const totalRevenue = revenueData.reduce((sum, order) => sum + order.total, 0)

  // Nombre de commandes par statut
  const { data: statusData, error: statusError } = await supabase.from("orders").select("status")

  if (statusError) {
    console.error("Erreur lors du comptage des statuts:", statusError)
    throw new Error("Impossible de compter les statuts")
  }

  const statusCounts = {
    confirmed: 0,
    preparing: 0,
    delivering: 0,
    delivered: 0,
    cancelled: 0,
  }

  statusData.forEach((order) => {
    statusCounts[order.status as OrderStatus]++
  })

  return {
    totalOrders,
    totalRevenue,
    statusCounts,
  }
}
