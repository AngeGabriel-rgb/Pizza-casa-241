"use client"

import { useEffect } from "react"
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type CartSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, totalItems, subtotal, total, updateQuantity, removeItem, clearCart } = useCart()

  // Fermer le panier avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Empêcher le défilement du body quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-background shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-[#9B1B1B]" />
              <h2 className="text-lg font-semibold">Votre Panier</h2>
              <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  Vider
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Votre panier est vide</p>
                <p className="text-muted-foreground mb-6">Ajoutez des pizzas pour commencer votre commande</p>
                <Button onClick={onClose}>Parcourir les pizzerias</Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.pizza.id} className="flex gap-4 pb-4 border-b">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image
                        src={item.pizza.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.pizza.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.pizza.name}</h3>
                        <p className="font-semibold">{item.pizza.price.toFixed(2)} FCFA</p>
                      </div>
                      {item.pizza.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.pizza.description}</p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.pizza.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Diminuer</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Augmenter</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.pizza.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} FCFA</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>Calculée à la caisse</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} FCFA</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/paiement">Commander</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Continuer les achats
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
