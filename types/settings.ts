export interface UserSettings {
  id: string
  user_id: string
  language: string
  theme: "light" | "dark" | "system"
  notifications_email: boolean
  notifications_push: boolean
  notifications_orders: boolean
  notifications_promotions: boolean
  notifications_support: boolean
  created_at?: string
  updated_at?: string
}

export interface AppSettings {
  id: string
  site_name: string
  logo_url: string
  primary_color: string
  secondary_color: string
  contact_email: string
  support_phone: string
  default_language: string
  default_currency: string
  delivery_fee: number
  min_order_amount: number
  created_at?: string
  updated_at?: string
}
