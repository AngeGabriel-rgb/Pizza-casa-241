import { Suspense } from "react"
import { getTickets, getFaqItems } from "@/app/api/support/actions"
import SupportClient from "./support-client"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement du support client...</div>}>
      <SupportContent />
    </Suspense>
  )
}

async function SupportContent() {
  // Récupérer tous les tickets et FAQ
  const tickets = await getTickets()
  const faqItems = await getFaqItems()

  return <SupportClient initialTickets={tickets} initialFaqItems={faqItems} />
}
