"use server"

import { createClient } from "@/utils/supabase/server"
import type { User, UserFilter, UserStatus } from "@/types/user"
import { revalidatePath } from "next/cache"

// Récupérer tous les utilisateurs avec filtrage
export async function getUsers(filter?: UserFilter): Promise<User[]> {
  const supabase = createClient()

  let query = supabase.from("users").select("*, addresses(*)")

  // Appliquer les filtres
  if (filter) {
    if (filter.status) {
      query = query.eq("status", filter.status)
    }

    if (filter.role) {
      query = query.eq("role", filter.role)
    }

    if (filter.search) {
      query = query.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    throw new Error("Impossible de récupérer les utilisateurs")
  }

  // Formater les données pour correspondre à notre type User
  return data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
    status: user.status,
    role: user.role,
    registered_date: new Date(user.created_at).toLocaleDateString("fr-FR"),
    orders_count: user.orders_count || 0,
    total_spent: user.total_spent || 0,
    last_login: user.last_login ? formatLastLogin(new Date(user.last_login)) : "Jamais",
    addresses: user.addresses || [],
    created_at: user.created_at,
    updated_at: user.updated_at,
  }))
}

// Récupérer un utilisateur par ID
export async function getUserById(id: string): Promise<User | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("users").select("*, addresses(*)").eq("id", id).single()

  if (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url,
    status: data.status,
    role: data.role,
    registered_date: new Date(data.created_at).toLocaleDateString("fr-FR"),
    orders_count: data.orders_count || 0,
    total_spent: data.total_spent || 0,
    last_login: data.last_login ? formatLastLogin(new Date(data.last_login)) : "Jamais",
    addresses: data.addresses || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Créer un nouvel utilisateur
export async function createUser(userData: Partial<User>): Promise<User | null> {
  const supabase = createClient()

  // Extraire les adresses pour les insérer séparément
  const { addresses, ...userDataWithoutAddresses } = userData

  // Insérer l'utilisateur
  const { data: newUser, error } = await supabase
    .from("users")
    .insert([
      {
        name: userDataWithoutAddresses.name,
        email: userDataWithoutAddresses.email,
        avatar_url: userDataWithoutAddresses.avatar_url,
        status: userDataWithoutAddresses.status || "active",
        role: userDataWithoutAddresses.role || "user",
        orders_count: userDataWithoutAddresses.orders_count || 0,
        total_spent: userDataWithoutAddresses.total_spent || 0,
        last_login: userDataWithoutAddresses.last_login,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    throw new Error("Impossible de créer l'utilisateur")
  }

  // Si des adresses ont été fournies, les insérer
  if (addresses && addresses.length > 0 && newUser) {
    const addressesWithUserId = addresses.map((address) => ({
      ...address,
      user_id: newUser.id,
    }))

    const { error: addressError } = await supabase.from("addresses").insert(addressesWithUserId)

    if (addressError) {
      console.error("Erreur lors de l'ajout des adresses:", addressError)
    }
  }

  revalidatePath("/utilisateurs")

  // Récupérer l'utilisateur complet avec ses adresses
  return await getUserById(newUser.id)
}

// Mettre à jour un utilisateur existant
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  const supabase = createClient()

  // Extraire les adresses pour les traiter séparément
  const { addresses, ...userDataWithoutAddresses } = userData

  // Mettre à jour l'utilisateur
  const { error } = await supabase
    .from("users")
    .update({
      name: userDataWithoutAddresses.name,
      email: userDataWithoutAddresses.email,
      avatar_url: userDataWithoutAddresses.avatar_url,
      status: userDataWithoutAddresses.status,
      role: userDataWithoutAddresses.role,
      orders_count: userDataWithoutAddresses.orders_count,
      total_spent: userDataWithoutAddresses.total_spent,
      last_login: userDataWithoutAddresses.last_login,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    throw new Error("Impossible de mettre à jour l'utilisateur")
  }

  // Si des adresses ont été fournies, les mettre à jour
  if (addresses && addresses.length > 0) {
    // Supprimer les anciennes adresses
    await supabase.from("addresses").delete().eq("user_id", id)

    // Ajouter les nouvelles adresses
    const addressesWithUserId = addresses.map((address) => ({
      ...address,
      user_id: id,
    }))

    const { error: addressError } = await supabase.from("addresses").insert(addressesWithUserId)

    if (addressError) {
      console.error("Erreur lors de la mise à jour des adresses:", addressError)
    }
  }

  revalidatePath("/utilisateurs")

  // Récupérer l'utilisateur mis à jour
  return await getUserById(id)
}

// Changer le statut d'un utilisateur (bloquer/débloquer)
export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("users")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    throw new Error("Impossible de mettre à jour le statut de l'utilisateur")
  }

  revalidatePath("/utilisateurs")
}

// Supprimer un utilisateur
export async function deleteUser(id: string): Promise<void> {
  const supabase = createClient()

  // Supprimer d'abord les adresses (contrainte de clé étrangère)
  const { error: addressError } = await supabase.from("addresses").delete().eq("user_id", id)

  if (addressError) {
    console.error("Erreur lors de la suppression des adresses:", addressError)
  }

  // Supprimer l'utilisateur
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
    throw new Error("Impossible de supprimer l'utilisateur")
  }

  revalidatePath("/utilisateurs")
}

// Fonction utilitaire pour formater le temps écoulé depuis la dernière connexion
function formatLastLogin(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMins < 60) {
    return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
  } else if (diffDays < 30) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
  } else {
    return `Il y a ${diffMonths} mois`
  }
}
