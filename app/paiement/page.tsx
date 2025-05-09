"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createInvoiceOnServer, getGatewayUrl } from "@/actions"

export default function PaymentFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { clearCart, subtotal: cartSubtotal, total: cartTotal, items } = useCart()

  const [isLoading, setIsLoading] = useState(false)
  const [mobileNumber, setMobileNumber] = useState("")

  // Get order details from URL params
  const urlTotal = Number(searchParams.get("total") || "0")
  const urlSubtotal = Number(searchParams.get("subtotal") || "0")
  const address = searchParams.get("address") || ""
  const orderId = searchParams.get("orderId") || `ORD-${Date.now()}`

  const subtotal = urlSubtotal || cartSubtotal
  const total = urlTotal || cartTotal

  useEffect(() => {
    if (subtotal === 0 && cartSubtotal === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Veuillez ajouter des articles avant de procéder au paiement.",
        variant: "destructive",
      })
      router.push("/panier")
    }
  }, [subtotal, cartSubtotal, router, toast])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mobileNumber) {
      toast({
        title: "Numéro manquant",
        description: "Veuillez saisir votre numéro de téléphone.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const invoiceData = {
        payer_msisdn: mobileNumber,
        amount: total,
        short_description: "Paiement service X",
        payer_email: "", // Provide a valid email if available
        description: "Paiement pour le service premium de mars 2025",
        external_reference: "TXN-INV-0001",
      };
  
      const invoice = await createInvoiceOnServer(invoiceData);
  
      const { url } = await getGatewayUrl(invoice.e_bill.bill_id);
      window.location.href = url;
    } catch (err) {
      console.error("Erreur lors du paiement :", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/panier">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au récapitulatif
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Finalisez votre paiement !</CardTitle>
            <CardDescription>Entrez votre numéro pour recevoir la demande de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Numéro de téléphone *</Label>
                <Input
                  id="mobileNumber"
                  placeholder="07X XXX XXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Vous recevrez une demande de paiement sur ce numéro
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ac1f1f] hover:bg-[#8e1a1a]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  "Poursuivre le paiement"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Récapitulatif de la commande */}
        <Card className="h-fit sticky top-4">
          <CardHeader>
            <CardTitle>Votre commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md mt-4">
              <h3 className="text-sm font-medium mb-1">Adresse de livraison</h3>
              <p className="text-sm">{address || "Non spécifiée"}</p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Paiement sécurisé via EBilling. Vos données sont protégées.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}