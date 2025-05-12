import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/layout/main-nav"
import { PizzaCard } from "@/components/pizza/pizza-card"
import { PizzeriaCard } from "@/components/pizzeria/pizzeria-card"
import { getPopularPizzas } from "@/data/pizzas"
import { getNearbyPizzerias } from "@/data/pizzerias"
import { ArrowRight, MapPin, Pizza, Truck } from "lucide-react"
import HeroCarousel from "@/components/hero-carousel"


export default function Home() {
  const popularPizzas = getPopularPizzas().slice(0, 4);
  const nearbyPizzerias = getNearbyPizzerias().slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />

      <HeroCarousel />


      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choisissez une pizzeria</h3>
              <p className="text-muted-foreground">Sélectionnez parmi les meilleures pizzerias du Grand Libreville</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <Pizza className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Commandez vos pizzas</h3>
              <p className="text-muted-foreground">Parcourez le menu et ajoutez vos pizzas préférées au panier</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison rapide</h3>
              <p className="text-muted-foreground">Recevez votre commande chaude et délicieuse en un temps record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Pizzas */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Pizzas populaires</h2>
            <Button variant="ghost" asChild>
              <Link href="/pizzerias" className="flex items-center">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPizzas.length > 0 ? (
              popularPizzas.map((pizza) => (
                <PizzaCard key={pizza.id} pizza={pizza} />
              ))
            ) : (
              <p>Aucune pizza populaire trouvée.</p>
            )}
          </div>
        </div>
      </section>

      {/* Nearby Pizzerias */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Pizzerias à proximité</h2>
            <Button variant="ghost" asChild>
              <Link href="/pizzerias" className="flex items-center">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyPizzerias.length > 0 ? (
              nearbyPizzerias.map((pizzeria) => (
                <PizzeriaCard key={pizzeria.id} pizzeria={pizzeria} />
              ))
            ) : (
              <p>Aucune pizzeria à proximité trouvée.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commander?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits et commandez vos pizzas préférées dès maintenant
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/pizzerias">Commander maintenant</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Pizza className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Pizza Casa</span>
              </div>
              <p className="text-muted-foreground">Les meilleures pizzas du Grand Libreville, livrées chez vous</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/pizzerias" className="text-muted-foreground hover:text-foreground">
                    Pizzerias
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-muted-foreground hover:text-foreground">
                    Inscription
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Nous contacter</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">contact@pizzacasa.ga</li>
                <li className="text-muted-foreground">+241 77 12 34 56</li>
                <li className="text-muted-foreground">Libreville, Gabon</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/conditions" className="text-muted-foreground hover:text-foreground">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="text-muted-foreground hover:text-foreground">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                    Politique de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Pizza Casa. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
