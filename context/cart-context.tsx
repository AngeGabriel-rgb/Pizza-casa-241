"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Pizza } from "@/types/pizza"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  pizza: Pizza
  quantity: number
  specialInstructions?: string
}

interface CartContextType {
  items: CartItem[]
  pizzeriaId: string | null
  addItem: (pizza: Pizza, quantity: number, specialInstructions?: string) => void
  removeItem: (pizzaId: string) => void
  updateQuantity: (pizzaId: string, quantity: number) => void
  clearCart: () => void
  setPizzeriaId: (id: string) => void
  totalItems: number
  subtotal: number
  deliveryFee: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [pizzeriaId, setPizzeriaId] = useState<string | null>(null)
  const { toast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("pizza-casa-cart")
    const savedPizzeriaId = localStorage.getItem("pizza-casa-pizzeria")

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    if (savedPizzeriaId) {
      setPizzeriaId(savedPizzeriaId)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pizza-casa-cart", JSON.stringify(items))
  }, [items])

  // Save pizzeriaId to localStorage whenever it changes
  useEffect(() => {
    if (pizzeriaId) {
      localStorage.setItem("pizza-casa-pizzeria", pizzeriaId)
    } else {
      localStorage.removeItem("pizza-casa-pizzeria")
    }
  }, [pizzeriaId])

  const addItem = (pizza: Pizza, quantity: number, specialInstructions?: string) => {
    // Check if we're trying to add from a different pizzeria
    if (pizzeriaId && pizza.pizzeriaId !== pizzeriaId && items.length > 0) {
      toast({
        title: "Attention",
        description:
          "Vous ne pouvez commander que d'une seule pizzeria à la fois. Voulez-vous vider votre panier et commencer une nouvelle commande?",
        variant: "destructive",
        action: (
          <button
            className="bg-white text-red-500 px-3 py-1 rounded-md text-xs font-medium"
            onClick={() => {
              clearCart()
              setPizzeriaId(pizza.pizzeriaId)
              setItems([{ pizza, quantity, specialInstructions }])
              toast({
                title: "Panier mis à jour",
                description: "Votre panier a été vidé et la nouvelle pizza a été ajoutée.",
              })
            }}
          >
            Confirmer
          </button>
        ),
      })
      return
    }

    // Set pizzeriaId if it's the first item
    if (!pizzeriaId) {
      setPizzeriaId(pizza.pizzeriaId)
    }

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.pizza.id === pizza.id)

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          specialInstructions: specialInstructions || updatedItems[existingItemIndex].specialInstructions,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { pizza, quantity, specialInstructions }]
      }
    })

    toast({
      title: "Ajouté au panier",
      description: `${pizza.name} a été ajouté à votre panier.`,
    })
  }

  const removeItem = (pizzaId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.pizza.id !== pizzaId))

    // If cart becomes empty, reset pizzeriaId
    if (items.length === 1 && items[0].pizza.id === pizzaId) {
      setPizzeriaId(null)
    }

    toast({
      title: "Retiré du panier",
      description: "L'article a été retiré de votre panier.",
    })
  }

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(pizzaId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.pizza.id === pizzaId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setPizzeriaId(null)
  }

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 1500 : 0 // 1500 FCFA delivery fee if cart has items
  const total = subtotal + deliveryFee

  return (
    <CartContext.Provider
      value={{
        items,
        pizzeriaId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setPizzeriaId,
        totalItems,
        subtotal,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
