"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || ""
  const total = searchParams.get("total") || "0"
  const itemCount = searchParams.get("itemCount") || "0"
  const paymentMethod = searchParams.get("paymentMethod") || "AirtelMoney"

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fr-FR").format(Number(price)) + " FCFA"
  }

  // Messages personnalisés selon le mode de paiement
  const getPaymentDetails = () => {
    switch(paymentMethod) {
      case "AirtelMoney":
        return {
          title: "Paiement Airtel Money confirmé !",
          icon: "📱",
          description: "Votre paiement mobile a été validé avec succès.",
          steps: [
            "Vous recevrez un SMS de confirmation",
            "Votre commande est en préparation",
            "Livraison en cours sous 1 heure"
          ],
          receiptNote: "Conservez le SMS de paiement comme reçu."
        }
      case "EBilling":
        return {
          title: "Paiement EBilling confirmé !",
          icon: "💳",
          description: "Votre paiement a été effectué avec succès.",
          steps: [
            "Confirmation par SMS reçue",
            "Préparation en cours",
            "Livraison dans 30-45 minutes"
          ],
          receiptNote: "Votre facture EBilling fait office de reçu."
        }
      default:
        return {
          title: "Paiement confirmé !",
          icon: "✅",
          description: "Votre transaction a été validée.",
          steps: [
            "Confirmation envoyée par email",
            "Préparation en cours",
            "Livraison programmée"
          ],
          receiptNote: "Conservez votre numéro de commande."
        }
    }
  }

  const paymentDetails = getPaymentDetails()

  return (
    <div className="container py-12 max-w-md mx-auto">
      <div className="text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="text-5xl mb-2">{paymentDetails.icon}</div>
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{paymentDetails.title}</h1>
        <p className="text-muted-foreground mb-4">{paymentDetails.description}</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-2 text-left">
            <div>
              <p className="text-sm text-green-700">N° Commande:</p>
              <p className="font-medium text-green-800">#{orderId.slice(-6)}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">Articles:</p>
              <p className="font-medium text-green-800">{itemCount}</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-sm text-green-700">Montant total:</p>
            <p className="text-xl font-bold text-green-800">{formatPrice(total)}</p>
          </div>
          
          <div className="mt-2 pt-2 border-t border-green-200">
            <p className="text-xs text-green-600">{paymentDetails.receiptNote}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6 text-left bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Suivi de votre commande:</h3>
          <ul className="space-y-3">
            {paymentDetails.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1 mr-2">
                  {index + 1}
                </span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-[#ac1f1f] hover:bg-[#8e1a1a]">
            <Link href="/commandes">Voir mes commandes</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
          
          <p className="text-xs text-muted-foreground pt-2">
            Un problème avec votre commande ? <Link href="/support" className="underline">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  )
}