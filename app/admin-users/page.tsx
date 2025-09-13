'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRole } from '@/hooks/use-role'

interface AdminUser {
  id: string
  username: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

interface AdminUserForm {
  username: string
  email: string
  password: string
  full_name: string
  role: string
}

export default function AdminUsersPage() {
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<AdminUserForm>()
  const { isSuperAdmin } = useRole()

  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/api/v1/admin/admin-users').then(res => res.data)
  })

  const createAdminUser = useMutation({
    mutationFn: (data: AdminUserForm) => api.post('/api/v1/admin/create-admin-user', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Admin user created successfully')
      setShowForm(false)
      reset()
    },
    onError: () => toast.error('Failed to create admin user')
  })

  const deleteAdminUser = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/admin/admin-users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Admin user deleted successfully')
    },
    onError: () => toast.error('Failed to delete admin user')
  })

  const onSubmit = (data: AdminUserForm) => {
    createAdminUser.mutate(data)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this admin user?')) {
      deleteAdminUser.mutate(id)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Users</h1>
          {isSuperAdmin && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create Admin User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Username"
                    {...register('username', { required: true })}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register('email', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    {...register('full_name', { required: true })}
                  />
                  <select
                    {...register('role', { required: true })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: true })}
                />
                <div className="flex gap-2">
                  <Button type="submit">Create</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Admin Users Management</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers?.map((user: AdminUser) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}