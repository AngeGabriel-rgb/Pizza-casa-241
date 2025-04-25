"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { generateMockOrders } from "@/data/orders"
import { getPizzeriaById } from "@/data/pizzerias"
import type { Order } from "@/types/pizza"
import { ShoppingBag } from "lucide-react"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    if (user) {
      const userOrders = generateMockOrders(user.id, user.role)
      setOrders(userOrders)
    }
  }, [user])

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">En attente</Badge>
      case "confirmed":
        return <Badge variant="secondary">Confirmée</Badge>
      case "preparing":
        return <Badge className="bg-blue-500">En préparation</Badge>
      case "ready":
        return <Badge className="bg-yellow-500">Prête</Badge>
      case "delivering":
        return <Badge className="bg-orange-500">En livraison</Badge>
      case "delivered":
        return <Badge className="bg-accent">Livrée</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="outline">Inconnue</Badge>
    }
  }

  // Filter orders by status
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p className="text-muted-foreground mb-8">Veuillez vous connecter pour voir vos commandes.</p>
            <Button asChild>
              <Link href="/connexion">Se connecter</Link>
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
        <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="preparing">En préparation</TabsTrigger>
            <TabsTrigger value="delivering">En livraison</TabsTrigger>
            <TabsTrigger value="delivered">Livrées</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const pizzeria = getPizzeriaById(order.pizzeriaId)

                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(order.status)}
                            <span className="font-semibold">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
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

                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.pizza.image || "/placeholder.svg"}
                                    alt={item.pizza.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {item.quantity} x {item.pizza.name}
                                  </p>
                                  {item.specialInstructions && (
                                    <p className="text-xs text-muted-foreground italic">{item.specialInstructions}</p>
                                  )}
                                </div>
                              </div>
                              <p className="font-medium">{formatPrice(item.pizza.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frais de livraison</span>
                            <span>{formatPrice(order.deliveryFee)}</span>
                          </div>
                          <div className="flex justify-between font-semibold mt-2">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
                          <div className="text-sm text-muted-foreground">
                            <p>Adresse de livraison: {order.deliveryAddress}</p>
                            <p>
                              Paiement:{" "}
                              {order.paymentMethod === "cash"
                                ? "Espèces à la livraison"
                                : order.paymentMethod === "card"
                                  ? "Carte bancaire"
                                  : "Mobile Money"}
                            </p>
                          </div>
                          <Button variant="outline" asChild>
                            <Link href={`/commandes/${order.id}`}>Détails</Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune commande trouvée</h3>
                <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
                <Button asChild>
                  <Link href="/pizzerias">Commander maintenant</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
