import { Suspense } from "react"
import { getOrders } from "@/app/api/order/actions"
import CommandesClient from "./commandes-client"

export const dynamic = "force-dynamic"

export default async function CommandesPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement des commandes...</div>}>
      <CommandesContent />
    </Suspense>
  )
}

async function CommandesContent() {
  // Récupérer toutes les commandes
  const orders = await getOrders()

  return <CommandesClient initialOrders={orders} />
}
