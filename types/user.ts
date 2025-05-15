export type UserStatus = "active" | "inactive" | "blocked"
export type UserRole = "user" | "admin"

export interface Address {
  id?: string
  user_id?: string
  name: string
  street: string
  city: string
  postal_code: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  status: UserStatus
  role: UserRole
  registered_date: string
  orders_count: number
  total_spent: number
  last_login?: string
  addresses: Address[]
  created_at?: string
  updated_at?: string
}

export interface UserFilter {
  status?: UserStatus
  role?: UserRole
  search?: string
}
