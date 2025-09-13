'use client'

import { useState, useEffect } from 'react'

export function useRole() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('user_role')
    setRole(storedRole)
  }, [])

  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin

  return { isSuperAdmin, isAdmin, role }
}