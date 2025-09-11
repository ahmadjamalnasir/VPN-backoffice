import api from './api'

export type User = {
  id: string
  user_id: number
  name: string
  email: string
  phone?: string | null
  country?: string | null
  is_active: boolean
  is_premium: boolean
  is_email_verified: boolean
}

export const userService = {
  async getByEmail(email: string): Promise<User> {
    const res = await api.get(`/api/v1/users/profile`, { params: { email } })
    return res.data
  },
  async list(limit = 50, offset = 0): Promise<User[]> {
    // No list endpoint in backend; fetch by search will be needed in future.
    // Placeholder to be wired once backend exposes admin list endpoint.
    return []
  }
}


