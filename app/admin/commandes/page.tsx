"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Printer, Download, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Données fictives pour les commandes
const orders = [
  {
    id: "CMD-123456",
    customer: {
      name: "Jean ",
      email: "jean.dupont@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    pizzeria: "Napoli Authentic",
    total: 32.8,
    status: "delivered",
    date: "15/04/2023",
    time: "19:30",
    items: [
      { name: "Margherita", quantity: 1, price: 9.9 },
      { name: "Quattro Formaggi", quantity: 1, price: 12.9 },
      { name: "Tiramisu", quantity: 1, price: 5.9 },
    ],
    deliveryFee: 2.99,
    paymentMethod: "card",
  },
  {
    id: "CMD-123457",
    customer: {
      name: "Marie Martin",
      email: "marie.martin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    pizzeria: "Pizza Bella",
    total: 25.9,
    status: "preparing",
    date: "15/04/2023",
    time: "20:15",
    items: [
      { name: "Regina", quantity: 1, price: 11.9 },
      { name: "Calzone", quantity: 1, price: 13.5 },
    ],
    deliveryFee: 2.99,
    paymentMethod: "paypal",
  },
  {
    id: "CMD-123458",
    customer: {
      name: "Thomas Leroy",
      email: "thomas.leroy@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    pizzeria: "Roma Pizza",
    total: 28.7,
    status: "confirmed",
    date: "15/04/2023",
    time: "20:45",
    items: [
      { name: "Diavola", quantity: 1, price: 12.9 },
      { name: "Capricciosa", quantity: 1, price: 13.9 },
    ],
    deliveryFee: 2.99,
    paymentMethod: "card",
  },
  {
    id: "CMD-123459",
    customer: {
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    pizzeria: "Mamma Mia",
    total: 19.5,
    status: "delivering",
    date: "15/04/2023",
    time: "19:45",
    items: [
      { name: "Margherita", quantity: 1, price: 9.9 },
      { name: "Tiramisu", quantity: 1, price: 5.9 },
    ],
    deliveryFee: 2.99,
    paymentMethod: "cash",
  },
  {
    id: "CMD-123460",
    customer: {
      name: "Lucas Petit",
      email: "lucas.petit@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    pizzeria: "Pizz'Art",
    total: 42.3,
    status: "cancelled",
    date: "15/04/2023",
    time: "18:30",
    items: [
      { name: "Quattro Formaggi", quantity: 2, price: 12.9 },
      { name: "Calzone", quantity: 1, price: 13.5 },
    ],
    deliveryFee: 2.99,
    paymentMethod: "card",
  },
]

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pizzeria.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "confirmed") return matchesSearch && order.status === "confirmed"
    if (activeTab === "preparing") return matchesSearch && order.status === "preparing"
    if (activeTab === "delivering") return matchesSearch && order.status === "delivering"
    if (activeTab === "delivered") return matchesSearch && order.status === "delivered"
    if (activeTab === "cancelled") return matchesSearch && order.status === "cancelled"

    return matchesSearch
  })

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
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
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

  const handleViewDetails = (id: string) => {
    setSelectedOrder(id)
    setIsDetailsOpen(true)
  }

  const getSelectedOrder = () => {
    return orders.find((order) => order.id === selectedOrder)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Gestion des Commandes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une commande..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="yesterday">Hier</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="custom">Personnalisé</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="preparing">En préparation</TabsTrigger>
          <TabsTrigger value="delivering">En livraison</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Pizzeria</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={order.customer.avatar || "/placeholder.svg"} alt={order.customer.name} />
                            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.customer.name}</div>
                            <div className="text-xs text-gray-500">{order.customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order.pizzeria}</TableCell>
                      <TableCell>
                        <div>{order.date}</div>
                        <div className="text-xs text-gray-500">{order.time}</div>
                      </TableCell>
                      <TableCell>{order.total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.paymentMethod === "card"
                            ? "Carte"
                            : order.paymentMethod === "paypal"
                              ? "PayPal"
                              : "Espèces"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="h-4 w-4 mr-2" />
                              Imprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de la commande {selectedOrder}</DialogTitle>
                <DialogDescription>Informations complètes sur la commande et son statut.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {getSelectedOrder() && (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Client</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getSelectedOrder()?.customer.avatar || "/placeholder.svg"}
                              alt={getSelectedOrder()?.customer.name}
                            />
                            <AvatarFallback>{getSelectedOrder()?.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{getSelectedOrder()?.customer.name}</div>
                            <div className="text-xs text-gray-500">{getSelectedOrder()?.customer.email}</div>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(getSelectedOrder()?.status || "")}>
                        {getStatusLabel(getSelectedOrder()?.status || "")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Pizzeria</h4>
                        <p>{getSelectedOrder()?.pizzeria}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Date et heure</h4>
                        <p>
                          {getSelectedOrder()?.date} à {getSelectedOrder()?.time}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Articles commandés</h4>
                      <div className="space-y-2">
                        {getSelectedOrder()?.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-gray-500 pt-2 border-t">
                          <span>Frais de livraison</span>
                          <span>{getSelectedOrder()?.deliveryFee.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span>Total</span>
                          <span>{getSelectedOrder()?.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Méthode de paiement</h4>
                      <p>
                        {getSelectedOrder()?.paymentMethod === "card"
                          ? "Carte bancaire"
                          : getSelectedOrder()?.paymentMethod === "paypal"
                            ? "PayPal"
                            : "Espèces à la livraison"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Mettre à jour le statut</h4>
                      <Select defaultValue={getSelectedOrder()?.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="preparing">En préparation</SelectItem>
                          <SelectItem value="delivering">En livraison</SelectItem>
                          <SelectItem value="delivered">Livrée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Mettre à jour</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
