'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        await api.get('/api/v1/admin/rate-limits/config')
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('auth_token')
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return { isAuthenticated, isLoading, logout }
}