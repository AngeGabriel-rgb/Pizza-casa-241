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
import type { Order, OrderStatus } from "@/types/order"
import { updateOrderStatus } from "@/app/api/order/actions"
import { useToast } from "@/hooks/use-toast"

interface CommandesClientProps {
  initialOrders: Order[]
}

export default function CommandesClient({ initialOrders }: CommandesClientProps) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("")

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pizzeria_name.toLowerCase().includes(searchTerm.toLowerCase())

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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setIsUpdating(true)

    try {
      await updateOrderStatus(selectedOrder.id, newStatus as OrderStatus)
      toast({
        title: "Statut mis à jour",
        description: `La commande ${selectedOrder.id} est maintenant ${getStatusLabel(newStatus).toLowerCase()}.`,
      })
      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setIsDetailsOpen(false)
    }
  }

  const handlePrint = (order: Order) => {
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Contenu HTML à imprimer
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Commande ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { font-size: 24px; margin-bottom: 10px; }
          h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
          .info { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; margin-top: 10px; text-align: right; }
        </style>
      </head>
      <body>
        <h1>Commande ${order.id}</h1>
        <div class="info"><strong>Date:</strong> ${order.date} à ${order.time}</div>
        <div class="info"><strong>Statut:</strong> ${getStatusLabel(order.status)}</div>
        
        <h2>Client</h2>
        <div class="info"><strong>Nom:</strong> ${order.customer_name}</div>
        <div class="info"><strong>Email:</strong> ${order.customer_email}</div>
        
        <h2>Pizzeria</h2>
        <div class="info"><strong>Nom:</strong> ${order.pizzeria_name}</div>
        
        <h2>Articles commandés</h2>
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} €</td>
                <td>${(item.price * item.quantity).toFixed(2)} €</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total">Frais de livraison: ${order.delivery_fee.toFixed(2)} €</div>
        <div class="total">Total: ${order.total.toFixed(2)} €</div>
        
        <h2>Paiement</h2>
        <div class="info"><strong>Méthode:</strong> ${
          order.payment_method === "card"
            ? "Carte bancaire"
            : order.payment_method === "paypal"
              ? "PayPal"
              : "Espèces à la livraison"
        }</div>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  const handleExportCSV = () => {
    // Créer le contenu CSV
    let csvContent = "ID,Client,Pizzeria,Date,Heure,Total,Statut,Méthode de paiement\n"

    filteredOrders.forEach((order) => {
      csvContent += `${order.id},${order.customer_name},${order.pizzeria_name},${order.date},${order.time},${
        order.total
      },${getStatusLabel(order.status)},${
        order.payment_method === "card" ? "Carte bancaire" : order.payment_method === "paypal" ? "PayPal" : "Espèces"
      }\n`
    })

    // Créer un objet Blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `commandes_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Gestion des Commandes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handlePrint(filteredOrders[0])}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
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
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Aucune commande trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={order.customer_avatar || "/placeholder.svg?height=32&width=32"}
                                alt={order.customer_name}
                              />
                              <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.pizzeria_name}</TableCell>
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
                            {order.payment_method === "card"
                              ? "Carte"
                              : order.payment_method === "paypal"
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
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrint(order)}>
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                <DialogTitle>Détails de la commande {selectedOrder.id}</DialogTitle>
                <DialogDescription>Informations complètes sur la commande et son statut.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Client</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={selectedOrder.customer_avatar || "/placeholder.svg?height=32&width=32"}
                          alt={selectedOrder.customer_name}
                        />
                        <AvatarFallback>{selectedOrder.customer_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{selectedOrder.customer_name}</div>
                        <div className="text-xs text-gray-500">{selectedOrder.customer_email}</div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedOrder.status)}>{getStatusLabel(selectedOrder.status)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Pizzeria</h4>
                    <p>{selectedOrder.pizzeria_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Date et heure</h4>
                    <p>
                      {selectedOrder.date} à {selectedOrder.time}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Articles commandés</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-gray-500 pt-2 border-t">
                      <span>Frais de livraison</span>
                      <span>{selectedOrder.delivery_fee.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>{selectedOrder.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Méthode de paiement</h4>
                  <p>
                    {selectedOrder.payment_method === "card"
                      ? "Carte bancaire"
                      : selectedOrder.payment_method === "paypal"
                        ? "PayPal"
                        : "Espèces à la livraison"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mettre à jour le statut</h4>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                <Button
                  className="bg-[#FFB000] hover:bg-[#FF914D]"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || newStatus === selectedOrder.status}
                >
                  {isUpdating ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
