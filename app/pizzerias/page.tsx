"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { PizzeriaCard } from "@/components/pizzeria/pizzeria-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Pizzeria } from "@/types/pizza";
import { getNearbyPizzerias } from "@/data/pizzerias";
import { MapPin, Search } from "lucide-react";
import dynamic from "next/dynamic";

// Importer le composant de carte dynamiquement
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function PizzeriasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [filteredPizzerias, setFilteredPizzerias] = useState<Pizzeria[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Obtenir la position de l'utilisateur
  const getUserLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
          alert("Impossible d'obtenir votre position.");
          setIsLocating(false);
        }
      );
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
      setIsLocating(false);
    }
  };

  // Filtrer et trier les pizzerias
  useEffect(() => {
    let results = getNearbyPizzerias(userLocation?.lat || 0, userLocation?.lng || 0);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (pizzeria) =>
          pizzeria.name.toLowerCase().includes(term) || pizzeria.address.toLowerCase().includes(term)
      );
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "rating":
          return b.rating - a.rating;
        case "deliveryTime":
          const getAvgTime = (time: string) => {
            const [min, max] = time.split("-").map((t) => Number.parseInt(t));
            return (min + max) / 2;
          };
          return getAvgTime(a.deliveryTime) - getAvgTime(b.deliveryTime);
        case "deliveryFee":
          return a.deliveryFee - b.deliveryFee;
        default:
          return 0;
      }
    });

    setFilteredPizzerias(results);
  }, [searchTerm, sortBy, userLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pizzerias</h1>
            <p className="text-muted-foreground">Trouvez les meilleures pizzerias du Grand Libreville</p>
          </div>

          <Button variant="outline" className="flex items-center gap-2" onClick={getUserLocation} disabled={isLocating}>
            <MapPin className="h-4 w-4" />
            {isLocating ? "Localisation en cours..." : "Utiliser ma position"}
          </Button>
        </div>

        {/* Carte Leaflet */}
        {userLocation && (
          <div className="flex justify-center items-center mb-8">
            <MapComponent userLocation={userLocation} />
          </div>
        )}

        {/* Recherche et tri */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une pizzeria..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Note</SelectItem>
              <SelectItem value="deliveryTime">Temps de livraison</SelectItem>
              <SelectItem value="deliveryFee">Frais de livraison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Résultats */}
        {filteredPizzerias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPizzerias.map((pizzeria) => (
              <PizzeriaCard key={pizzeria.id} pizzeria={pizzeria} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Aucune pizzeria trouvée</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou votre position</p>
          </div>
        )}
      </main>
    </div>
  );
}