import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Store, Pizza, ShoppingBag, Users, LifeBuoy, Settings, LogOut, Menu, X, Bell } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Cette fonction simulerait la vérification d'authentification
const getAuthenticatedAdmin = () => {
  // Dans un cas réel, vérifiez l'authentification ici
  return {
    name: "Admin Pizza",
    email: "admin@pizzacasa.fr",
    avatar: "/placeholder.svg?height=32&width=32",
  }
}

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Vérifier l'authentification (simulation)
  const admin = getAuthenticatedAdmin()

  // Si non authentifié, rediriger vers la page de connexion
  if (!admin) {
    redirect("/admin/login")
  }

  const navItems = [
    {
      title: "Tableau de bord",
      href: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Pizzerias",
      href: "/admin/pizzerias",
      icon: <Store className="h-5 w-5" />,
    },
    {
      title: "PIZZAS",
      href: "/admin/Pizzas",
      icon: <Pizza className="h-5 w-5" />,
    },
    {
      title: "Commandes",
      href: "/admin/commandes",
      icon: <ShoppingBag className="h-5 w-5" />,
      badge: "12",
    },
    {
      title: "Utilisateurs",
      href: "/admin/utilisateurs",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Support Client",
      href: "/admin/support",
      icon: <LifeBuoy className="h-5 w-5" />,
      badge: "5",
    },
    {
      title: "Paramètres",
      href: "/admin/parametres",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header mobile */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex items-center border-b px-4 py-3">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image src="sep13.png" alt="Pizza Casa Logo" fill className="object-contain" />
                </div>
                <span className="text-lg font-bold text-[#FFB000] font-montserrat">Admin</span>
              </Link>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <X className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </div>
            <ScrollArea className="flex-1 py-2">
              <nav className="grid gap-1 px-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-[#FFB000]/10 transition-colors"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {item.badge && <Badge className="ml-auto bg-[#9B1B1B] text-white">{item.badge}</Badge>}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{admin.name}</span>
                  <span className="text-xs text-muted-foreground">{admin.email}</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2 md:hidden">
          <div className="relative h-8 w-8">
            <Image src="sep13.png" alt="Pizza Casa Logo" fill className="object-contain" />
          </div>
          <span className="text-lg font-bold text-[#FFB000] font-montserrat">Pizza Casa Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image src="/sep13.png" alt="Pizza Casa Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-[#FFB000] font-montserrat">Admin</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-[#FFB000]/10 transition-colors"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && <Badge className="ml-auto bg-[#9B1B1B] text-white">{item.badge}</Badge>}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{admin.name}</span>
                <span className="text-xs text-muted-foreground">{admin.email}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
