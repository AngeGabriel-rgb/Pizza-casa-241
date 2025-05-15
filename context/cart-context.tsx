"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Pizza } from "@/types/pizza";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  pizza: Pizza;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  pizzeriaId: string | null;
  addItem: (pizza: Pizza, quantity: number, specialInstructions?: string) => void;
  removeItem: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  setPizzeriaId: (id: string) => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pizzeriaId, setPizzeriaId] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("pizza-casa-cart");
      const savedPizzeriaId = localStorage.getItem("pizza-casa-pizzeria");

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }

      if (savedPizzeriaId) {
        setPizzeriaId(savedPizzeriaId);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pizza-casa-cart", JSON.stringify(items));
      if (pizzeriaId) {
        localStorage.setItem("pizza-casa-pizzeria", pizzeriaId);
      } else {
        localStorage.removeItem("pizza-casa-pizzeria");
      }
    }
  }, [items, pizzeriaId]);

  const addItem = (pizza: Pizza, quantity: number, specialInstructions?: string) => {
    if (pizzeriaId && pizza.pizzeriaId !== pizzeriaId && items.length > 0) {
      toast({
        title: "Attention",
        description: "Vous ne pouvez commander que d'une seule pizzeria à la fois. Voulez-vous vider votre panier et commencer une nouvelle commande?",
        variant: "destructive",
        action: (
          <button
            className="bg-white text-red-500 px-3 py-1 rounded-md text-xs font-medium"
            onClick={() => {
              clearCart();
              setPizzeriaId(pizza.pizzeriaId);
              setItems([{ pizza, quantity, specialInstructions }]);
              toast({
                title: "Panier mis à jour",
                description: "Votre panier a été vidé et la nouvelle pizza a été ajoutée.",
              });
            }}
          >
            Confirmer
          </button>
        ),
      });
      return;
    }

    if (!pizzeriaId) {
      setPizzeriaId(pizza.pizzeriaId);
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.pizza.id === pizza.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          specialInstructions: specialInstructions || updatedItems[existingItemIndex].specialInstructions,
        };
        return updatedItems;
      } else {
        return [...prevItems, { pizza, quantity, specialInstructions }];
      }
    });

    toast({
      title: "Ajouté au panier",
      description: `${pizza.name} a été ajouté à votre panier.`,
    });
  };

  const removeItem = (pizzaId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.pizza.id !== pizzaId));
    if (items.length === 1 && items[0].pizza.id === pizzaId) {
      setPizzeriaId(null);
    }
    toast({
      title: "Retiré du panier",
      description: "L'article a été retiré de votre panier.",
    });
  };

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(pizzaId);
      return;
    }
    setItems((prevItems) => prevItems.map((item) => (item.pizza.id === pizzaId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
    setPizzeriaId(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0);
  const total = subtotal; // Modifier ici si nécessaire

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
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};