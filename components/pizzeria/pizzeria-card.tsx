import Image from "next/image"
import Link from "next/link"
import type { Pizzeria } from "@/types/pizza"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star } from "lucide-react"

interface PizzeriaCardProps {
  pizzeria: Pizzeria
}

export function PizzeriaCard({ pizzeria }: PizzeriaCardProps) {
  // Format distance in km
  const formatDistance = (distance?: number) => {
    if (!distance) return ""
    return `${distance.toFixed(1)} km`
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-40 w-full">
        <Image src={pizzeria.coverImage || "/placeholder.svg"} alt={pizzeria.name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          {pizzeria.isOpen ? (
            <Badge className="bg-accent">Ouvert</Badge>
          ) : (
            <Badge variant="outline" className="bg-background/80">
              Fermé
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 relative bg-white rounded-full overflow-hidden border-2 border-white">
              <Image
                src={pizzeria.logo || "/placeholder.svg"}
                alt={`Logo ${pizzeria.name}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-white">{pizzeria.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white">
                  {pizzeria.rating} ({pizzeria.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {pizzeria.address}
              {pizzeria.distance && (
                <span className="ml-1 text-xs font-medium">({formatDistance(pizzeria.distance)})</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Livraison: {pizzeria.deliveryTime}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Frais de livraison:</span>{" "}
              <span className="font-medium">{pizzeria.deliveryFee} FCFA</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={`/pizzeria/${pizzeria.id}`}>Voir le menu</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
