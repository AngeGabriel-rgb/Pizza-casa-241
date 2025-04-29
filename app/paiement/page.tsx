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
import { CreditCard, ArrowLeft, CheckCircle2, Smartphone } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { clearCart, items } = useCart()

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [mobileNumber, setMobileNumber] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "mobile" | "airtel" | "moov">("card")

  // Get order details from URL params
  const total = searchParams.get("total") || "0"
  const subtotal = searchParams.get("subtotal") || "0"
  const deliveryFee = searchParams.get("deliveryFee") || "0"
  const address = searchParams.get("address") || ""
  const method = searchParams.get("method") || "card"
  const orderId = searchParams.get("orderId") || ""

  useEffect(() => {
    // Set initial payment method based on URL param
    if (method === "card" || method === "mobile" || method === "airtel" || method === "moov") {
      setSelectedPaymentMethod(method as any)
    }
  }, [method])

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate payment details
    if (selectedPaymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast({
          title: "Informations incomplètes",
          description: "Veuillez remplir tous les champs de la carte bancaire.",
          variant: "destructive",
        })
        return
      }
    } else if (["mobile", "airtel", "moov"].includes(selectedPaymentMethod)) {
      if (!mobileNumber) {
        toast({
          title: "Numéro manquant",
          description: "Veuillez saisir votre numéro de téléphone.",
          variant: "destructive",
        })
        return
      }
    }

    // Process payment
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")
      clearCart() // Clear the cart after successful payment

      // Show success toast
      toast({
        title: "Paiement réussi",
        description: "Votre commande a été confirmée et est en cours de préparation.",
      })

      // Clear delivery address from localStorage
      localStorage.removeItem("deliveryAddress")
    }, 2000)
  }

  // Format price in FCFA
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? Number.parseInt(price, 10) : price
    return new Intl.NumberFormat("fr-FR").format(numPrice) + " FCFA"
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
            <h1 className="text-2xl font-bold mb-4">Paiement réussi</h1>
            <p className="text-muted-foreground mb-4">
              Votre commande #{orderId.slice(-6)} a été confirmée et est en cours de préparation.
            </p>
            <p className="font-medium mb-8">Montant payé: {formatPrice(total)}</p>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/commandes">Voir mes commandes</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pizzerias">Retour aux pizzerias</Link>
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
                        Carte bancaire
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="h-4 w-4" />
                        Mobile Money
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="airtel" id="airtel" />
                      <Label htmlFor="airtel" className="flex items-center gap-2 cursor-pointer">
                        <Image src="/placeholder.svg?height=16&width=16" alt="Airtel Money" width={16} height={16} />
                        Airtel Money
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moov" id="moov" />
                      <Label htmlFor="moov" className="flex items-center gap-2 cursor-pointer">
                        <Image src="/placeholder.svg?height=16&width=16" alt="Moov Money" width={16} height={16} />
                        Moov Money
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

                  {["mobile", "airtel", "moov"].includes(selectedPaymentMethod) && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="074 XX XX XX"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full mt-6" disabled={paymentStatus === "processing"}>
                    {paymentStatus === "processing" ? "Traitement en cours..." : "Payer maintenant"}
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-gray-50 p-3 rounded-md mt-4">
                  <h3 className="text-sm font-medium mb-1">Adresse de livraison</h3>
                  <p className="text-sm">{address}</p>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    En passant votre commande, vous acceptez nos{" "}
                    <Link href="/terms" className="text-[#9B1B1B] hover:text-[#FFB000] underline">
                      conditions d'utilisation
                    </Link>
                    .
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
