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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, MoreHorizontal, Star, MapPin, Phone, Clock, Edit, Trash, Filter } from "lucide-react"
import Image from "next/image"

// Données fictives pour les pizzerias
const pizzerias = [
  {
    id: 1,
    name: "Napoli Authentic",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    address: "15 Rue de la République, Paris",
    phone: "+33 1 23 45 67 89",
    openingHours: "11:00 - 23:00",
    tags: ["Italienne", "Traditionnelle"],
    status: "active",
    ordersCount: 245,
    revenue: 4850,
  },
  {
    id: 2,
    name: "Pizza Bella",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    address: "8 Avenue des Champs-Élysées, Paris",
    phone: "+33 1 23 45 67 89",
    openingHours: "11:30 - 22:30",
    tags: ["Gourmet", "Bio"],
    status: "active",
    ordersCount: 187,
    revenue: 3740,
  },
  {
    id: 3,
    name: "Roma Pizza",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    address: "23 Boulevard Saint-Michel, Paris",
    phone: "+33 1 23 45 67 89",
    openingHours: "12:00 - 23:30",
    tags: ["Romaine", "À emporter"],
    status: "active",
    ordersCount: 156,
    revenue: 3120,
  },
  {
    id: 4,
    name: "Mamma Mia",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    address: "42 Rue de Rivoli, Paris",
    phone: "+33 1 23 45 67 89",
    openingHours: "11:00 - 22:00",
    tags: ["Familiale", "Desserts"],
    status: "active",
    ordersCount: 132,
    revenue: 2640,
  },
  {
    id: 5,
    name: "Pizz'Art",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.4,
    address: "17 Rue Mouffetard, Paris",
    phone: "+33 1 23 45 67 89",
    openingHours: "12:00 - 23:00",
    tags: ["Créative", "Végétarienne"],
    status: "inactive",
    ordersCount: 98,
    revenue: 1960,
  },
]

export default function PizzeriasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPizzeria, setSelectedPizzeria] = useState<number | null>(null)

  // Filtrer les pizzerias en fonction du terme de recherche et de l'onglet actif
  const filteredPizzerias = pizzerias.filter((pizzeria) => {
    const matchesSearch =
      pizzeria.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizzeria.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizzeria.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && pizzeria.status === "active"
    if (activeTab === "inactive") return matchesSearch && pizzeria.status === "inactive"

    return matchesSearch
  })

  const handleEdit = (id: number) => {
    setSelectedPizzeria(id)
    // Logique pour ouvrir le dialogue d'édition
  }

  const handleDelete = (id: number) => {
    setSelectedPizzeria(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Logique pour supprimer la pizzeria
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Gestion des Pizzerias</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="h-8 w-8"
          >
            {view === "grid" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            )}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FFB000] hover:bg-[#FF914D]">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une pizzeria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle pizzeria</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter une nouvelle pizzeria à la plateforme.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la pizzeria</Label>
                    <Input id="name" placeholder="Nom de la pizzeria" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="+33 1 23 45 67 89" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="Adresse complète" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening">Heures d'ouverture</Label>
                    <Input id="opening" placeholder="11:00 - 23:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="Italienne, Traditionnelle" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description de la pizzeria" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image (URL)</Label>
                  <Input id="image" placeholder="URL de l'image" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="active" defaultChecked />
                  <Label htmlFor="active">Activer immédiatement</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une pizzeria..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="inactive">Inactives</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPizzerias.map((pizzeria) => (
                <Card key={pizzeria.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={pizzeria.image || "/placeholder.svg"}
                      alt={pizzeria.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          pizzeria.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {pizzeria.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg font-montserrat">{pizzeria.name}</h3>
                      <div className="flex items-center gap-1 text-[#FFB000]">
                        <Star className="fill-[#FFB000] h-4 w-4" />
                        <span className="text-sm font-medium">{pizzeria.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{pizzeria.address}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <Phone className="h-4 w-4" />
                      <span>{pizzeria.phone}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{pizzeria.openingHours}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pizzeria.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-[#FF914D]/10 text-[#9B1B1B] hover:bg-[#FF914D]/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">{pizzeria.ordersCount}</span> commandes
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(pizzeria.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(pizzeria.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pizzeria</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Commandes</TableHead>
                      <TableHead>Revenu</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPizzerias.map((pizzeria) => (
                      <TableRow key={pizzeria.id}>
                        <TableCell className="font-medium">{pizzeria.name}</TableCell>
                        <TableCell>{pizzeria.address}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="fill-[#FFB000] text-[#FFB000] h-4 w-4 mr-1" />
                            {pizzeria.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pizzeria.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {pizzeria.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pizzeria.ordersCount}</TableCell>
                        <TableCell>{pizzeria.revenue.toFixed(2)} €</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEdit(pizzeria.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(pizzeria.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Supprimer
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
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette pizzeria ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
