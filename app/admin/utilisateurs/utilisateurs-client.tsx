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
import type { User, UserStatus } from "@/types/user"
import { updateUserStatus, deleteUser } from "@/app/api/users/actions"
import UserForm from "@/components/users/user-form"
import { useToast } from "@/hooks/use-toast"

interface UtilisateursClientProps {
  initialUsers: User[]
}

export default function UtilisateursClient({ initialUsers }: UtilisateursClientProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [actionType, setActionType] = useState<"block" | "delete" | null>(null)

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

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleNewUser = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    // Recharger la page pour obtenir les données mises à jour
    window.location.reload()
  }

  const handleToggleBlock = async (user: User) => {
    setSelectedUser(user)
    setActionType(user.status === "blocked" ? "block" : "block")
    setIsConfirmOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setActionType("delete")
    setIsConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedUser) return

    try {
      if (actionType === "block") {
        const newStatus: UserStatus = selectedUser.status === "blocked" ? "active" : "blocked"
        await updateUserStatus(selectedUser.id, newStatus)
        toast({
          title: "Statut mis à jour",
          description: `L'utilisateur a été ${newStatus === "blocked" ? "bloqué" : "débloqué"} avec succès.`,
        })
      } else if (actionType === "delete") {
        await deleteUser(selectedUser.id)
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès.",
        })
      }

      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de l'action:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération.",
        variant: "destructive",
      })
    } finally {
      setIsConfirmOpen(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Gestion des Utilisateurs</h2>
        <Button className="bg-[#FFB000] hover:bg-[#FF914D]" onClick={handleNewUser}>
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
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.avatar_url || "/placeholder.svg?height=32&width=32"}
                                alt={user.name}
                              />
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
                        <TableCell>{user.registered_date}</TableCell>
                        <TableCell>{user.orders_count}</TableCell>
                        <TableCell>{user.total_spent.toFixed(2)} €</TableCell>
                        <TableCell>{user.last_login}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <UserCog className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Voir les commandes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={user.status === "blocked" ? "text-green-600" : "text-red-600"}
                                onClick={() => handleToggleBlock(user)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {user.status === "blocked" ? "Débloquer" : "Bloquer"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                                <Ban className="h-4 w-4 mr-2" />
                                Supprimer
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

      {/* Dialogue de détails utilisateur */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Détails de l'utilisateur</DialogTitle>
                <DialogDescription>Informations complètes sur l'utilisateur et son activité.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedUser.avatar_url || "/placeholder.svg?height=64&width=64"}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {getStatusLabel(selectedUser.status)}
                      </Badge>
                      <Badge variant="outline">
                        {selectedUser.role === "admin" ? "Administrateur" : "Utilisateur"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Date d'inscription</h4>
                    <p>{selectedUser.registered_date}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Dernière connexion</h4>
                    <p>{selectedUser.last_login}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Nombre de commandes</h4>
                    <p>{selectedUser.orders_count}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Total dépensé</h4>
                    <p>{selectedUser.total_spent.toFixed(2)} €</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Adresses</h4>
                  <div className="space-y-2">
                    {selectedUser.addresses.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                        Aucune adresse enregistrée
                      </div>
                    ) : (
                      selectedUser.addresses.map((address, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="font-medium">{address.name}</div>
                          <div className="text-sm text-gray-500">
                            {address.street}, {address.postal_code} {address.city}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                <Button
                  className="bg-[#FFB000] hover:bg-[#FF914D]"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    handleEditUser(selectedUser)
                  }}
                >
                  Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogue de formulaire utilisateur */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Remplissez les informations pour créer un nouvel utilisateur."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete"
                ? "Confirmer la suppression"
                : selectedUser?.status === "blocked"
                  ? "Confirmer le déblocage"
                  : "Confirmer le blocage"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete"
                ? "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
                : selectedUser?.status === "blocked"
                  ? "Êtes-vous sûr de vouloir débloquer cet utilisateur ?"
                  : "Êtes-vous sûr de vouloir bloquer cet utilisateur ?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              {actionType === "delete" ? "Supprimer" : selectedUser?.status === "blocked" ? "Débloquer" : "Bloquer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
