"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { CreditCard, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { clearCart, subtotal: cartSubtotal, total: cartTotal } = useCart()
  const { user } = useAuth()

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [mobileNumber, setMobileNumber] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "airtel">("card")

  // Get order details from URL params
  const urlTotal = Number(searchParams.get("total") || "0")
  const urlSubtotal = Number(searchParams.get("subtotal") || "0")
  const urlDeliveryFee = Number(searchParams.get("deliveryFee") || "0")
  const address = searchParams.get("address") || ""
  const method = searchParams.get("method") || "card"
  const orderId = searchParams.get("orderId") || `ORD-${Date.now()}`

  // Utiliser les valeurs de l'URL ou du contexte
  const subtotal = urlSubtotal || cartSubtotal
  const total = urlTotal || cartTotal
  const deliveryFee = subtotal > 0 ? 1500 : 0; // Calculer les frais de livraison ici

  useEffect(() => {
    if (method === "card" || method === "airtel") {
      setSelectedPaymentMethod(method as any)
    }
  }, [method])

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

    // Validation
    if (selectedPaymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast({
          title: "Informations incomplètes",
          description: "Veuillez remplir tous les champs de la carte bancaire.",
          variant: "destructive",
        })
        return
      }
    } else if (selectedPaymentMethod === "airtel") {
      if (!mobileNumber) {
        toast({
          title: "Numéro manquant",
          description: "Veuillez saisir votre numéro de téléphone Airtel Money.",
          variant: "destructive",
        })
        return
      }
    }

    setPaymentStatus("processing")

    try {
      // Simuler le traitement du paiement
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Enregistrer la commande dans la base de données
      const orderData = {
        user_id: user?.id || null,
        order_number: orderId,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: selectedPaymentMethod,
        delivery_address: address,
        status: "paid",
      }

      // Ici vous feriez normalement un appel API pour enregistrer la commande
      console.log("Order data:", orderData)

      setPaymentStatus("success")
      clearCart()
      localStorage.removeItem("deliveryAddress")

      toast({
        title: "Paiement réussi",
        description: (
          <div className="space-y-1">
            <p>Votre commande #{orderId.slice(-6)} a été confirmée.</p>
            <p className="font-medium">Montant: {formatPrice(total + deliveryFee)}</p>
            <p>Vous recevrez un SMS de confirmation.</p>
          </div>
        ),
      })
    } catch (error) {
      setPaymentStatus("error")
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement de votre paiement.",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  if (paymentStatus === "success") {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Merci pour votre commande !</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="font-medium text-green-800">Paiement confirmé: {formatPrice(total + deliveryFee)}</p>
              <p className="text-sm text-green-700 mt-1">Référence: #{orderId.slice(-6)}</p>
            </div>
            <div className="space-y-2 mb-6 text-left bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Prochaines étapes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Confirmation par SMS</li>
                <li>Préparation en cours</li>
                <li>Livraison dans 30-45 minutes</li>
              </ul>
            </div>
            <div className="space-y-4">
              <Button asChild className="w-full bg-[#ac1f1f] hover:bg-[#8e1a1a]">
                <Link href="/commandes">Suivre ma commande</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/panier">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au récapitulatif
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Paiement</CardTitle>
                <CardDescription>Choisissez votre méthode de paiement préférée</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit}>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={(value) => setSelectedPaymentMethod(value as any)}
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Carte bancaire (e-billing Gabon)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="airtel" id="airtel" />
                      <Label htmlFor="airtel" className="flex items-center gap-2 cursor-pointer">
                        <Image src="/placeholder.svg?height=16&width=16" alt="Airtel Money" width={16} height={16} />
                        Airtel Money (e-billing Gabon)
                      </Label>
                    </div>
                  </RadioGroup>

                  {selectedPaymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                        <Input
                          id="cardHolder"
                          placeholder="JOHN DOE"
                          value={cardDetails.cardHolder}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "airtel" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Numéro de téléphone Airtel</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="074 XX XX XX"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une notification sur votre téléphone Airtel pour confirmer le paiement via
                        e-billing Gabon.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-[#ac1f1f] hover:bg-[#8e1a1a]"
                    disabled={paymentStatus === "processing"}
                  >
                    {paymentStatus === "processing" ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement en cours...
                      </span>
                    ) : (
                      "Payer maintenant"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {/*<div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>*/}
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
                    Paiement sécurisé via e-billing Gabon. Vos données sont cryptées.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}