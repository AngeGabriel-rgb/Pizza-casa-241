"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { generateMockOrders } from "@/data/orders"
import { getPizzeriaById } from "@/data/pizzerias"
import type { Order } from "@/types/pizza"
import { ChevronRight, MapPin, Package, TrendingUp, Truck } from "lucide-react"

export default function DeliveryDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
  })

  useEffect(() => {
    if (user && user.role === "livreur") {
      // Get orders for this delivery person
      const deliveryOrders = generateMockOrders(user.id, user.role)
      setOrders(deliveryOrders)

      // Calculate stats
      setStats({
        totalDeliveries: deliveryOrders.filter((order) => order.status === "delivered").length,
        pendingDeliveries: deliveryOrders.filter((order) => ["ready", "delivering"].includes(order.status)).length,
        totalEarnings: deliveryOrders.filter((order) => order.status === "delivered").length * 1000, // 1000 FCFA per delivery
      })
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
      case "ready":
        return <Badge className="bg-yellow-500">À récupérer</Badge>
      case "delivering":
        return <Badge className="bg-orange-500">En livraison</Badge>
      case "delivered":
        return <Badge className="bg-accent">Livrée</Badge>
      default:
        return <Badge variant="outline">Inconnue</Badge>
    }
  }

  if (!user || user.role !== "livreur") {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-muted-foreground mb-8">
              Vous devez être connecté en tant que livreur pour accéder à cette page.
            </p>
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
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Livreur</h1>
        <p className="text-muted-foreground mb-8">Bienvenue, {user.name}. Voici un aperçu de votre activité.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Livraisons totales</p>
                  <h3 className="text-2xl font-bold">{stats.totalDeliveries}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Livraisons en attente</p>
                  <h3 className="text-2xl font-bold">{stats.pendingDeliveries}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Gains totaux</p>
                  <h3 className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deliveries */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Livraisons à effectuer</CardTitle>
                <CardDescription>Commandes prêtes à être livrées</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/livreur/livraisons" className="flex items-center">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {orders.filter((order) => ["ready", "delivering"].includes(order.status)).length > 0 ? (
              <div className="space-y-4">
                {orders
                  .filter((order) => ["ready", "delivering"].includes(order.status))
                  .map((order) => {
                    const pizzeria = getPizzeriaById(order.pizzeriaId)

                    return (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">Commande #{order.id}</h3>
                                {getStatusBadge(order.status)}
                              </div>

                              {pizzeria && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="h-8 w-8 relative bg-white rounded-full overflow-hidden">
                                    <Image
                                      src={pizzeria.logo || "/placeholder.svg"}
                                      alt={pizzeria.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{pizzeria.name}</span>
                                </div>
                              )}

                              <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{order.deliveryAddress}</span>
                              </div>

                              <div className="text-sm">
                                <span className="text-muted-foreground">Articles: </span>
                                <span className="font-medium">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <div className="text-right">
                                <p className="font-semibold">{formatPrice(order.total)}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                              </div>

                              <Button className="mt-2" asChild>
                                <Link href={`/livreur/livraisons/${order.id}`}>
                                  {order.status === "ready" ? "Récupérer" : "Détails"}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune livraison en attente</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Livraisons récentes</CardTitle>
            <CardDescription>Historique de vos dernières livraisons</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.filter((order) => order.status === "delivered").length > 0 ? (
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "delivered")
                  .slice(0, 5)
                  .map((order) => {
                    const pizzeria = getPizzeriaById(order.pizzeriaId)

                    return (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          {pizzeria && (
                            <div className="h-10 w-10 relative bg-white rounded-full overflow-hidden">
                              <Image
                                src={pizzeria.logo || "/placeholder.svg"}
                                alt={pizzeria.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">Commande #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(order.total)}</p>
                          <Badge className="bg-accent">Livrée</Badge>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune livraison effectuée</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
