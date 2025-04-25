"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { ShoppingCart, Menu, X, User, LogOut, Pizza, Truck, ShieldCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { href: "/", label: "Accueil" },
      { href: "/pizzerias", label: "Pizzerias" },
    ]

    if (!user) return commonLinks

    switch (user.role) {
      case "client":
        return [...commonLinks, { href: "/commandes", label: "Mes Commandes" }]
      case "pizzeria":
        return [
          { href: "/pizzeria/dashboard", label: "Tableau de Bord" },
          { href: "/pizzeria/commandes", label: "Commandes" },
          { href: "/pizzeria/menu", label: "Menu" },
        ]
      case "livreur":
        return [
          { href: "/livreur/dashboard", label: "Tableau de Bord" },
          { href: "/livreur/livraisons", label: "Livraisons" },
        ]
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Tableau de Bord" },
          { href: "/admin/pizzerias", label: "Pizzerias" },
          { href: "/admin/utilisateurs", label: "Utilisateurs" },
          { href: "/admin/commandes", label: "Commandes" },
        ]
      default:
        return commonLinks
    }
  }

  const navLinks = getNavLinks()

  // Get role icon
  const getRoleIcon = () => {
    if (!user) return <User className="h-4 w-4 mr-2" />

    switch (user.role) {
      case "client":
        return <User className="h-4 w-4 mr-2" />
      case "pizzeria":
        return <Pizza className="h-4 w-4 mr-2" />
      case "livreur":
        return <Truck className="h-4 w-4 mr-2" />
      case "admin":
        return <ShieldCheck className="h-4 w-4 mr-2" />
      default:
        return <User className="h-4 w-4 mr-2" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Pizza className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block">Pizza Casa</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground font-bold" : "text-foreground/60",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 ml-auto">
          {/* Cart Button - Only show for clients */}
          {(!user || user.role === "client") && (
            <Button variant="outline" size="icon" asChild>
              <Link href="/panier" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
          )}

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  {getRoleIcon()}
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profil">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/connexion">Connexion</Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2 transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground font-bold" : "text-foreground/60",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/inscription"
                className="block py-2 text-foreground/60 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inscription
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
