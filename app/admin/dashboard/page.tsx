"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { generateMockOrders } from "@/data/orders"
import { pizzerias } from "@/data/pizzerias"
import { ChevronRight, ShoppingBag, Store, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalPizzerias: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    if (user && user.role === "admin") {
      // Get all orders
      const allOrders = generateMockOrders(user.id, user.role)
      setOrders(allOrders)

      // Calculate stats
      setStats({
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
        totalPizzerias: pizzerias.length,
        totalUsers: 10, // Mock value
      })
    }
  }, [user])

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-muted-foreground mb-8">
              Vous devez être connecté en tant qu'administrateur pour accéder à cette page.
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
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground mb-8">Bienvenue, {user.name}. Voici un aperçu de la plateforme.</p>

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
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pizzerias</p>
                  <h3 className="text-2xl font-bold">{stats.totalPizzerias}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Utilisateurs</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
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
                  <CardDescription>Les dernières commandes sur la plateforme</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/commandes" className="flex items-center">
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
                        <p className="text-sm text-muted-foreground">Pizzeria #{order.pizzeriaId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune commande récente</p>
              )}
            </CardContent>
          </Card>

          {/* Pizzerias */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pizzerias</CardTitle>
                  <CardDescription>Les pizzerias partenaires</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/pizzerias" className="flex items-center">
                    Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pizzerias.length > 0 ? (
                <div className="space-y-4">
                  {pizzerias.slice(0, 5).map((pizzeria) => (
                    <div key={pizzeria.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden">
                          <img
                            src={pizzeria.logo || "/placeholder.svg"}
                            alt={pizzeria.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{pizzeria.name}</p>
                          <p className="text-sm text-muted-foreground">{pizzeria.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full ${pizzeria.isOpen ? "bg-accent" : "bg-muted"} mr-2`}
                        ></span>
                        <span className="text-sm">{pizzeria.isOpen ? "Ouvert" : "Fermé"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune pizzeria disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
