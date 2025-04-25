"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { getPizzeriaById } from "@/data/pizzerias"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { items, updateQuantity, removeItem, clearCart, pizzeriaId, subtotal, deliveryFee, total } = useCart()

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile">("cash")
  const [isProcessing, setIsProcessing] = useState(false)

  const pizzeria = pizzeriaId ? getPizzeriaById(pizzeriaId) : null

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour finaliser votre commande.",
        variant: "destructive",
      })
      router.push("/connexion")
      return
    }

    if (!deliveryAddress) {
      toast({
        title: "Adresse requise",
        description: "Veuillez saisir une adresse de livraison.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été confirmée et est en cours de préparation.",
      })
      clearCart()
      router.push("/commandes")
      setIsProcessing(false)
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">Vous n'avez pas encore ajouté de pizzas à votre panier.</p>
            <Button asChild>
              <Link href="/pizzerias">Parcourir les pizzerias</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Articles ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pizzeria && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                    <div className="h-10 w-10 relative bg-white rounded-full overflow-hidden">
                      <Image
                        src={pizzeria.logo || "/placeholder.svg"}
                        alt={pizzeria.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{pizzeria.name}</h3>
                      <p className="text-sm text-muted-foreground">{pizzeria.address}</p>
                    </div>
                  </div>
                )}

                {items.map((item) => (
                  <div key={item.pizza.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.pizza.image || "/placeholder.svg"}
                        alt={item.pizza.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.pizza.name}</h3>
                        <p className="font-semibold">{formatPrice(item.pizza.price * item.quantity)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.pizza.description}</p>
                      {item.specialInstructions && (
                        <p className="text-sm italic mb-2">
                          <span className="font-medium">Instructions: </span>
                          {item.specialInstructions}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeItem(item.pizza.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Vider le panier
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
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

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse de livraison</Label>
                    <Input
                      id="address"
                      placeholder="123 Rue des Palmiers, Libreville"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment">Méthode de paiement</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as "cash" | "card" | "mobile")}
                    >
                      <SelectTrigger id="payment">
                        <SelectValue placeholder="Choisir une méthode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Paiement à la livraison</SelectItem>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                  {isProcessing ? "Traitement en cours..." : "Commander"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
