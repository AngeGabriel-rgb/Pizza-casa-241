"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth, type UserRole } from "@/context/auth-context"
import { Pizza, User, Truck, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<UserRole>("client")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password, activeTab)

      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        })

        // Redirect based on role
        switch (activeTab) {
          case "client":
            router.push("/")
            break
          case "pizzeria":
            router.push("/pizzeria/dashboard")
            break
          case "livreur":
            router.push("/livreur/dashboard")
            break
          case "admin":
            router.push("/admin/dashboard")
            break
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1 container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center">Connectez-vous à votre compte Pizza Casa</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" onValueChange={(value) => setActiveTab(value as UserRole)}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="client" className="flex flex-col items-center py-2">
                  <User className="h-4 w-4 mb-1" />
                  <span className="text-xs">Client</span>
                </TabsTrigger>
                <TabsTrigger value="pizzeria" className="flex flex-col items-center py-2">
                  <Pizza className="h-4 w-4 mb-1" />
                  <span className="text-xs">Pizzeria</span>
                </TabsTrigger>
                <TabsTrigger value="livreur" className="flex flex-col items-center py-2">
                  <Truck className="h-4 w-4 mb-1" />
                  <span className="text-xs">Livreur</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex flex-col items-center py-2">
                  <ShieldCheck className="h-4 w-4 mb-1" />
                  <span className="text-xs">Admin</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                        Mot de passe oublié?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <TabsContent value="client">
                    <p className="text-sm text-muted-foreground mb-4">
                      Connectez-vous pour commander vos pizzas préférées.
                    </p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Compte de démonstration:</p>
                      <p>Email: client@test.com</p>
                      <p>Mot de passe: password</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="pizzeria">
                    <p className="text-sm text-muted-foreground mb-4">Connectez-vous pour gérer votre pizzeria.</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Compte de démonstration:</p>
                      <p>Email: pizzeria@test.com</p>
                      <p>Mot de passe: password</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="livreur">
                    <p className="text-sm text-muted-foreground mb-4">Connectez-vous pour gérer vos livraisons.</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Compte de démonstration:</p>
                      <p>Email: livreur@test.com</p>
                      <p>Mot de passe: password</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="admin">
                    <p className="text-sm text-muted-foreground mb-4">Connectez-vous pour administrer la plateforme.</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Compte de démonstration:</p>
                      <p>Email: admin@test.com</p>
                      <p>Mot de passe: password</p>
                    </div>
                  </TabsContent>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>Vous n'avez pas de compte? </span>
              <Link href="/inscription" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
