export interface Pizza {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  sizes: {
    small?: number
    medium?: number
    large?: number
  }
  isPopular?: boolean
  isVegetarian?: boolean
  pizzeriaId: string
}

export interface Pizzeria {
  id: string
  name: string
  address: string
  logo: string
  coverImage: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  location: {
    lat: number
    lng: number
  }
  openingHours: {
    open: string
    close: string
  }
  isOpen: boolean
  distance?: number // Calculated based on user location
}

export interface Order {
  id: string
  clientId: string
  pizzeriaId: string
  items: {
    pizza: Pizza
    quantity: number
    specialInstructions?: string
  }[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled"
  deliveryAddress: string
  deliveryTime?: string
  paymentMethod: "cash" | "card" | "mobile"
  paymentStatus: "pending" | "paid"
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  livreurId?: string
}
