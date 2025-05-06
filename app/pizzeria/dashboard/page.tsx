"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { generateMockOrders } from "@/data/orders"
import { getPizzasByPizzeriaId } from "@/data/pizzas"
import { ChevronRight, Pizza, ShoppingBag, TrendingUp } from "lucide-react"

export default function PizzeriaDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [pizzas, setPizzas] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  })

  useEffect(() => {
    if (user && user.role === "pizzeria") {
      // Get orders for this pizzeria
      const pizzeriaOrders = generateMockOrders(user.id, user.role)
      setOrders(pizzeriaOrders)

      // Get pizzas for this pizzeria
      const pizzeriaProducts = getPizzasByPizzeriaId(user.id)
      setPizzas(pizzeriaProducts)

      // Calculate stats
      setStats({
        totalOrders: pizzeriaOrders.length,
        totalRevenue: pizzeriaOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: pizzeriaOrders.filter((order) => ["pending", "confirmed", "preparing"].includes(order.status))
          .length,
        totalProducts: pizzeriaProducts.length,
      })
    }
  }, [user])

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  if (!user || user.role !== "pizzeria") {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-muted-foreground mb-8">
              Vous devez être connecté en tant que pizzeria pour accéder à cette page.
            </p>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
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
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground mb-8">Bienvenue, {user.name}. Voici un aperçu de votre activité.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Commandes totales</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Chiffre d'affaires</p>
                  <h3 className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Commandes en cours</p>
                  <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pizzas au menu</p>
                  <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Pizza className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Commandes récentes</CardTitle>
                  <CardDescription>Les dernières commandes reçues</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pizzeria/commandes" className="flex items-center">
                    Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Commande #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")} - {order.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune commande récente</p>
              )}
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pizzas populaires</CardTitle>
                  <CardDescription>Vos pizzas les plus commandées</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/pizzeria/menu" className="flex items-center">
                    Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pizzas.length > 0 ? (
                <div className="space-y-4">
                  {pizzas
                    .filter((p) => p.isPopular)
                    .slice(0, 5)
                    .map((pizza) => (
                      <div key={pizza.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden">
                            <img
                              src={pizza.image || "/placeholder.svg"}
                              alt={pizza.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{pizza.name}</p>
                            <p className="text-sm text-muted-foreground">{pizza.category}</p>
                          </div>
                        </div>
                        <p className="font-semibold">{formatPrice(pizza.price)}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune pizza disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
