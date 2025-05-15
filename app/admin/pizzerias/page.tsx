import { Suspense } from "react"
import { getPizzerias } from "@/app/api/pizzeria/actions"
import PizzeriasClient from "./pizzerias-client"

export const dynamic = "force-dynamic"

export default async function PizzeriasPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement des pizzerias...</div>}>
      <PizzeriasContent />
    </Suspense>
  )
}

async function PizzeriasContent() {
  // Récupérer toutes les pizzerias
  const pizzerias = await getPizzerias()

  return <PizzeriasClient initialPizzerias={pizzerias} />
}
