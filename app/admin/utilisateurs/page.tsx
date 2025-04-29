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
import { Search, MoreHorizontal, Eye, UserCog, ShoppingBag, Ban, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Données fictives pour les utilisateurs
const users = [
  {
    id: 1,
    name: "Jean ",
    email: "jean.dupont@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
    role: "user",
    registeredDate: "15/01/2023",
    ordersCount: 12,
    totalSpent: 345.8,
    lastLogin: "Il y a 2 heures",
    addresses: [
      {
        name: "Domicile",
        street: "15 Rue de la Paix",
        city: "Paris",
        postalCode: "75001",
      },
      {
        name: "Bureau",
        street: "42 Avenue des Champs-Élysées",
        city: "Paris",
        postalCode: "75008",
      },
    ],
  },
  {
    id: 2,
    name: "Marie ",
    email: "marie.martin@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
    role: "user",
    registeredDate: "22/02/2023",
    ordersCount: 8,
    totalSpent: 210.5,
    lastLogin: "Il y a 1 jour",
    addresses: [
      {
        name: "Domicile",
        street: "8 Rue du Commerce",
        city: "Lyon",
        postalCode: "69002",
      },
    ],
  },
  {
    id: 3,
    name: "Leroy",
    email: "thomas.leroy@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "inactive",
    role: "user",
    registeredDate: "10/03/2023",
    ordersCount: 3,
    totalSpent: 87.2,
    lastLogin: "Il y a 2 mois",
    addresses: [
      {
        name: "Domicile",
        street: "23 Boulevard Saint-Michel",
        city: "Paris",
        postalCode: "75005",
      },
    ],
  },
  {
    id: 4,
    name: " Bernard",
    email: "sophie.bernard@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "active",
    role: "admin",
    registeredDate: "05/12/2022",
    ordersCount: 15,
    totalSpent: 420.3,
    lastLogin: "Il y a 5 heures",
    addresses: [
      {
        name: "Domicile",
        street: "42 Rue de Rivoli",
        city: "Paris",
        postalCode: "75004",
      },
    ],
  },
  {
    id: 5,
    name: "Lucas ",
    email: "lucas.petit@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "blocked",
    role: "user",
    registeredDate: "18/04/2023",
    ordersCount: 1,
    totalSpent: 42.3,
    lastLogin: "Il y a 3 mois",
    addresses: [
      {
        name: "Domicile",
        street: "17 Rue Mouffetard",
        city: "Paris",
        postalCode: "75005",
      },
    ],
  },
]

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"
    if (activeTab === "blocked") return matchesSearch && user.status === "blocked"
    if (activeTab === "admin") return matchesSearch && user.role === "admin"

    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "blocked":
        return "Bloqué"
      default:
        return status
    }
  }

  const handleViewDetails = (id: number) => {
    setSelectedUser(id)
    setIsDetailsOpen(true)
  }

  const getSelectedUser = () => {
    return users.find((user) => user.id === selectedUser)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Gestion des Utilisateurs</h2>
        <Button className="bg-[#FFB000] hover:bg-[#FF914D]">
          <UserCog className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un utilisateur..."
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
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
          <TabsTrigger value="blocked">Bloqués</TabsTrigger>
          <TabsTrigger value="admin">Administrateurs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{getStatusLabel(user.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role === "admin" ? "Administrateur" : "Utilisateur"}</Badge>
                      </TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell>{user.ordersCount}</TableCell>
                      <TableCell>{user.totalSpent.toFixed(2)} €</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Voir les commandes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="h-4 w-4 mr-2" />
                              {user.status === "blocked" ? "Débloquer" : "Bloquer"}
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
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de l'utilisateur</DialogTitle>
                <DialogDescription>Informations complètes sur l'utilisateur et son activité.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {getSelectedUser() && (
                  <>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={getSelectedUser()?.avatar || "/placeholder.svg"}
                          alt={getSelectedUser()?.name}
                        />
                        <AvatarFallback>{getSelectedUser()?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{getSelectedUser()?.name}</h3>
                        <p className="text-gray-500">{getSelectedUser()?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(getSelectedUser()?.status || "")}>
                            {getStatusLabel(getSelectedUser()?.status || "")}
                          </Badge>
                          <Badge variant="outline">
                            {getSelectedUser()?.role === "admin" ? "Administrateur" : "Utilisateur"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Date d'inscription</h4>
                        <p>{getSelectedUser()?.registeredDate}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Dernière connexion</h4>
                        <p>{getSelectedUser()?.lastLogin}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Nombre de commandes</h4>
                        <p>{getSelectedUser()?.ordersCount}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Total dépensé</h4>
                        <p>{getSelectedUser()?.totalSpent.toFixed(2)} €</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Adresses</h4>
                      <div className="space-y-2">
                        {getSelectedUser()?.addresses.map((address, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium">{address.name}</div>
                            <div className="text-sm text-gray-500">
                              {address.street}, {address.postalCode} {address.city}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Modifier</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
