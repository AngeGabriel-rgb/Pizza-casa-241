"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ShoppingBag, Store, Users, TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/types/dashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardClientProps {
  stats: DashboardStats
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  // Format price in EUR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Tableau de Bord</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Commandes totales</p>
                <h3 className="text-2xl font-bold">{stats.total_orders}</h3>
              </div>
              <div className="h-12 w-12 bg-[#FFB000]/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-[#FFB000]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Chiffre d'affaires</p>
                <h3 className="text-2xl font-bold">{formatPrice(stats.total_revenue)}</h3>
              </div>
              <div className="h-12 w-12 bg-[#FFB000]/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#FFB000]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pizzerias</p>
                <h3 className="text-2xl font-bold">{stats.total_pizzerias}</h3>
              </div>
              <div className="h-12 w-12 bg-[#FFB000]/10 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-[#FFB000]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Utilisateurs</p>
                <h3 className="text-2xl font-bold">{stats.total_users}</h3>
              </div>
              <div className="h-12 w-12 bg-[#FFB000]/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-[#FFB000]" />
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
                <Link href="/commandes" className="flex items-center">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recent_orders.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)} - {getStatusLabel(order.status)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <p className="text-sm text-muted-foreground">{order.pizzerias.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune commande récente</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tickets récents</CardTitle>
                <CardDescription>Les derniers tickets de support</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/support" className="flex items-center">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recent_tickets.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={ticket.users.avatar_url || "/placeholder.svg?height=40&width=40"}
                            alt={ticket.users.name}
                          />
                          <AvatarFallback>{ticket.users.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">{ticket.users.name}</p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        className={
                          ticket.status === "open"
                            ? "bg-blue-100 text-blue-800"
                            : ticket.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {ticket.status === "open" ? "Ouvert" : ticket.status === "pending" ? "En attente" : "Fermé"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucun ticket récent</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Pizzerias */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Top Pizzerias</CardTitle>
                <CardDescription>Les pizzerias les plus actives</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pizzerias" className="flex items-center">
                  Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.top_pizzerias.length > 0 ? (
              <div className="space-y-4">
                {stats.top_pizzerias.map((pizzeria) => (
                  <div key={pizzeria.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted relative overflow-hidden">
                        <img
                          src={pizzeria.image || "/placeholder.svg?height=40&width=40"}
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
                        className={`h-2 w-2 rounded-full ${
                          pizzeria.status === "active" ? "bg-green-500" : "bg-gray-400"
                        } mr-2`}
                      ></span>
                      <span className="text-sm">{pizzeria.status === "active" ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Aucune pizzeria disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Statut des commandes</CardTitle>
                <CardDescription>Répartition des commandes par statut</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Confirmées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.orders_by_status.confirmed}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(stats.orders_by_status.confirmed / stats.total_orders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>En préparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.orders_by_status.preparing}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${(stats.orders_by_status.preparing / stats.total_orders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span>En livraison</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.orders_by_status.delivering}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${(stats.orders_by_status.delivering / stats.total_orders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Livrées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.orders_by_status.delivered}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(stats.orders_by_status.delivered / stats.total_orders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Annulées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.orders_by_status.cancelled}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(stats.orders_by_status.cancelled / stats.total_orders) * 100 || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Fonction utilitaire pour obtenir le libellé du statut
function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed":
      return "Confirmée"
    case "preparing":
      return "En préparation"
    case "delivering":
      return "En livraison"
    case "delivered":
      return "Livrée"
    case "cancelled":
      return "Annulée"
    default:
      return status
  }
}
