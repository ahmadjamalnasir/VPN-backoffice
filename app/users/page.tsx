'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User } from '@/lib/types'
import { toast } from 'sonner'
import { Search, Eye } from 'lucide-react'
import { useRole } from '@/hooks/use-role'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const queryClient = useQueryClient()
  const { isSuperAdmin } = useRole()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => api.get('/api/v1/users/?skip=0&limit=100').then(res => res.data)
  })

  const { data: userDetails } = useQuery({
    queryKey: ['users', selectedUser?.id],
    queryFn: () => api.get(`/api/v1/users/${selectedUser?.id}`).then(res => res.data),
    enabled: !!selectedUser?.id
  })

  const updateUserStatus = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      api.patch(`/api/v1/users/${id}/status`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update user status')
  })

  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase()) ||
                         user.username.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && user.is_active) ||
                         (filter === 'inactive' && !user.is_active)
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">VPN Users</h1>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f as any)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>VPN User Management</CardTitle>
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
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="capitalize">{user.subscription_status}</TableCell>
                      <TableCell>
                        {isSuperAdmin ? (
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={(checked) =>
                              updateUserStatus.mutate({ id: user.id, is_active: checked })
                            }
                          />
                        ) : (
                          <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedUser && userDetails && (
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <p>{userDetails.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created At</label>
                  <p>{new Date(userDetails.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p>{userDetails.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}