"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Lock, Palette, User, SettingsIcon } from "lucide-react"
import type { User as UserType } from "@/types/user"
import type { UserSettings, AppSettings } from "@/types/settings"
import { updateUserSettings, updateAppSettings } from "@/app/api/settings/actions"
import { useToast } from "@/hooks/use-toast"

interface ParametresClientProps {
  user: UserType
  userSettings: UserSettings | null
  appSettings: AppSettings | null
  isAdmin: boolean
}

export default function ParametresClient({ user, userSettings, appSettings, isAdmin }: ParametresClientProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("compte")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // État pour les paramètres utilisateur
  const [settings, setSettings] = useState<UserSettings | null>(userSettings)

  // État pour les paramètres de l'application
  const [appConfig, setAppConfig] = useState<AppSettings | null>(appSettings)

  // Gérer les changements de paramètres utilisateur
  const handleUserSettingsChange = (key: keyof UserSettings, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [key]: value,
    })
  }

  // Gérer les changements de paramètres de l'application
  const handleAppSettingsChange = (key: keyof AppSettings, value: any) => {
    if (!appConfig) return

    setAppConfig({
      ...appConfig,
      [key]: value,
    })
  }

  // Enregistrer les paramètres utilisateur
  const saveUserSettings = async () => {
    if (!settings) return

    setIsSubmitting(true)

    try {
      const updatedSettings = await updateUserSettings(user.id, settings)

      if (updatedSettings) {
        toast({
          title: "Paramètres enregistrés",
          description: "Vos paramètres ont été mis à jour avec succès.",
        })

        setSettings(updatedSettings)
      } else {
        throw new Error("Impossible de mettre à jour les paramètres")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Enregistrer les paramètres de l'application
  const saveAppSettings = async () => {
    if (!appConfig) return

    setIsSubmitting(true)

    try {
      const updatedSettings = await updateAppSettings(appConfig)

      if (updatedSettings) {
        toast({
          title: "Paramètres enregistrés",
          description: "Les paramètres de l'application ont été mis à jour avec succès.",
        })

        setAppConfig(updatedSettings)
      } else {
        throw new Error("Impossible de mettre à jour les paramètres")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!settings || !appConfig) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Paramètres non disponibles</h2>
        <p>Impossible de charger les paramètres. Veuillez réessayer plus tard.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Paramètres</h2>
      </div>

      <Tabs defaultValue="compte" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url || "/placeholder.svg?height=48&width=48"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
              <TabsTrigger value="compte" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                <User className="h-4 w-4 mr-2" />
                Compte
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="apparence" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="securite" className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
                <Lock className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="application"
                  className="justify-start px-3 py-2 h-auto data-[state=active]:bg-muted"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Application
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="compte" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>Gérez les informations de votre compte et vos préférences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" value={user.name} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email} disabled />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => handleUserSettingsChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#FFB000] hover:bg-[#FF914D]"
                      onClick={saveUserSettings}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adresses</CardTitle>
                  <CardDescription>Gérez vos adresses de livraison.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((address, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{address.name}</h3>
                            <Button variant="ghost" size="sm">
                              Modifier
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.street}, {address.postal_code} {address.city}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">Aucune adresse enregistrée</p>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline">Ajouter une adresse</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>Configurez comment et quand vous souhaitez être notifié.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications_email">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                      </div>
                      <Switch
                        id="notifications_email"
                        checked={settings.notifications_email}
                        onCheckedChange={(checked) => handleUserSettingsChange("notifications_email", checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications_push">Notifications push</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications push sur votre appareil
                        </p>
                      </div>
                      <Switch
                        id="notifications_push"
                        checked={settings.notifications_push}
                        onCheckedChange={(checked) => handleUserSettingsChange("notifications_push", checked)}
                      />
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Types de notifications</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications_orders">Commandes</Label>
                        <p className="text-sm text-muted-foreground">Notifications concernant vos commandes</p>
                      </div>
                      <Switch
                        id="notifications_orders"
                        checked={settings.notifications_orders}
                        onCheckedChange={(checked) => handleUserSettingsChange("notifications_orders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications_promotions">Promotions</Label>
                        <p className="text-sm text-muted-foreground">Offres spéciales et promotions</p>
                      </div>
                      <Switch
                        id="notifications_promotions"
                        checked={settings.notifications_promotions}
                        onCheckedChange={(checked) => handleUserSettingsChange("notifications_promotions", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications_support">Support</Label>
                        <p className="text-sm text-muted-foreground">Réponses à vos tickets de support</p>
                      </div>
                      <Switch
                        id="notifications_support"
                        checked={settings.notifications_support}
                        onCheckedChange={(checked) => handleUserSettingsChange("notifications_support", checked)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#FFB000] hover:bg-[#FF914D]"
                      onClick={saveUserSettings}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apparence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Thème</Label>
                      <Select
                        value={settings.theme}
                        onValueChange={(value) => handleUserSettingsChange("theme", value)}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Sélectionner un thème" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                          <SelectItem value="system">Système</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choisissez le thème qui vous convient le mieux.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#FFB000] hover:bg-[#FF914D]"
                      onClick={saveUserSettings}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="securite" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Gérez la sécurité de votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Changer le mot de passe</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessions actives</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Cet appareil</h4>
                          <p className="text-sm text-muted-foreground">Dernière activité: Aujourd'hui à 14:32</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Déconnecter
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="application" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de l'application</CardTitle>
                    <CardDescription>Configurez les paramètres généraux de l'application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="site_name">Nom du site</Label>
                          <Input
                            id="site_name"
                            value={appConfig.site_name}
                            onChange={(e) => handleAppSettingsChange("site_name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo_url">URL du logo</Label>
                          <Input
                            id="logo_url"
                            value={appConfig.logo_url}
                            onChange={(e) => handleAppSettingsChange("logo_url", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary_color">Couleur primaire</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primary_color"
                              value={appConfig.primary_color}
                              onChange={(e) => handleAppSettingsChange("primary_color", e.target.value)}
                            />
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: appConfig.primary_color }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondary_color">Couleur secondaire</Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondary_color"
                              value={appConfig.secondary_color}
                              onChange={(e) => handleAppSettingsChange("secondary_color", e.target.value)}
                            />
                            <div
                              className="h-10 w-10 rounded-md border"
                              style={{ backgroundColor: appConfig.secondary_color }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_email">Email de contact</Label>
                          <Input
                            id="contact_email"
                            type="email"
                            value={appConfig.contact_email}
                            onChange={(e) => handleAppSettingsChange("contact_email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="support_phone">Téléphone du support</Label>
                          <Input
                            id="support_phone"
                            value={appConfig.support_phone}
                            onChange={(e) => handleAppSettingsChange("support_phone", e.target.value)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="default_language">Langue par défaut</Label>
                          <Select
                            value={appConfig.default_language}
                            onValueChange={(value) => handleAppSettingsChange("default_language", value)}
                          >
                            <SelectTrigger id="default_language">
                              <SelectValue placeholder="Sélectionner une langue" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="default_currency">Devise par défaut</Label>
                          <Select
                            value={appConfig.default_currency}
                            onValueChange={(value) => handleAppSettingsChange("default_currency", value)}
                          >
                            <SelectTrigger id="default_currency">
                              <SelectValue placeholder="Sélectionner une devise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="USD">Dollar US ($)</SelectItem>
                              <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                              <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="delivery_fee">Frais de livraison</Label>
                          <Input
                            id="delivery_fee"
                            type="number"
                            step="0.01"
                            value={appConfig.delivery_fee}
                            onChange={(e) => handleAppSettingsChange("delivery_fee", Number.parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="min_order_amount">Montant minimum de commande</Label>
                          <Input
                            id="min_order_amount"
                            type="number"
                            step="0.01"
                            value={appConfig.min_order_amount}
                            onChange={(e) =>
                              handleAppSettingsChange("min_order_amount", Number.parseFloat(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-[#FFB000] hover:bg-[#FF914D]"
                        onClick={saveAppSettings}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
