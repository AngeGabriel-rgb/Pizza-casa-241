"use server"

import { createClient } from "@/utils/supabase/server"
import type { DashboardStats } from "@/types/dashboard"
import type { OrderStatus } from "@/types/order"
import type { TicketStatus } from "@/types/support"

// Récupérer les statistiques pour le tableau de bord
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  // Nombre total d'utilisateurs
  const { count: totalUsers, error: usersError } = await supabase.from("users").select("*", { count: "exact" })

  if (usersError) {
    console.error("Erreur lors du comptage des utilisateurs:", usersError)
    throw new Error("Impossible de compter les utilisateurs")
  }

  // Nombre total de pizzerias
  const { count: totalPizzerias, error: pizzeriasError } = await supabase
    .from("pizzerias")
    .select("*", { count: "exact" })

  if (pizzeriasError) {
    console.error("Erreur lors du comptage des pizzerias:", pizzeriasError)
    throw new Error("Impossible de compter les pizzerias")
  }

  // Nombre total de commandes
  const { count: totalOrders, error: ordersError } = await supabase.from("orders").select("*", { count: "exact" })

  if (ordersError) {
    console.error("Erreur lors du comptage des commandes:", ordersError)
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
  const { data: orderStatusData, error: orderStatusError } = await supabase.from("orders").select("status")

  if (orderStatusError) {
    console.error("Erreur lors du comptage des statuts de commande:", orderStatusError)
    throw new Error("Impossible de compter les statuts de commande")
  }

  const ordersByStatus = {
    confirmed: 0,
    preparing: 0,
    delivering: 0,
    delivered: 0,
    cancelled: 0,
  }

  orderStatusData.forEach((order) => {
    ordersByStatus[order.status as OrderStatus]++
  })

  // Nombre de tickets par statut
  const { data: ticketStatusData, error: ticketStatusError } = await supabase.from("support_tickets").select("status")

  if (ticketStatusError) {
    console.error("Erreur lors du comptage des statuts de ticket:", ticketStatusError)
    throw new Error("Impossible de compter les statuts de ticket")
  }

  const ticketsByStatus = {
    open: 0,
    pending: 0,
    closed: 0,
  }

  ticketStatusData.forEach((ticket) => {
    ticketsByStatus[ticket.status as TicketStatus]++
  })

  // Commandes récentes
  const { data: recentOrdersData, error: recentOrdersError } = await supabase
    .from("orders")
    .select(
      `
      *,
      users!orders_customer_id_fkey (
        name,
        email
      ),
      pizzerias!orders_pizzeria_id_fkey (
        name
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  if (recentOrdersError) {
    console.error("Erreur lors de la récupération des commandes récentes:", recentOrdersError)
    throw new Error("Impossible de récupérer les commandes récentes")
  }

  // Tickets récents
  const { data: recentTicketsData, error: recentTicketsError } = await supabase
    .from("support_tickets")
    .select(
      `
      *,
      users!support_tickets_customer_id_fkey (
        name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  if (recentTicketsError) {
    console.error("Erreur lors de la récupération des tickets récents:", recentTicketsError)
    throw new Error("Impossible de récupérer les tickets récents")
  }

  // Top pizzerias par nombre de commandes
  const { data: topPizzeriasData, error: topPizzeriasError } = await supabase.rpc("get_top_pizzerias", { limit_num: 5 })

  if (topPizzeriasError) {
    console.error("Erreur lors de la récupération des top pizzerias:", topPizzeriasError)
    // Fallback si la fonction RPC n'existe pas
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("pizzerias")
      .select("id, name, address, status")
      .limit(5)

    if (fallbackError) {
      console.error("Erreur lors de la récupération des pizzerias:", fallbackError)
      throw new Error("Impossible de récupérer les pizzerias")
    }

    return {
      total_orders: totalOrders || 0,
      total_revenue: totalRevenue,
      total_pizzerias: totalPizzerias || 0,
      total_users: totalUsers || 0,
      orders_by_status: ordersByStatus,
      tickets_by_status: ticketsByStatus,
      recent_orders: recentOrdersData,
      recent_tickets: recentTicketsData,
      top_pizzerias: fallbackData,
    }
  }

  return {
    total_orders: totalOrders || 0,
    total_revenue: totalRevenue,
    total_pizzerias: totalPizzerias || 0,
    total_users: totalUsers || 0,
    orders_by_status: ordersByStatus,
    tickets_by_status: ticketsByStatus,
    recent_orders: recentOrdersData,
    recent_tickets: recentTicketsData,
    top_pizzerias: topPizzeriasData,
  }
}

// Fonction RPC pour obtenir les top pizzerias
// À exécuter dans l'éditeur SQL de Supabase
/*
CREATE OR REPLACE FUNCTION get_top_pizzerias(limit_num integer)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  status text,
  orders_count bigint,
  total_revenue numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.address,
    p.status,
    COUNT(o.id) as orders_count,
    SUM(o.total) as total_revenue
  FROM 
    pizzerias p
  LEFT JOIN 
    orders o ON p.id = o.pizzeria_id
  GROUP BY 
    p.id, p.name, p.address, p.status
  ORDER BY 
    orders_count DESC, total_revenue DESC
  LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;
*/
