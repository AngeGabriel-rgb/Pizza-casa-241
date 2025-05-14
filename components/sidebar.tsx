"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Home, Pizza, ShoppingBag, Users, Settings, HelpCircle, MessageSquare } from "lucide-react"

const sidebarLinks = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Pizzerias",
    href: "/pizzerias",
    icon: Pizza,
  },
  {
    title: "Commandes",
    href: "/commandes",
    icon: ShoppingBag,
  },
  {
    title: "Utilisateurs",
    href: "/utilisateurs",
    icon: Users,
  },
 
  {
    title: "Support",
    href: "/support",
    icon: MessageSquare,
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
  },

]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-50 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid items-start px-4 text-sm">
            {sidebarLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === link.href ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#9B1B1B]/10 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9B1B1B]">
              <Pizza className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#9B1B1B]">Admin PizzaCasa</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
