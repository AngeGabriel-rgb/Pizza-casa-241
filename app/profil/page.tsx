"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import {
  User,
  Clock,
  LogOut,
  Heart,
  ShoppingBag,
  Home,
  Star,
  Pizza,
  Truck,
  Settings,
  Bell,
  FileText,
  ChefHat,
  MapPin,
  ShieldCheck,
  Users,
  BarChart,
  Utensils,
  Calendar,
} from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/connexion")
    }
  }, [user, router])

  if (!user) {
    return null // Don't render anything while checking auth
  }

  // Get navigation tabs based on user role
  const getNavTabs = () => {
    const commonTabs = [{ id: "profile", label: "Profil", icon: <User className="h-4 w-4 mr-2" /> }]

    switch (user.role) {
      case "client":
        return [
          ...commonTabs,
          { id: "orders", label: "Commandes", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
          { id: "addresses", label: "Adresses", icon: <Home className="h-4 w-4 mr-2" /> },
          { id: "favorites", label: "Favoris", icon: <Heart className="h-4 w-4 mr-2" /> },
          { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4 mr-2" /> },
        ]
      case "pizzeria":
        return [
          ...commonTabs,
          { id: "dashboard", label: "Tableau de bord", icon: <BarChart className="h-4 w-4 mr-2" /> },
          { id: "menu", label: "Menu", icon: <Pizza className="h-4 w-4 mr-2" /> },
          { id: "orders", label: "Commandes", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
          { id: "staff", label: "Personnel", icon: <ChefHat className="h-4 w-4 mr-2" /> },
          { id: "settings", label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" /> },
        ]
      case "livreur":
        return [
          ...commonTabs,
          { id: "deliveries", label: "Livraisons", icon: <Truck className="h-4 w-4 mr-2" /> },
          { id: "schedule", label: "Planning", icon: <Calendar className="h-4 w-4 mr-2" /> },
          { id: "earnings", label: "Revenus", icon: <FileText className="h-4 w-4 mr-2" /> },
          { id: "zones", label: "Zones", icon: <MapPin className="h-4 w-4 mr-2" /> },
        ]
      case "admin":
        return [
          ...commonTabs,
          { id: "dashboard", label: "Tableau de bord", icon: <BarChart className="h-4 w-4 mr-2" /> },
          { id: "users", label: "Utilisateurs", icon: <Users className="h-4 w-4 mr-2" /> },
          { id: "pizzerias", label: "Pizzerias", icon: <Utensils className="h-4 w-4 mr-2" /> },
          { id: "orders", label: "Commandes", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
          { id: "settings", label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" /> },
        ]
      default:
        return commonTabs
    }
  }

  const navTabs = getNavTabs()

  // Get role icon
  const getRoleIcon = () => {
    switch (user.role) {
      case "client":
        return <User className="h-5 w-5" />
      case "pizzeria":
        return <Pizza className="h-5 w-5" />
      case "livreur":
        return <Truck className="h-5 w-5" />
      case "admin":
        return <ShieldCheck className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  // Get role badge
  const getRoleBadge = () => {
    switch (user.role) {
      case "client":
        return "Client"
      case "pizzeria":
        return "Pizzeria"
      case "livreur":
        return "Livreur"
      case "admin":
        return "Administrateur"
      default:
        return "Client"
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    })
    router.push("/")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 font-montserrat">Mon Compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold font-montserrat">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge className="mt-2 bg-[#9B1B1B]">
                  <span className="flex items-center gap-1">
                    {getRoleIcon()}
                    {getRoleBadge()}
                  </span>
                </Badge>
              </div>

              <nav className="space-y-1">
                {navTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === tab.id ? "bg-[#FFB000] hover:bg-[#FF914D]" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </Button>
                ))}
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Profile Tab - Common for all users */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Gérez vos informations personnelles et vos préférences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" defaultValue={user.name.split(" ")[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue={user.name.split(" ")[1] || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Enregistrer les modifications</Button>
              </CardFooter>
            </Card>
          )}

          {/* Client-specific tabs */}
          {user.role === "client" && (
            <>
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des commandes</CardTitle>
                    <CardDescription>Consultez vos commandes précédentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.orders?.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold font-montserrat">{order.id}</h3>
                                  <Badge
                                    className={
                                      order.status === "Livrée"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{order.date}</span>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className="font-bold">{order.total.toFixed(2)} FCFA</span>
                              </div>
                            </div>

                            <div className="text-sm">
                              <h4 className="font-medium mb-1">Articles:</h4>
                              <ul className="space-y-1">
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    {item.quantity}x {item.name}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#9B1B1B] border-[#9B1B1B] hover:bg-[#9B1B1B] hover:text-white"
                              >
                                Commander à nouveau
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {(!user.orders || user.orders.length === 0) && (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore passé de commande.</p>
                          <Button asChild className="bg-[#FFB000] hover:bg-[#FF914D]">
                            <Link href="/pizzerias">Découvrir les pizzerias</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes adresses</CardTitle>
                    <CardDescription>Gérez vos adresses de livraison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.addresses?.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold font-montserrat">{address.name}</h3>
                                  {address.isDefault && <Badge className="bg-[#FFB000] text-white">Par défaut</Badge>}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <p>{address.street}</p>
                                  <p>
                                    {address.postalCode} {address.city}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Modifier
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {(!user.addresses || user.addresses.length === 0) && (
                        <div className="text-center py-8">
                          <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Aucune adresse</h3>
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté d'adresse.</p>
                        </div>
                      )}

                      <Button className="mt-4 bg-[#FFB000] hover:bg-[#FF914D]">Ajouter une adresse</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes favoris</CardTitle>
                    <CardDescription>Consultez vos pizzerias préférées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.favorites?.map((favorite) => (
                        <Link href={`/pizzerias/${favorite.id}`} key={favorite.id}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                  <Image
                                    src={favorite.image || "/placeholder.svg"}
                                    alt={favorite.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-bold font-montserrat">{favorite.name}</h3>
                                  <div className="flex items-center gap-1 text-[#FFB000] mt-1">
                                    <Star className="fill-[#FFB000] h-4 w-4" />
                                    <span className="text-sm">{favorite.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}

                      {(!user.favorites || user.favorites.length === 0) && (
                        <div className="col-span-2 text-center py-8">
                          <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Aucun favori</h3>
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de pizzeria à vos favoris.</p>
                          <Button asChild className="bg-[#FFB000] hover:bg-[#FF914D]">
                            <Link href="/pizzerias">Découvrir les pizzerias</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Gérez vos préférences de notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notifications par email</h3>
                          <p className="text-sm text-gray-500">Recevoir des emails pour les mises à jour de commande</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notifications par SMS</h3>
                          <p className="text-sm text-gray-500">Recevoir des SMS pour les mises à jour de commande</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Offres promotionnelles</h3>
                          <p className="text-sm text-gray-500">Recevoir des offres et promotions</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Newsletter</h3>
                          <p className="text-sm text-gray-500">Recevoir notre newsletter mensuelle</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Enregistrer les préférences</Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}

          {/* Pizzeria-specific tabs */}
          {user.role === "pizzeria" && (
            <>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tableau de bord</CardTitle>
                    <CardDescription>Aperçu de votre activité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <ShoppingBag className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">24</h3>
                            <p className="text-sm text-gray-500">Commandes aujourd'hui</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">75 000 FCFA</h3>
                            <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <Star className="h-8 w-8 text-[#FFB000] mb-2" />
                            <h3 className="text-2xl font-bold">4.8</h3>
                            <p className="text-sm text-gray-500">Note moyenne</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="font-bold mb-4">Commandes récentes</h3>
                    <div className="space-y-4">
                      {/* Exemple de commandes récentes */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Commande #12345</h4>
                              <p className="text-sm text-gray-500">Il y a 30 minutes</p>
                            </div>
                            <Badge>En préparation</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Commande #12344</h4>
                              <p className="text-sm text-gray-500">Il y a 45 minutes</p>
                            </div>
                            <Badge className="bg-amber-500">En livraison</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Commande #12343</h4>
                              <p className="text-sm text-gray-500">Il y a 1 heure</p>
                            </div>
                            <Badge className="bg-green-500">Livrée</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Menu Tab */}
              {activeTab === "menu" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion du menu</CardTitle>
                    <CardDescription>Gérez vos pizzas et autres produits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pizzas">
                      <TabsList className="mb-4">
                        <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
                        <TabsTrigger value="sides">Accompagnements</TabsTrigger>
                        <TabsTrigger value="drinks">Boissons</TabsTrigger>
                        <TabsTrigger value="desserts">Desserts</TabsTrigger>
                      </TabsList>

                      <TabsContent value="pizzas" className="space-y-4">
                        {/* Liste des pizzas */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                  <Image src="/placeholder.svg" alt="Margherita" fill className="object-cover" />
                                </div>
                                <div>
                                  <h3 className="font-bold">Margherita</h3>
                                  <p className="text-sm text-gray-500">Tomate, mozzarella, basilic</p>
                                  <p className="font-medium mt-1">8 500 FCFA</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                  <Image src="/placeholder.svg" alt="Regina" fill className="object-cover" />
                                </div>
                                <div>
                                  <h3 className="font-bold">Regina</h3>
                                  <p className="text-sm text-gray-500">Tomate, mozzarella, jambon, champignons</p>
                                  <p className="font-medium mt-1">9 500 FCFA</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter une pizza</Button>
                      </TabsContent>

                      <TabsContent value="sides" className="space-y-4">
                        <div className="text-center py-8">
                          <p>Aucun accompagnement pour le moment</p>
                          <Button className="mt-4 bg-[#FFB000] hover:bg-[#FF914D]">Ajouter un accompagnement</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="drinks" className="space-y-4">
                        <div className="text-center py-8">
                          <p>Aucune boisson pour le moment</p>
                          <Button className="mt-4 bg-[#FFB000] hover:bg-[#FF914D]">Ajouter une boisson</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="desserts" className="space-y-4">
                        <div className="text-center py-8">
                          <p>Aucun dessert pour le moment</p>
                          <Button className="mt-4 bg-[#FFB000] hover:bg-[#FF914D]">Ajouter un dessert</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Orders Tab for Pizzeria */}
              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des commandes</CardTitle>
                    <CardDescription>Suivez et gérez les commandes de votre pizzeria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pending">
                      <TabsList className="mb-4">
                        <TabsTrigger value="pending">En attente</TabsTrigger>
                        <TabsTrigger value="preparing">En préparation</TabsTrigger>
                        <TabsTrigger value="delivery">En livraison</TabsTrigger>
                        <TabsTrigger value="completed">Terminées</TabsTrigger>
                      </TabsList>

                      <TabsContent value="pending" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12346</h3>
                                  <Badge>Nouvelle</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Il y a 5 minutes</p>
                                <div className="mt-2">
                                  <p className="text-sm">1x Margherita</p>
                                  <p className="text-sm">1x Calzone</p>
                                  <p className="text-sm">2x Coca-Cola</p>
                                </div>
                                <p className="font-medium mt-2">Total: 18 500 FCFA</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#FFB000] hover:bg-[#FF914D]">
                                  Accepter
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Refuser
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="preparing" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12345</h3>
                                  <Badge>En préparation</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Il y a 15 minutes</p>
                                <div className="mt-2">
                                  <p className="text-sm">2x Regina</p>
                                  <p className="text-sm">1x Tiramisu</p>
                                </div>
                                <p className="font-medium mt-2">Total: 22 000 FCFA</p>
                              </div>
                              <Button size="sm" className="bg-[#FFB000] hover:bg-[#FF914D]">
                                Prêt pour livraison
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="delivery" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12344</h3>
                                  <Badge className="bg-amber-500">En livraison</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Il y a 30 minutes</p>
                                <div className="mt-2">
                                  <p className="text-sm">1x 4 Fromages</p>
                                  <p className="text-sm">1x Pepperoni</p>
                                </div>
                                <p className="font-medium mt-2">Total: 19 000 FCFA</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Livreur: Jean Dupont</p>
                                <p className="text-sm text-gray-500">Tél: +241 77 12 34 56</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="completed" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12343</h3>
                                  <Badge className="bg-green-500">Livrée</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Aujourd'hui, 14:30</p>
                                <div className="mt-2">
                                  <p className="text-sm">1x Végétarienne</p>
                                  <p className="text-sm">1x Fanta</p>
                                </div>
                                <p className="font-medium mt-2">Total: 12 500 FCFA</p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#FFB000] fill-[#FFB000]" />
                                <span className="ml-1">5.0</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Staff Tab */}
              {activeTab === "staff" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion du personnel</CardTitle>
                    <CardDescription>Gérez votre équipe de cuisiniers et serveurs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Pierre Dubois" />
                                <AvatarFallback>PD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold">Pierre Dubois</h3>
                                <p className="text-sm text-gray-500">Chef cuisinier</p>
                                <p className="text-sm">+241 66 12 34 56</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg" alt="Marie Martin" />
                                <AvatarFallback>MM</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold">Marie Martin</h3>
                                <p className="text-sm text-gray-500">Serveuse</p>
                                <p className="text-sm">+241 66 98 76 54</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter un employé</Button>
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab for Pizzeria */}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de la pizzeria</CardTitle>
                    <CardDescription>Gérez les informations et paramètres de votre établissement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="pizzeriaName">Nom de la pizzeria</Label>
                      <Input id="pizzeriaName" defaultValue="Pizza Délice" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="Pizzeria authentique proposant des pizzas artisanales cuites au feu de bois."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" defaultValue="123 Avenue des Palmiers" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" defaultValue="Libreville" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" defaultValue="+241 74 12 34 56" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="contact@pizzadelice.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingHours">Horaires d'ouverture</Label>
                      <Textarea
                        id="openingHours"
                        defaultValue="Lundi - Vendredi: 11h00 - 22h00&#10;Samedi - Dimanche: 11h00 - 23h00"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="deliveryEnabled" defaultChecked />
                      <Label htmlFor="deliveryEnabled">Activer la livraison</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Frais de livraison (FCFA)</Label>
                      <Input id="deliveryFee" type="number" defaultValue="1500" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minOrderAmount">Montant minimum de commande (FCFA)</Label>
                      <Input id="minOrderAmount" type="number" defaultValue="5000" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Enregistrer les modifications</Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}

          {/* Livreur-specific tabs */}
          {user.role === "livreur" && (
            <>
              {/* Deliveries Tab */}
              {activeTab === "deliveries" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes livraisons</CardTitle>
                    <CardDescription>Gérez vos livraisons en cours et à venir</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="current">
                      <TabsList className="mb-4">
                        <TabsTrigger value="current">En cours</TabsTrigger>
                        <TabsTrigger value="pending">À récupérer</TabsTrigger>
                        <TabsTrigger value="completed">Terminées</TabsTrigger>
                      </TabsList>

                      <TabsContent value="current" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12344</h3>
                                  <Badge className="bg-amber-500">En livraison</Badge>
                                </div>
                                <p className="text-sm font-medium mt-1">Pizza Délice</p>
                                <p className="text-sm text-gray-500">123 Avenue des Palmiers, Libreville</p>
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Client: Marie Dupont</p>
                                  <p className="text-sm">Tél: +241 66 87 65 43</p>
                                  <p className="text-sm">Adresse: 45 Rue des Fleurs, Libreville</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" className="bg-[#FFB000] hover:bg-[#FF914D]">
                                  Livré
                                </Button>
                                <Button variant="outline" size="sm">
                                  Voir l'itinéraire
                                </Button>
                                <Button variant="outline" size="sm">
                                  Appeler le client
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="pending" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12345</h3>
                                  <Badge>Prête à récupérer</Badge>
                                </div>
                                <p className="text-sm font-medium mt-1">Pizza Roma</p>
                                <p className="text-sm text-gray-500">78 Boulevard Central, Libreville</p>
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Client: Jean Michel</p>
                                  <p className="text-sm">Tél: +241 66 12 34 56</p>
                                  <p className="text-sm">Adresse: 12 Rue des Palmiers, Libreville</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" className="bg-[#FFB000] hover:bg-[#FF914D]">
                                  Récupérer
                                </Button>
                                <Button variant="outline" size="sm">
                                  Voir l'itinéraire
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="completed" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">Commande #12343</h3>
                                  <Badge className="bg-green-500">Livrée</Badge>
                                </div>
                                <p className="text-sm font-medium mt-1">Pizza Napoli</p>
                                <p className="text-sm text-gray-500">Aujourd'hui, 14:30</p>
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Client: Sophie Martin</p>
                                  <p className="text-sm">Adresse: 34 Avenue de la Mer, Libreville</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-[#FFB000] fill-[#FFB000]" />
                                <span className="ml-1">4.8</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mon planning</CardTitle>
                    <CardDescription>Consultez et gérez vos horaires de travail</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">Cette semaine</h3>
                        <Button variant="outline" size="sm">
                          Demander un congé
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Lundi</p>
                            <p className="text-sm text-gray-500">10:00 - 18:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Mardi</p>
                            <p className="text-sm text-gray-500">10:00 - 18:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Mercredi</p>
                            <p className="text-sm text-gray-500">12:00 - 20:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Jeudi</p>
                            <p className="text-sm text-gray-500">12:00 - 20:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Vendredi</p>
                            <p className="text-sm text-gray-500">16:00 - 00:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Samedi</p>
                            <p className="text-sm text-gray-500">16:00 - 00:00</p>
                          </div>
                          <Badge className="bg-green-500">Confirmé</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Dimanche</p>
                            <p className="text-sm text-gray-500">Repos</p>
                          </div>
                          <Badge className="bg-gray-500">Jour de repos</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Earnings Tab */}
              {activeTab === "earnings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes revenus</CardTitle>
                    <CardDescription>Consultez vos gains et historique de paiements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-sm text-gray-500 mb-1">Aujourd'hui</h3>
                            <p className="text-2xl font-bold">5 500 FCFA</p>
                            <p className="text-sm text-gray-500">6 livraisons</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-sm text-gray-500 mb-1">Cette semaine</h3>
                            <p className="text-2xl font-bold">32 500 FCFA</p>
                            <p className="text-sm text-gray-500">35 livraisons</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-sm text-gray-500 mb-1">Ce mois</h3>
                            <p className="text-2xl font-bold">125 000 FCFA</p>
                            <p className="text-sm text-gray-500">142 livraisons</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="font-bold mb-4">Historique des paiements</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Paiement hebdomadaire</p>
                              <p className="text-sm text-gray-500">15 Avril 2023</p>
                            </div>
                            <p className="font-bold">32 500 FCFA</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Paiement hebdomadaire</p>
                              <p className="text-sm text-gray-500">8 Avril 2023</p>
                            </div>
                            <p className="font-bold">28 750 FCFA</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Paiement hebdomadaire</p>
                              <p className="text-sm text-gray-500">1 Avril 2023</p>
                            </div>
                            <p className="font-bold">30 250 FCFA</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Zones Tab */}
              {activeTab === "zones" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mes zones de livraison</CardTitle>
                    <CardDescription>Consultez et gérez vos zones de livraison préférées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-[#9B1B1B]" />
                          <div>
                            <p className="font-medium">Centre-ville</p>
                            <p className="text-sm text-gray-500">Rayon: 5 km</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500">Actif</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-[#9B1B1B]" />
                          <div>
                            <p className="font-medium">Quartier Nord</p>
                            <p className="text-sm text-gray-500">Rayon: 7 km</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500">Actif</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-[#9B1B1B]" />
                          <div>
                            <p className="font-medium">Quartier Sud</p>
                            <p className="text-sm text-gray-500">Rayon: 6 km</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-500">Inactif</Badge>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter une zone</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Admin-specific tabs */}
          {user.role === "admin" && (
            <>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tableau de bord administrateur</CardTitle>
                    <CardDescription>Vue d'ensemble de la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <Users className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">1,245</h3>
                            <p className="text-sm text-gray-500">Utilisateurs</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <Pizza className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">48</h3>
                            <p className="text-sm text-gray-500">Pizzerias</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <ShoppingBag className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">356</h3>
                            <p className="text-sm text-gray-500">Commandes aujourd'hui</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 text-[#9B1B1B] mb-2" />
                            <h3 className="text-2xl font-bold">1.2M FCFA</h3>
                            <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <h3 className="font-bold mb-4">Activité récente</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Nouvel utilisateur inscrit</p>
                              <p className="text-sm text-gray-500">Il y a 10 minutes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Pizza className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Nouvelle pizzeria ajoutée</p>
                              <p className="text-sm text-gray-500">Il y a 2 heures</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <ShoppingBag className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">Commande importante effectuée</p>
                              <p className="text-sm text-gray-500">Il y a 4 heures</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>Gérez tous les utilisateurs de la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <Input placeholder="Rechercher un utilisateur..." className="w-64" />
                        <Button variant="outline" size="sm">
                          Rechercher
                        </Button>
                      </div>
                      <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter un utilisateur</Button>
                    </div>

                    <Tabs defaultValue="clients">
                      <TabsList className="mb-4">
                        <TabsTrigger value="clients">Clients</TabsTrigger>
                        <TabsTrigger value="pizzerias">Pizzerias</TabsTrigger>
                        <TabsTrigger value="livreurs">Livreurs</TabsTrigger>
                        <TabsTrigger value="admins">Administrateurs</TabsTrigger>
                      </TabsList>

                      <TabsContent value="clients" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt="Jean Dupont" />
                                  <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold">Jean Dupont</h3>
                                  <p className="text-sm text-gray-500">jean.dupont@example.com</p>
                                  <p className="text-sm">+241 66 12 34 56</p>
                                  <Badge className="mt-1">Client</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Suspendre
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt="Marie Martin" />
                                  <AvatarFallback>MM</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold">Marie Martin</h3>
                                  <p className="text-sm text-gray-500">marie.martin@example.com</p>
                                  <p className="text-sm">+241 66 98 76 54</p>
                                  <Badge className="mt-1">Client</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Suspendre
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="pizzerias" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt="Pizza Délice" />
                                  <AvatarFallback>PD</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold">Pizza Délice</h3>
                                  <p className="text-sm text-gray-500">contact@pizzadelice.com</p>
                                  <p className="text-sm">+241 74 12 34 56</p>
                                  <Badge className="mt-1 bg-[#9B1B1B]">Pizzeria</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Suspendre
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="livreurs" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt="Pierre Dubois" />
                                  <AvatarFallback>PD</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold">Pierre Dubois</h3>
                                  <p className="text-sm text-gray-500">pierre.dubois@example.com</p>
                                  <p className="text-sm">+241 66 45 67 89</p>
                                  <Badge className="mt-1 bg-amber-500">Livreur</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  Suspendre
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="admins" className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg" alt="Admin Principal" />
                                  <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold">Admin Principal</h3>
                                  <p className="text-sm text-gray-500">admin@pizzacasa.com</p>
                                  <p className="text-sm">+241 74 98 76 54</p>
                                  <Badge className="mt-1 bg-blue-500">Administrateur</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Pizzerias Tab */}
              {activeTab === "pizzerias" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des pizzerias</CardTitle>
                    <CardDescription>Gérez toutes les pizzerias de la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <Input placeholder="Rechercher une pizzeria..." className="w-64" />
                        <Button variant="outline" size="sm">
                          Rechercher
                        </Button>
                      </div>
                      <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter une pizzeria</Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image src="/placeholder.svg" alt="Pizza Délice" fill className="object-cover" />
                              </div>
                              <div>
                                <h3 className="font-bold">Pizza Délice</h3>
                                <p className="text-sm text-gray-500">123 Avenue des Palmiers, Libreville</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-4 w-4 text-[#FFB000] fill-[#FFB000]" />
                                  <span className="text-sm">4.8 (120 avis)</span>
                                </div>
                                <Badge className="mt-1 bg-green-500">Actif</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Voir
                              </Button>
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Suspendre
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image src="/placeholder.svg" alt="Pizza Roma" fill className="object-cover" />
                              </div>
                              <div>
                                <h3 className="font-bold">Pizza Roma</h3>
                                <p className="text-sm text-gray-500">78 Boulevard Central, Libreville</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-4 w-4 text-[#FFB000] fill-[#FFB000]" />
                                  <span className="text-sm">4.5 (98 avis)</span>
                                </div>
                                <Badge className="mt-1 bg-green-500">Actif</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Voir
                              </Button>
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Suspendre
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image src="/placeholder.svg" alt="Pizza Napoli" fill className="object-cover" />
                              </div>
                              <div>
                                <h3 className="font-bold">Pizza Napoli</h3>
                                <p className="text-sm text-gray-500">45 Rue des Fleurs, Libreville</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-4 w-4 text-[#FFB000] fill-[#FFB000]" />
                                  <span className="text-sm">4.2 (75 avis)</span>
                                </div>
                                <Badge className="mt-1 bg-red-500">Suspendu</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Voir
                              </Button>
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-green-500">
                                Réactiver
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Orders Tab for Admin */}
              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des commandes</CardTitle>
                    <CardDescription>Suivez toutes les commandes de la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <Input placeholder="Rechercher une commande..." className="w-64" />
                        <Button variant="outline" size="sm">
                          Rechercher
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Exporter
                        </Button>
                        <Button variant="outline" size="sm">
                          Filtrer
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">Commande #12346</h3>
                                <Badge>Nouvelle</Badge>
                              </div>
                              <p className="text-sm text-gray-500">Il y a 5 minutes</p>
                              <p className="text-sm font-medium mt-1">Pizza Délice</p>
                              <p className="text-sm">Client: Jean Dupont</p>
                              <p className="font-medium mt-1">Total: 18 500 FCFA</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">Commande #12345</h3>
                                <Badge>En préparation</Badge>
                              </div>
                              <p className="text-sm text-gray-500">Il y a 15 minutes</p>
                              <p className="text-sm font-medium mt-1">Pizza Roma</p>
                              <p className="text-sm">Client: Marie Martin</p>
                              <p className="font-medium mt-1">Total: 22 000 FCFA</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">Commande #12344</h3>
                                <Badge className="bg-amber-500">En livraison</Badge>
                              </div>
                              <p className="text-sm text-gray-500">Il y a 30 minutes</p>
                              <p className="text-sm font-medium mt-1">Pizza Napoli</p>
                              <p className="text-sm">Client: Pierre Dubois</p>
                              <p className="text-sm">Livreur: Jean Michel</p>
                              <p className="font-medium mt-1">Total: 19 000 FCFA</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">Commande #12343</h3>
                                <Badge className="bg-green-500">Livrée</Badge>
                              </div>
                              <p className="text-sm text-gray-500">Aujourd'hui, 14:30</p>
                              <p className="text-sm font-medium mt-1">Pizza Délice</p>
                              <p className="text-sm">Client: Sophie Martin</p>
                              <p className="font-medium mt-1">Total: 12 500 FCFA</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab for Admin */}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de la plateforme</CardTitle>
                    <CardDescription>Gérez les paramètres généraux de la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="platformName">Nom de la plateforme</Label>
                      <Input id="platformName" defaultValue="Pizza Casa" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de contact</Label>
                      <Input id="contactEmail" type="email" defaultValue="contact@pizzacasa.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Téléphone du support</Label>
                      <Input id="supportPhone" defaultValue="+241 74 00 00 00" />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-medium mb-2">Frais de service</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="commissionRate">Taux de commission pizzeria (%)</Label>
                          <Input id="commissionRate" type="number" defaultValue="10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deliveryCommission">Commission livreur par livraison (FCFA)</Label>
                          <Input id="deliveryCommission" type="number" defaultValue="500" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Paramètres généraux</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mode maintenance</p>
                          <p className="text-sm text-gray-500">Mettre la plateforme en maintenance</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Inscription automatique</p>
                          <p className="text-sm text-gray-500">Approuver automatiquement les nouvelles inscriptions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications par email</p>
                          <p className="text-sm text-gray-500">Envoyer des notifications par email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications par SMS</p>
                          <p className="text-sm text-gray-500">Envoyer des notifications par SMS</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Enregistrer les modifications</Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
