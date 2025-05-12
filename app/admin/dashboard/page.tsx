import { Suspense } from "react"
import { getDashboardStats } from "@/app/api/dashboard/actions"
import DashboardClient from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement du tableau de bord...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

async function DashboardContent() {
  // Récupérer les statistiques du tableau de bord
  const stats = await getDashboardStats()

  return <DashboardClient stats={stats} />
}
