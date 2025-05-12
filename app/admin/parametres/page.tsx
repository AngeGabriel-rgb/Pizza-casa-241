import { Suspense } from "react"
import { getUserSettings, getAppSettings } from "@/app/api/settings/actions"
import { getUserById } from "@/app/api/users/actions"
import { createClient } from "@/utils/supabase/server"
import ParametresClient from "./parametres-client"

export const dynamic = "force-dynamic"

export default async function ParametresPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement des paramètres...</div>}>
      <ParametresContent />
    </Suspense>
  )
}

async function ParametresContent() {
  const supabase = createClient()

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    )
  }

  // Récupérer les informations de l'utilisateur
  const userData = await getUserById(user.id)

  if (!userData) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h2>
        <p>Impossible de récupérer les informations de l'utilisateur.</p>
      </div>
    )
  }

  // Récupérer les paramètres utilisateur
  const userSettings = await getUserSettings(user.id)

  // Récupérer les paramètres de l'application
  const appSettings = await getAppSettings()

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = userData.role === "admin"

  return <ParametresClient user={userData} userSettings={userSettings} appSettings={appSettings} isAdmin={isAdmin} />
}
