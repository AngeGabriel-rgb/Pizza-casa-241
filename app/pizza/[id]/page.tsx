"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { getPizzaById } from "@/data/pizzas"
import type { Pizza } from "@/types/pizza"
import { ChevronLeft, Leaf, Minus, Plus } from "lucide-react"

export default function PizzaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const [pizza, setPizza] = useState<Pizza | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const foundPizza = getPizzaById(id)

      if (foundPizza) {
        setPizza(foundPizza)

        // Set initial price based on medium size or default price
        const initialPrice = foundPizza.sizes.medium || foundPizza.price
        setPrice(initialPrice)
      }
    }
  }, [params.id])

  useEffect(() => {
    if (pizza) {
      // Update price when size changes
      setPrice(pizza.sizes[selectedSize] || pizza.price)
    }
  }, [selectedSize, pizza])

  const handleAddToCart = () => {
    if (pizza) {
      // Create a copy of the pizza with the selected size price
      const pizzaWithSelectedSize = {
        ...pizza,
        price: price,
      }

      addItem(pizzaWithSelectedSize, quantity, specialInstructions)

      toast({
        title: "Ajouté au panier",
        description: `${quantity} x ${pizza.name} (${selectedSize}) ajouté à votre panier.`,
      })

      router.push(`/pizzeria/${pizza.pizzeriaId}`)
    }
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  if (!pizza) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pizza non trouvée</h1>
          <p className="text-muted-foreground">La pizza que vous recherchez n'existe pas ou a été supprimée.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1 container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pizza Image */}
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
            {pizza.isVegetarian && (
              <Badge className="absolute top-4 left-4 bg-accent">
                <Leaf className="h-3 w-3 mr-1" />
                Végétarien
              </Badge>
            )}
          </div>

          {/* Pizza Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{pizza.name}</h1>
            <p className="text-xl text-primary font-semibold mb-4">{formatPrice(price)}</p>
            <p className="text-muted-foreground mb-6">{pizza.description}</p>

            <div className="space-y-6">
              {/* Ingredients */}
              <div>
                <h3 className="font-semibold mb-2">Ingrédients</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {pizza.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold mb-2">Taille</h3>
                <Select
                  value={selectedSize}
                  onValueChange={(value) => setSelectedSize(value as "small" | "medium" | "large")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    {pizza.sizes.small && (
                      <SelectItem value="small">Petite ({formatPrice(pizza.sizes.small)})</SelectItem>
                    )}
                    {pizza.sizes.medium && (
                      <SelectItem value="medium">Moyenne ({formatPrice(pizza.sizes.medium)})</SelectItem>
                    )}
                    {pizza.sizes.large && (
                      <SelectItem value="large">Grande ({formatPrice(pizza.sizes.large)})</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-2">Quantité</h3>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementQuantity}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 font-semibold text-lg w-8 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={incrementQuantity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h3 className="font-semibold mb-2">Instructions spéciales</h3>
                <Textarea
                  placeholder="Ex: Sans oignons, extra fromage, etc."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Total */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">{formatPrice(price * quantity)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Add to Cart Button */}
              <Button className="w-full" size="lg" onClick={handleAddToCart}>
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
