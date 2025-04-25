"use client"

import Image from "next/image"
import Link from "next/link"
import type { Pizza } from "@/types/pizza"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

interface PizzaCardProps {
  pizza: Pizza
  showAddToCart?: boolean
  onAddToCart?: () => void
}

export function PizzaCard({ pizza, showAddToCart = true, onAddToCart }: PizzaCardProps) {
  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
        {pizza.isPopular && <Badge className="absolute top-2 right-2 bg-primary">Populaire</Badge>}
        {pizza.isVegetarian && (
          <Badge className="absolute top-2 left-2 bg-accent">
            <Leaf className="h-3 w-3 mr-1" />
            Végétarien
          </Badge>
        )}
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{pizza.name}</h3>
          <span className="font-semibold text-primary">{formatPrice(pizza.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{pizza.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        {showAddToCart ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/pizza/${pizza.id}`}>Détails</Link>
            </Button>
            <Button className="flex-1" onClick={onAddToCart}>
              Ajouter
            </Button>
          </div>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/pizza/${pizza.id}`}>Voir détails</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
