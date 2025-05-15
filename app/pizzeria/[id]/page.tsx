"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { PizzaCard } from "@/components/pizza/pizza-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";
import { getPizzeriaById } from "@/data/pizzerias";
import { getPizzasByPizzeriaId } from "@/data/pizzas";
import type { Pizza, Pizzeria } from "@/types/pizza";
import { Clock, MapPin, Star } from "lucide-react";

export default function PizzeriaPage() {
  const params = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [pizzeria, setPizzeria] = useState<Pizzeria | null>(null);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundPizzeria = getPizzeriaById(id);
      const pizzeriasPizzas = getPizzasByPizzeriaId(id);

      if (foundPizzeria) {
        setPizzeria(foundPizzeria);
      } else {
        console.error("Pizzeria non trouvée pour l'ID :", id);
      }

      if (pizzeriasPizzas) {
        setPizzas(pizzeriasPizzas);

        // Extraire les catégories uniques
        const uniqueCategories = Array.from(new Set(pizzeriasPizzas.map((pizza) => pizza.category)));
        setCategories(uniqueCategories);
      } else {
        console.error("Aucune pizza trouvée pour l'ID de pizzeria :", id);
      }
    }
  }, [params.id]);

  const handleAddToCart = (pizza: Pizza) => {
    addItem(pizza, 1);
    toast({
      title: "Pizza ajoutée au panier",
      description: `${pizza.name} a été ajoutée avec succès.`,
      variant: "default",
    });
  };

  // Filtrer les pizzas par catégorie
  const filteredPizzas = activeCategory === "all" ? pizzas : pizzas.filter((pizza) => pizza.category === activeCategory);

  if (!pizzeria) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pizzeria non trouvée</h1>
          <p className="text-muted-foreground">La pizzeria que vous recherchez n'existe pas ou a été supprimée.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1">
        {/* En-tête de la pizzeria */}
        <div className="relative h-64 w-full">
          <Image src={pizzeria.coverImage || "/placeholder.svg"} alt={pizzeria.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container flex items-center gap-4">
              <div className="h-20 w-20 relative bg-white rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={pizzeria.logo || "/logo.jpg"}
                  alt={`Logo ${pizzeria.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{pizzeria.name}</h1>
                  {pizzeria.isOpen ? (
                    <Badge className="bg-accent">Ouvert</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-background/80">Fermé</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{pizzeria.rating} ({pizzeria.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{pizzeria.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{pizzeria.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur la pizzeria */}
        <div className="container py-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-1">Heures d'ouverture</h3>
              <p className="text-muted-foreground">{pizzeria.openingHours.open} - {pizzeria.openingHours.close}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Frais de livraison</h3>
              <p className="text-muted-foreground">{pizzeria.deliveryFee} FCFA</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Commande minimum</h3>
              <p className="text-muted-foreground">{pizzeria.minOrder} FCFA</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>

          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-6 flex flex-wrap">
              <TabsTrigger value="all">Tous</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPizzas.map((pizza) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={() => handleAddToCart(pizza)} />
                ))}
              </div>

              {filteredPizzas.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Aucune pizza trouvée</h3>
                  <p className="text-muted-foreground">Aucune pizza n'est disponible dans cette catégorie.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}