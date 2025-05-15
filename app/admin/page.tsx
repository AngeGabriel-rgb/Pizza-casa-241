import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowRight, Pizza, ShoppingBag, Users, Star } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#9B1B1B] to-[#FF914D] text-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Pizza className="h-8 w-8" />
              <span className="text-2xl font-bold">Admin PizzaCasa</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="hover:text-[#FFB000] transition-colors">
                Fonctionnalités
              </a>
              <a href="#testimonials" className="hover:text-[#FFB000] transition-colors">
                Témoignages
              </a>
              <a href="#pricing" className="hover:text-[#FFB000] transition-colors">
                Tarifs
              </a>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-white text-[#9B1B1B] hover:bg-[#FFB000] hover:text-white">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button className="bg-[#FFB000] text-white hover:bg-white hover:text-[#9B1B1B]">
                <Link href="/register">Inscription</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#9B1B1B] to-[#FF914D] text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Gérez votre réseau de pizzerias en toute simplicité
              </h1>
              <p className="text-xl mb-8">
                Une plateforme complète pour gérer vos commandes, vos pizzerias et vos clients en un seul endroit.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" className="bg-white text-[#9B1B1B] hover:bg-[#FFB000] hover:text-white">
                  <Link href="/login" className="flex items-center">
                    Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#9B1B1B]"
                >
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="bg-[#FFB000]/10 p-3 rounded-full w-fit mb-4">
                  <ShoppingBag className="h-8 w-8 text-[#FFB000]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestion des commandes</h3>
                <p className="text-gray-600">
                  Suivez toutes vos commandes en temps réel, de la confirmation à la livraison.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="bg-[#9B1B1B]/10 p-3 rounded-full w-fit mb-4">
                  <Pizza className="h-8 w-8 text-[#9B1B1B]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestion des pizzerias</h3>
                <p className="text-gray-600">
                  Gérez facilement votre réseau de pizzerias, leurs menus et leurs performances.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="bg-[#FF914D]/10 p-3 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-[#FF914D]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestion des utilisateurs</h3>
                <p className="text-gray-600">Administrez les comptes utilisateurs, les rôles et les permissions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Ce que nos clients disent</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#FFB000]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Depuis que nous utilisons PizzaManager, notre efficacité a augmenté de 30%. La gestion des commandes
                  est devenue un jeu d'enfant."
                </p>
                <div className="flex items-center">
                  <img src="/placeholder.svg?height=50&width=50" alt="Client" className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <p className="font-bold">Jean </p>
                    <p className="text-sm text-gray-500">Directeur, Pizzeria Napoli</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#FFB000]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Le tableau de bord est incroyablement intuitif. Je peux suivre les performances de toutes mes
                  pizzerias en un coup d'œil."
                </p>
                <div className="flex items-center">
                  <img src="/placeholder.svg?height=50&width=50" alt="Client" className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <p className="font-bold">Marie Martin</p>
                    <p className="text-sm text-gray-500">Propriétaire, Réseau Pizza Bella</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à optimiser la gestion de vos pizzerias?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines de propriétaires de pizzerias qui ont déjà transformé leur activité grâce à notre
              plateforme.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-[#9B1B1B] hover:bg-[#FF914D] text-white">
                <Link href="/register">Créer un compte</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#9B1B1B] text-[#9B1B1B] hover:bg-[#9B1B1B] hover:text-white"
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Pizza className="h-6 w-6" />
                <span className="text-xl font-bold">Admin PizzaCasa </span>
              </div>
              <p className="text-gray-400">La solution complète pour la gestion de votre réseau de pizzerias.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white">
                    Témoignages
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white">
                    Tarifs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">contact@pizzamanager.com</li>
                <li className="text-gray-400">+241 77 36 44 91</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PizzaManager. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
