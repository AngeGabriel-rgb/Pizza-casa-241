"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { Package, Clock, CheckCircle2 } from "lucide-react"

// Types pour les commandes
type OrderStatus = "en_preparation" | "en_livraison" | "livree"
type Order = {
  id: string
  date: string
  total: number
  status: OrderStatus
  items: {
    name: string
    quantity: number
    price: number
  }[]
  address: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simuler le chargement des commandes depuis une API
    // Dans une application réelle, vous feriez un appel API ici
    const mockOrders: Order[] = [
      {
        id: "ORD123456",
        date: "2023-04-28T14:30:00",
        total: 15000,
        status: "livree",
        items: [
          { name: "Pizza Margherita", quantity: 2, price: 6000 },
          { name: "Pizza Pepperoni", quantity: 1, price: 7500 },
        ],
        address: "123 Rue des Palmiers, Libreville",
      },
      {
        id: "ORD789012",
        date: "2023-04-27T19:15:00",
        total: 12500,
        status: "en_livraison",
        items: [
          { name: "Pizza Quatre Fromages", quantity: 1, price: 8000 },
          { name: "Boisson Coca-Cola", quantity: 2, price: 2250 },
        ],
        address: "45 Avenue de l'Indépendance, Libreville",
      },
    ]

    setOrders(mockOrders)
  }, [])

  // Formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  // Formater la date
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

  // Obtenir l'icône et la couleur en fonction du statut
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "en_preparation":
        return { icon: <Clock className="h-5 w-5" />, color: "text-amber-500", text: "En préparation" }
      case "en_livraison":
        return { icon: <Package className="h-5 w-5" />, color: "text-blue-500", text: "En livraison" }
      case "livree":
        return { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-500", text: "Livrée" }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
            <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
            <Button asChild>
              <Link href="/pizzerias">Commander maintenant</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status)

              return (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Commande #{order.id.slice(-6)}</CardTitle>
                    <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">Commandé le {formatDate(order.date)}</div>

                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground"> x{item.quantity}</span>
                          </div>
                          <div>{formatPrice(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <h3 className="text-sm font-medium mb-1">Adresse de livraison</h3>
                      <p className="text-sm">{order.address}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
