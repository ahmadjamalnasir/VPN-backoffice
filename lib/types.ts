export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  role: 'user' | 'admin'
  subscription_status: 'active' | 'inactive' | 'expired'
  created_at: string
}

export interface VPNUser {
  user_id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  is_email_verified: boolean
  is_premium: boolean
  is_active: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration_days: number
  features: string[]
  is_active: boolean
}

export interface VPNServer {
  id: string
  name: string
  ip_address: string
  country: string
  city: string
  is_premium: boolean
  status: 'active' | 'inactive' | 'maintenance'
  max_connections: number
  current_connections: number
}

export interface AnalyticsUsage {
  active_users: number
  total_bandwidth: number
  connections_per_server: { server_id: string; connections: number }[]
  date: string
}

export interface AnalyticsPerformance {
  server_id: string
  latency_ms: number
  uptime_percentage: number
  timestamp: string
}

export interface SystemHealth {
  service: 'db' | 'cache' | 'system'
  status: 'healthy' | 'warning' | 'error'
  message?: string
  last_check: string
}