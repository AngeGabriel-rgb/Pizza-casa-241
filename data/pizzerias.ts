import type { Pizzeria } from "@/types/pizza"

export const pizzerias: Pizzeria[] = [
  {
    id: "1",
    name: "Pizza Napoli",
    address: "45 Avenue de l'Indépendance, Libreville",
    logo: "/napoli.jpeg?height=80&width=80",
    coverImage: "/napoli.jpeg?height=300&width=600",
    rating: 4.7,
    reviewCount: 124,
    deliveryTime: "30-45 min",
    deliveryFee: 1500,
    minOrder: 5000,
    location: {
      lat: 0.4162,
      lng: 9.4673,
    },
    openingHours: {
      open: "11:00",
      close: "22:00",
    },
    isOpen: true,
  },
  {
    id: "2",
    name: "Pizzeria Roma",
    address: "12 Boulevard du Bord de Mer, Libreville",
    logo: "/piazza.jpeg?height=80&width=80",
    coverImage: "/piazza.jpeg?height=300&width=600",
    rating: 4.5,
    reviewCount: 98,
    deliveryTime: "25-40 min",
    deliveryFee: 1000,
    minOrder: 4000,
    location: {
      lat: 0.4052,
      lng: 9.4512,
    },
    openingHours: {
      open: "10:00",
      close: "23:00",
    },
    isOpen: true,
  },
  {
    id: "3",
    name: "Pizza Express Owendo",
    address: "78 Rue des Palmiers, Owendo",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=300&width=600",
    rating: 4.3,
    reviewCount: 76,
    deliveryTime: "35-50 min",
    deliveryFee: 2000,
    minOrder: 6000,
    location: {
      lat: 0.2952,
      lng: 9.5112,
    },
    openingHours: {
      open: "11:30",
      close: "21:30",
    },
    isOpen: true,
  },
  {
    id: "4",
    name: "Mamma Mia Akanda",
    address: "23 Avenue des Cocotiers, Akanda",
    logo: "/mama_mia.jpeg?height=80&width=80",
    coverImage: "/mama_mia.jpeg?height=300&width=600",
    rating: 4.8,
    reviewCount: 112,
    deliveryTime: "40-55 min",
    deliveryFee: 2500,
    minOrder: 7000,
    location: {
      lat: 0.4562,
      lng: 9.4873,
    },
    openingHours: {
      open: "12:00",
      close: "22:30",
    },
    isOpen: true,
  },
  {
    id: "5",
    name: "Pizza Bella Ntoum",
    address: "5 Route Nationale, Ntoum",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=300&width=600",
    rating: 4.2,
    reviewCount: 45,
    deliveryTime: "50-65 min",
    deliveryFee: 3000,
    minOrder: 8000,
    location: {
      lat: 0.3852,
      lng: 9.7612,
    },
    openingHours: {
      open: "11:00",
      close: "21:00",
    },
    isOpen: false,
  },
]

export const calculateDistance = (
  userLat: number,
  userLng: number,
  pizzeriaLat: number,
  pizzeriaLng: number,
): number => {
  // Simple distance calculation (not accurate for real-world use)
  const latDiff = Math.abs(userLat - pizzeriaLat)
  const lngDiff = Math.abs(userLng - pizzeriaLng)

  // Convert to approximate kilometers (very simplified)
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111
}

export const getPizzeriaById = (id: string): Pizzeria | undefined => {
  return pizzerias.find((pizzeria) => pizzeria.id === id)
}

export const getNearbyPizzerias = (
  userLat = 0.4162, // Default to Libreville center
  userLng = 9.4673,
  maxDistance = 10, // km
): Pizzeria[] => {
  return pizzerias
    .map((pizzeria) => {
      const distance = calculateDistance(userLat, userLng, pizzeria.location.lat, pizzeria.location.lng)

      return {
        ...pizzeria,
        distance,
      }
    })
    .filter((pizzeria) => pizzeria.distance <= maxDistance)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
}
