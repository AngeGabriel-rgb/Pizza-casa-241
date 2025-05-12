import { Suspense } from "react"
import { getUsers } from "@/app/api/users/actions"
import UtilisateursClient from "./utilisateurs-client"

export const dynamic = "force-dynamic"

export default async function UtilisateursPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement des utilisateurs...</div>}>
      <UtilisateursContent />
    </Suspense>
  )
}

async function UtilisateursContent() {
  // Récupérer tous les utilisateurs
  const users = await getUsers()

  return <UtilisateursClient initialUsers={users} />
}
