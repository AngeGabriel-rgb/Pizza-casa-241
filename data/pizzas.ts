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
    image: "/pizza3.avif",
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
    image: "/p3.avif",
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
    image: "/pizza6.avif",
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
    image: "/hero.avif",
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
    image: "/pizza7.avif",
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
    image: "/Margaherita.webp?height=300&width=300",
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
  {
    "id": "11",
    "name": "Quattro Stagioni",
    "description": "Une pizza divisée en quatre sections représentant les saisons : artichauts, champignons, jambon et olives",
    "price": 9500,
    "image": "/p4.avif",
    "category": "Spécialités",
    "ingredients": ["Sauce tomate", "Mozzarella", "Artichauts", "Champignons", "Jambon", "Olives"],
    "sizes": {
      "small": 9500,
      "medium": 11500,
      "large": 13500
    },
    "pizzeriaId": "2"
  },
  {
    "id": "12",
    "name": "Tonno e Cipolla",
    "description": "Une combinaison simple mais savoureuse de thon et d'oignons rouges",
    "price": 8200,
    "image": "/pizza10.avif",
    "category": "Classiques",
    "ingredients": ["Sauce tomate", "Mozzarella", "Thon", "Oignons rouges"],
    "sizes": {
      "small": 8200,
      "medium": 10200,
      "large": 12200
    },
    "pizzeriaId": "2"
  },
  {
    "id": "13",
    "name": "Vegetariana Deluxe",
    "description": "Une version enrichie de la végétarienne avec des légumes grillés et du pesto",
    "price": 10000,
    "image": "/pizza13.avif",
    "category": "Végétariennes",
    "ingredients": ["Sauce tomate", "Mozzarella", "Aubergines grillées", "Courgettes grillées", "Poivrons grillés", "Pesto"],
    "sizes": {
      "small": 10000,
      "medium": 12000,
      "large": 14000
    },
    "isVegetarian": true,
    "pizzeriaId": "2"
  },
  {
    "id": "14",
    "name": "Diavola Speciale",
    "description": "Pour les amateurs de sensations fortes : double dose de salami piquant et de piments",
    "price": 9800,
    "image": "/pizza15.avif",
    "category": "Spécialités",
    "ingredients": ["Sauce tomate", "Mozzarella", "Double salami piquant", "Piments"],
    "sizes": {
      "small": 9800,
      "medium": 11800,
      "large": 13800
    },
    "pizzeriaId": "2"
  },
  {
    "id": "15",
    "name": "Frutti di Mare Speciale",
    "description": "Une sélection exquise de fruits de mer frais marinés à l'ail et au persil",
    "price": 12500,
    "image": "/pizzaclient9.avif",
    "category": "Spécialités",
    "ingredients": ["Sauce tomate", "Mozzarella", "Crevettes", "Moules", "Calamars", "Palourdes", "Ail", "Persil"],
    "sizes": {
      "small": 12500,
      "medium": 14500,
      "large": 16500
    },
    "pizzeriaId": "2"
  },
  {
    "id": "16",
    "name": "Hawaïenne Dolce",
    "description": "Une version sucrée-salée avec du jambon, de l'ananas et une touche de miel",
    "price": 8500,
    "image": "/pizza22.avif",
    "category": "Spécialités",
    "ingredients": ["Sauce tomate", "Mozzarella", "Jambon", "Ananas", "Miel"],
    "sizes": {
      "small": 8500,
      "medium": 10500,
      "large": 12500
    },
    "pizzeriaId": "2"
  },
  {
    "id": "17",
    "name": "Carbonara Bianca",
    "description": "Une version blanche de la carbonara avec crème, guanciale, pecorino romano et œuf",
    "price": 11000,
    "image": "/pizzaclient11.avif",
    "category": "Spécialités",
    "ingredients": ["Crème fraîche", "Mozzarella", "Guanciale", "Pecorino Romano", "Œuf", "Poivre noir"],
    "sizes": {
      "small": 11000,
      "medium": 13000,
      "large": 15000
    },
    "pizzeriaId": "2"
  },
    // Pizzas pour Mamma Mia Akanda (id: 3)
  {
      "id": "18",
      "name": "Pollo e Pesto",
      "description": "Poulet grillé, pesto maison et tomates cerises",
      "price": 10200,
      "image": "/p1.avif",
      "category": "Spécialités",
      "ingredients": ["Sauce tomate", "Mozzarella", "Poulet grillé", "Pesto", "Tomates cerises"],
      "sizes": {
        "small": 10200,
        "medium": 12200,
        "large": 14200
      },
      "pizzeriaId": "4"
  },
    {
      "id": "19",
      "name": "Calzone Roma",
      "description": "Calzone spécial de la maison farci de saucisse italienne, brocolis et provolone",
      "price": 9500,
      "image": "/corleone.avif",
      "category": "Calzones",
      "ingredients": ["Sauce tomate", "Mozzarella", "Saucisse italienne", "Brocolis", "Provolone"],
      "sizes": {
        "unique": 9500
      },
      "pizzeriaId": "4"
  },
    {
      "id": "20",
      "name": "Calzone Spinaci e Ricotta",
      "description": "Calzone végétarien aux épinards frais et à la ricotta crémeuse",
      "price": 9200,
      "image": "/pizza15.avif",
      "category": "Calzones",
      "ingredients": ["Sauce tomate", "Mozzarella", "Épinards", "Ricotta", "Ail"],
      "sizes": {
        "unique": 9200
      },
      "isVegetarian": true,
      "pizzeriaId": "4"
  },
    {
      "id": "21",
      "name": "Pizza Bianca ai Funghi",
      "description": "Pizza blanche avec un mélange de champignons sauvages, huile de truffe et parmesan",
      "price": 11500,
      "image": "/pizza_bianca_funghi.avif?height=300&width=300",
      "category": "Spécialités",
      "ingredients": ["Mozzarella", "Mélange de champignons sauvages", "Huile de truffe", "Parmesan", "Ail"],
      "sizes": {
        "small": 11500,
        "medium": 13500,
        "large": 15500
      },
      "isVegetarian": true,
      "pizzeriaId": "4"
  },
   {
      "id": "22",
      "name": "Pizza ai Formaggi di Capra e Miele",
      "description": "Pizza avec du fromage de chèvre, du miel, des noix et des figues",
      "price": 10500,
      "image": "/pizza_capra_miele.avif?height=300&width=300",
      "category": "Spécialités",
      "ingredients": ["Mozzarella", "Fromage de chèvre", "Miel", "Noix", "Figues"],
      "sizes": {
        "small": 10500,
        "medium": 12500,
        "large": 14500
      },
      "isVegetarian": true,
      "pizzeriaId": "4"
  },
    {
      "id": "23",
      "name": "Pizza Mediterranea Speciale",
      "description": "Une version enrichie avec du poulpe grillé, des câpres et du citron",
      "price": 12000,
      "image": "/pizza_mediterranea_speciale.avif?height=300&width=300",
      "category": "Spécialités",
      "ingredients": ["Sauce tomate", "Mozzarella", "Olives Kalamata", "Feta", "Tomates séchées", "Origan", "Poulpe grillé", "Câpres", "Citron"],
      "sizes": {
        "small": 12000,
        "medium": 14000,
        "large": 16000
      },
      "pizzeriaId": "4"
  },
    {
      "id": "24",
      "name": "Pizza Rustica",
      "description": "Une pizza campagnarde avec de la saucisse, des pommes de terre et du romarin",
      "price": 10000,
      "image": "/pizza_rustica.avif?height=300&width=300",
      "category": "Spécialités",
      "ingredients": ["Sauce tomate", "Mozzarella", "Saucisse", "Pommes de terre", "Romarin"],
      "sizes": {
        "small": 10000,
        "medium": 12000,
        "large": 14000
      },
      "pizzeriaId": "4"
  }  
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