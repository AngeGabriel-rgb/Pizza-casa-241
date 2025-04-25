import type { Pizza } from "@/types/pizza"

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "Margherita",
    description: "La classique italienne avec sauce tomate, mozzarella et basilic frais",
    price: 6500,
    image: "/Margaherita.webp?height=300&width=300",
    category: "Classiques",
    ingredients: ["Sauce tomate", "Mozzarella", "Basilic frais", "Huile d'olive"],
    sizes: {
      small: 6500,
      medium: 8500,
      large: 10500,
    },
    isPopular: true,
    isVegetarian: true,
    pizzeriaId: "1",
  },
  {
    id: "2",
    name: "Quatre Fromages",
    description: "Un délice pour les amateurs de fromage avec mozzarella, gorgonzola, parmesan et chèvre",
    price: 8500,
    image: "/placeholder.svg?height=300&width=300",
    category: "Spécialités",
    ingredients: ["Sauce tomate", "Mozzarella", "Gorgonzola", "Parmesan", "Chèvre"],
    sizes: {
      small: 8500,
      medium: 10500,
      large: 12500,
    },
    isVegetarian: true,
    pizzeriaId: "1",
  },
  {
    id: "3",
    name: "Pepperoni",
    description: "Une pizza américaine classique avec du pepperoni épicé et de la mozzarella fondante",
    price: 7500,
    image: "/peperoni.webp?height=300&width=300",
    category: "Classiques",
    ingredients: ["Sauce tomate", "Mozzarella", "Pepperoni"],
    sizes: {
      small: 7500,
      medium: 9500,
      large: 11500,
    },
    isPopular: true,
    pizzeriaId: "1",
  },
  {
    id: "4",
    name: "Végétarienne",
    description: "Un mélange savoureux de légumes frais sur une base de sauce tomate et mozzarella",
    price: 7000,
    image: "/?height=300&width=300",
    category: "Végétariennes",
    ingredients: ["Sauce tomate", "Mozzarella", "Poivrons", "Champignons", "Oignons", "Olives", "Tomates fraîches"],
    sizes: {
      small: 7000,
      medium: 9000,
      large: 11000,
    },
    isVegetarian: true,
    pizzeriaId: "1",
  },
  {
    id: "5",
    name: "Hawaienne",
    description: "La controversée mais délicieuse pizza avec jambon et ananas",
    price: 7500,
    image: "/placeholder.svg?height=300&width=300",
    category: "Spécialités",
    ingredients: ["Sauce tomate", "Mozzarella", "Jambon", "Ananas"],
    sizes: {
      small: 7500,
      medium: 9500,
      large: 11500,
    },
    pizzeriaId: "1",
  },
  {
    id: "6",
    name: "Calzone",
    description: "Pizza pliée et farcie de jambon, champignons et mozzarella",
    price: 8000,
    image: "/placeholder.svg?height=300&width=300",
    category: "Spécialités",
    ingredients: ["Sauce tomate", "Mozzarella", "Jambon", "Champignons", "Ricotta"],
    sizes: {
      small: 8000,
      medium: 10000,
      large: 12000,
    },
    pizzeriaId: "1",
  },
  {
    id: "7",
    name: "Napolitaine",
    description: "Pizza traditionnelle avec anchois, câpres et olives noires",
    price: 7500,
    image: "/placeholder.svg?height=300&width=300",
    category: "Classiques",
    ingredients: ["Sauce tomate", "Mozzarella", "Anchois", "Câpres", "Olives noires"],
    sizes: {
      small: 7500,
      medium: 9500,
      large: 11500,
    },
    pizzeriaId: "1",
  },
  {
    id: "8",
    name: "Diavola",
    description: "Pizza épicée avec salami piquant, poivrons et piments",
    price: 8000,
    image: "/diavola.webp?height=300&width=300",
    category: "Spécialités",
    ingredients: ["Sauce tomate", "Mozzarella", "Salami piquant", "Poivrons", "Piments"],
    sizes: {
      small: 8000,
      medium: 10000,
      large: 12000,
    },
    isPopular: true,
    pizzeriaId: "1",
  },
  // Pizzas pour Pizzeria Roma (id: 2)
  {
    id: "9",
    name: "Margherita",
    description: "La classique italienne avec sauce tomate, mozzarella et basilic frais",
    price: 6000,
    image: "/placeholder.svg?height=300&width=300",
    category: "Classiques",
    ingredients: ["Sauce tomate", "Mozzarella", "Basilic frais", "Huile d'olive"],
    sizes: {
      small: 6000,
      medium: 8000,
      large: 10000,
    },
    isVegetarian: true,
    pizzeriaId: "2",
  },
  {
    id: "10",
    name: "Roma Spéciale",
    description: "Spécialité de la maison avec jambon, champignons, artichauts et olives",
    price: 9000,
    image: "/corleone.avif?height=300&width=300",
    category: "Spécialités",
    ingredients: ["Sauce tomate", "Mozzarella", "Jambon", "Champignons", "Artichauts", "Olives"],
    sizes: {
      small: 9000,
      medium: 11000,
      large: 13000,
    },
    isPopular: true,
    pizzeriaId: "2",
  },
]

export const getPizzasByPizzeriaId = (pizzeriaId: string): Pizza[] => {
  return pizzas.filter((pizza) => pizza.pizzeriaId === pizzeriaId)
}

export const getPizzaById = (id: string): Pizza | undefined => {
  return pizzas.find((pizza) => pizza.id === id)
}

export const getPopularPizzas = (): Pizza[] => {
  return pizzas.filter((pizza) => pizza.isPopular)
}

export const getVegetarianPizzas = (): Pizza[] => {
  return pizzas.filter((pizza) => pizza.isVegetarian)
}
