export type PizzeriaStatus = "active" | "inactive"

export interface Pizzeria {
  id: string
  name: string
  image: string
  rating: number
  address: string
  phone: string
  opening_hours: string
  tags: string[]
  status: PizzeriaStatus
  orders_count: number
  revenue: number
  description?: string
  created_at?: string
  updated_at?: string
}

export interface PizzeriaFilter {
  status?: PizzeriaStatus
  search?: string
}
