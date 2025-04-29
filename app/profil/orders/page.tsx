"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Phone, Receipt, ArrowLeft } from "lucide-react"

// Données fictives pour les commandes
const orders = [
  {
    id: "CMD-123456",
    date: "15/04/2023",
    time: "19:30",
    status: "delivered",
    statusLabel: "Livrée",
    total: 32.8,
    pizzeria: {
      name: "BANTU",
      image: "/pizzerias/bantu.png",
      phone: "+241 77 45 67 89",
    },
    address: "libreville gabon ",
    items: [
      { name: "Margherita", quantity: 1, price: 9.9 },
      { name: "Quattro Formaggi", quantity: 1, price: 12.9 },
      { name: "Tiramisu", quantity: 1, price: 5.9 },
    ],
    deliveryFee: 2000.99,
    timeline: [
      { status: "confirmed", time: "19:00", label: "Commande confirmée" },
      { status: "preparing", time: "19:10", label: "En préparation" },
      { status: "delivering", time: "19:20", label: "En livraison" },
      { status: "delivered", time: "19:30", label: "Livrée" },
    ],
  },
  {
    id: "CMD-123457",
    date: "02/05/2023",
    time: "20:15",
    status: "delivered",
    statusLabel: "Livrée",
    total: 25.9,
    pizzeria: {
      name: "L'EMIR",
      image: "/pizzerias/Emir.png",
      phone: "+241 66 23 45 67",
    },
    address: "LIBREVILLE GABON",
    items: [
      { name: "Regina", quantity: 1, price: 11.9 },
      { name: "Calzone", quantity: 1, price: 13.5 },
    ],
    deliveryFee: 2.99,
    timeline: [
      { status: "confirmed", time: "19:45", label: "Commande confirmée" },
      { status: "preparing", time: "19:55", label: "En préparation" },
      { status: "delivering", time: "20:05", label: "En livraison" },
      { status: "delivered", time: "20:15", label: "Livrée" },
    ],
  },
  {
    id: "CMD-123458",
    date: "Aujourd'hui",
    time: "En cours",
    status: "preparing",
    statusLabel: "En préparation",
    total: 28.7,
    pizzeria: {
      name: "PIZZA HUT",
      image: "/pizzerias/Pizzahut.png",
  
      phone: "+241 66 45 67 89",
    },
    address: "15 Rue de la Paix, 75001 Paris",
    items: [
      { name: "Diavola", quantity: 1, price: 12.9 },
      { name: "Capricciosa", quantity: 1, price: 13.9 },
    ],
    deliveryFee: 2.99,
    timeline: [
      { status: "confirmed", time: "Il y a 10 min", label: "Commande confirmée" },
      { status: "preparing", time: "Il y a 5 min", label: "En préparation" },
      { status: "delivering", time: "À venir", label: "En livraison" },
      { status: "delivered", time: "À venir", label: "Livrée" },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800"
    case "preparing":
      return "bg-yellow-100 text-yellow-800"
    case "delivering":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "active") return order.status !== "delivered"
          if (activeTab === "delivered") return order.status === "delivered"
          return true
        })

  const getSelectedOrder = () => {
    return orders.find((order) => order.id === selectedOrder)
  }

  return (
    <div className="container py-8">
      {selectedOrder ? (
        <div>
          <Button
            variant="ghost"
            className="mb-6 text-[#9B1B1B] hover:text-[#FFB000]"
            onClick={() => setSelectedOrder(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>

          <OrderDetail order={getSelectedOrder()!} />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 font-montserrat">Mes Commandes</h1>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Aucune commande trouvée</p>
                  <Link href="/pizzerias">
                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Commander maintenant</Button>
                  </Link>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold font-montserrat">{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>{order.statusLabel}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {order.date} à {order.time}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold">{order.total.toFixed(2)} FCFA</span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={order.pizzeria.image || "/placeholder.svg"}
                              alt={order.pizzeria.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{order.pizzeria.name}</p>
                            <p className="text-xs text-gray-500">{order.items.length} articles</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#9B1B1B] hover:text-[#FFB000]"
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          Voir les détails
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#9B1B1B] border-[#9B1B1B] hover:bg-[#9B1B1B] hover:text-white"
                          >
                            Commander à nouveau
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

interface OrderDetailProps {
  order: (typeof orders)[0]
}

function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-montserrat">Commande {order.id}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {order.date} à {order.time}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>{order.statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Statut de votre commande</h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>

              {order.timeline.map((step, index) => {
                const isCompleted = order.timeline.findIndex((t) => t.status === order.status) >= index

                return (
                  <div key={step.status} className="relative z-10 flex items-center mb-6 last:mb-0">
                    <div
                      className={`h-6 w-6 rounded-full ${isCompleted ? "bg-[#FFB000]" : "bg-gray-200"} flex items-center justify-center`}
                    >
                      {isCompleted ? (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${isCompleted ? "" : "text-gray-500"}`}>{step.label}</p>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Détails de la commande</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={order.pizzeria.image || "/placeholder.svg"}
                          alt={order.pizzeria.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{order.pizzeria.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{order.pizzeria.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-1">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>{(item.price * item.quantity).toFixed(2)} €</span>
                        </div>
                      ))}

                      <div className="flex justify-between py-1 text-gray-500">
                        <span>Frais de livraison</span>
                        <span>{order.deliveryFee.toFixed(2)} FCFA</span>
                      </div>

                      <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                        <span>Total</span>
                        <span>{order.total.toFixed(2)} FCFA</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informations de livraison</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#9B1B1B] mt-0.5" />
                      <div>
                        <h4 className="font-medium">Adresse de livraison</h4>
                        <p className="text-gray-700">{order.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Receipt className="h-5 w-5 text-[#9B1B1B] mt-0.5" />
                      <div>
                        <h4 className="font-medium">Méthode de paiement</h4>
                        <p className="text-gray-700">Carte bancaire •••• 4242</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {order.status === "delivered" && (
                <div className="mt-4">
                  <Button className="w-full bg-[#FFB000] hover:bg-[#FF914D]">Commander à nouveau</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
