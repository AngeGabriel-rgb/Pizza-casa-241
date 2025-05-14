"use server"

import { createClient } from "@/utils/supabase/server"
import type { UserSettings, AppSettings } from "@/types/settings"
import { revalidatePath } from "next/cache"

// Récupérer les paramètres utilisateur
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Erreur lors de la récupération des paramètres utilisateur:", error)

    // Si les paramètres n'existent pas, les créer
    if (error.code === "PGRST116") {
      return await createUserSettings(userId)
    }

    return null
  }

  return {
    id: data.id,
    user_id: data.user_id,
    language: data.language,
    theme: data.theme,
    notifications_email: data.notifications_email,
    notifications_push: data.notifications_push,
    notifications_orders: data.notifications_orders,
    notifications_promotions: data.notifications_promotions,
    notifications_support: data.notifications_support,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Créer des paramètres utilisateur
async function createUserSettings(userId: string): Promise<UserSettings | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_settings")
    .insert([
      {
        user_id: userId,
        language: "fr",
        theme: "system",
        notifications_email: true,
        notifications_push: true,
        notifications_orders: true,
        notifications_promotions: false,
        notifications_support: true,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création des paramètres utilisateur:", error)
    return null
  }

  return {
    id: data.id,
    user_id: data.user_id,
    language: data.language,
    theme: data.theme,
    notifications_email: data.notifications_email,
    notifications_push: data.notifications_push,
    notifications_orders: data.notifications_orders,
    notifications_promotions: data.notifications_promotions,
    notifications_support: data.notifications_support,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Mettre à jour les paramètres utilisateur
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
): Promise<UserSettings | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_settings")
    .update({
      language: settings.language,
      theme: settings.theme,
      notifications_email: settings.notifications_email,
      notifications_push: settings.notifications_push,
      notifications_orders: settings.notifications_orders,
      notifications_promotions: settings.notifications_promotions,
      notifications_support: settings.notifications_support,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la mise à jour des paramètres utilisateur:", error)
    return null
  }

  revalidatePath("/parametres")

  return {
    id: data.id,
    user_id: data.user_id,
    language: data.language,
    theme: data.theme,
    notifications_email: data.notifications_email,
    notifications_push: data.notifications_push,
    notifications_orders: data.notifications_orders,
    notifications_promotions: data.notifications_promotions,
    notifications_support: data.notifications_support,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Récupérer les paramètres de l'application
export async function getAppSettings(): Promise<AppSettings | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Erreur lors de la récupération des paramètres de l'application:", error)
    return null
  }

  return {
    id: data.id,
    site_name: data.site_name,
    logo_url: data.logo_url,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    contact_email: data.contact_email,
    support_phone: data.support_phone,
    default_language: data.default_language,
    default_currency: data.default_currency,
    delivery_fee: data.delivery_fee,
    min_order_amount: data.min_order_amount,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Mettre à jour les paramètres de l'application
export async function updateAppSettings(settings: Partial<AppSettings>): Promise<AppSettings | null> {
  const supabase = createClient()

  // Récupérer l'ID des paramètres actuels
  const { data: currentSettings, error: fetchError } = await supabase
    .from("app_settings")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (fetchError) {
    console.error("Erreur lors de la récupération de l'ID des paramètres de l'application:", fetchError)
    return null
  }

  const { data, error } = await supabase
    .from("app_settings")
    .update({
      site_name: settings.site_name,
      logo_url: settings.logo_url,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      contact_email: settings.contact_email,
      support_phone: settings.support_phone,
      default_language: settings.default_language,
      default_currency: settings.default_currency,
      delivery_fee: settings.delivery_fee,
      min_order_amount: settings.min_order_amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", currentSettings.id)
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la mise à jour des paramètres de l'application:", error)
    return null
  }

  revalidatePath("/parametres")

  return {
    id: data.id,
    site_name: data.site_name,
    logo_url: data.logo_url,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    contact_email: data.contact_email,
    support_phone: data.support_phone,
    default_language: data.default_language,
    default_currency: data.default_currency,
    delivery_fee: data.delivery_fee,
    min_order_amount: data.min_order_amount,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}
