"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Images du carrousel
const carouselImages = [
  {
    src: "/hero/hero1.png",
    alt: "Pizza délicieuse",
    title: "Découvrez les meilleures pizzerias près de chez vous",
    description: "Commandez facilement vos pizzas préférées en quelques clics et profitez d'une livraison rapide.",
  },
  {
    src: "/hero/hero2.png",
    alt: "Pizza artisanale",
    title: "Des pizzas artisanales préparées avec passion",
    description:
      "Nos pizzaiolos sélectionnent les meilleurs ingrédients pour vous offrir une expérience gustative unique.",
  },
  {
    src: "/hero/hero3.png",
    alt: "Livraison rapide",
    title: "Livraison rapide à domicile",
    description: "Recevez votre commande en moins de 45 minutes, chaude et savoureuse.",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToNext = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const goToPrevious = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(goToNext, 10000)
    return () => clearInterval(interval)
  }, [goToNext])

  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      {/* Images du carrousel */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
      ))}

      {/* Contenu */}
      <div className="container relative z-10 text-white">
        <div className="max-w-2xl space-y-6">
          <h1
            className="text-4xl md:text-6xl font-bold font-montserrat transition-transform duration-500 transform"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(20px)" : "translateY(0)",
            }}
          >
            {carouselImages[currentIndex].title}
          </h1>
          <p
            className="text-lg md:text-xl opacity-90 transition-transform duration-500 delay-100 transform"
            style={{
              opacity: isAnimating ? 0 : 0.9,
              transform: isAnimating ? "translateY(20px)" : "translateY(0)",
            }}
          >
            {carouselImages[currentIndex].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/pizzerias">
              <Button size="lg" className="bg-[#9B1B1B]  hover:bg-[#FF914D] text-white">
                Trouver une pizzeria
              </Button>
            </Link>
       
          </div>
        </div>
      </div>

      {/* Contrôles du carrousel */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-[#FFB000] w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => {
              setIsAnimating(true)
              setCurrentIndex(index)
              setTimeout(() => setIsAnimating(false), 500)
            }}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Flèches de navigation */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-20"
        onClick={goToPrevious}
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-20"
        onClick={goToNext}
        aria-label="Image suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  )
}
