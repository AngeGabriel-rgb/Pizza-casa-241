export interface DashboardStats {
  total_orders: number
  total_revenue: number
  total_pizzerias: number
  total_users: number
  orders_by_status: {
    confirmed: number
    preparing: number
    delivering: number
    delivered: number
    cancelled: number
  }
  tickets_by_status: {
    open: number
    pending: number
    closed: number
  }
  recent_orders: any[]
  recent_tickets: any[]
  top_pizzerias: any[]
}
