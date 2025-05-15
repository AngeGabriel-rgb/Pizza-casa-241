export type OrderStatus = "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled"
export type PaymentMethod = "card" | "paypal" | "cash"

export interface OrderItem {
  id?: string
  order_id?: string
  name: string
  quantity: number
  price: number
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_avatar?: string
  pizzeria_id: string
  pizzeria_name: string
  total: number
  status: OrderStatus
  date: string
  time: string
  items: OrderItem[]
  delivery_fee: number
  payment_method: PaymentMethod
  created_at?: string
  updated_at?: string
}

export interface OrderFilter {
  status?: OrderStatus
  search?: string
  period?: "today" | "yesterday" | "week" | "month" | "custom"
  startDate?: string
  endDate?: string
}
