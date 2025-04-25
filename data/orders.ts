import type { Order } from "@/types/pizza"
import { getPizzaById } from "./pizzas"

export const generateMockOrders = (userId: string, role: string): Order[] => {
  // Base orders that will be modified based on role
  const baseOrders: Order[] = [
    {
      id: "1",
      clientId: "1",
      pizzeriaId: "1",
      items: [
        {
          pizza: getPizzaById("1")!,
          quantity: 1,
        },
        {
          pizza: getPizzaById("3")!,
          quantity: 2,
          specialInstructions: "Extra fromage s'il vous plaît",
        },
      ],
      status: "delivered",
      deliveryAddress: "123 Rue des Palmiers, Libreville",
      paymentMethod: "cash",
      paymentStatus: "paid",
      subtotal: 21500,
      deliveryFee: 1500,
      total: 23000,
      createdAt: "2023-04-10T14:30:00Z",
      livreurId: "3",
    },
    {
      id: "2",
      clientId: "1",
      pizzeriaId: "2",
      items: [
        {
          pizza: getPizzaById("9")!,
          quantity: 1,
        },
        {
          pizza: getPizzaById("10")!,
          quantity: 1,
        },
      ],
      status: "preparing",
      deliveryAddress: "123 Rue des Palmiers, Libreville",
      deliveryTime: "2023-04-15T19:15:00Z",
      paymentMethod: "card",
      paymentStatus: "paid",
      subtotal: 15000,
      deliveryFee: 1000,
      total: 16000,
      createdAt: "2023-04-15T18:45:00Z",
    },
    {
      id: "3",
      clientId: "1",
      pizzeriaId: "1",
      items: [
        {
          pizza: getPizzaById("4")!,
          quantity: 1,
        },
      ],
      status: "pending",
      deliveryAddress: "123 Rue des Palmiers, Libreville",
      paymentMethod: "mobile",
      paymentStatus: "pending",
      subtotal: 7000,
      deliveryFee: 1500,
      total: 8500,
      createdAt: "2023-04-15T20:10:00Z",
    },
  ]

  // Filter and modify orders based on role
  switch (role) {
    case "client":
      return baseOrders.filter((order) => order.clientId === userId)

    case "pizzeria":
      return baseOrders.filter((order) => order.pizzeriaId === userId)

    case "livreur":
      return baseOrders.filter((order) => order.livreurId === userId || ["ready", "delivering"].includes(order.status))

    case "admin":
      // Admin sees all orders
      return baseOrders

    default:
      return []
  }
}

export const getOrderById = (orderId: string, userId: string, role: string): Order | undefined => {
  const orders = generateMockOrders(userId, role)
  return orders.find((order) => order.id === orderId)
}
