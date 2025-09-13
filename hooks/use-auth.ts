'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Skip API verification, just check token exists
      setIsAuthenticated(true)
      setIsLoading(false)
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