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
import { VPNUser } from '@/lib/types'
import { toast } from 'sonner'
import { Search, History, CreditCard } from 'lucide-react'
import { useRole } from '@/hooks/use-role'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<VPNUser | null>(null)
  const [historyUser, setHistoryUser] = useState<VPNUser | null>(null)
  const [activeSubUser, setActiveSubUser] = useState<VPNUser | null>(null)
  const queryClient = useQueryClient()
  const { isSuperAdmin } = useRole()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'list', search, filter],
    queryFn: () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(search && { search })
      })
      return api.get(`/api/v1/admin/vpn-users?${params}`).then(res => res.data)
    }
  })

  const { data: userDetails } = useQuery({
    queryKey: ['users', selectedUser?.user_id],
    queryFn: () => api.get(`/api/v1/admin/vpn-users/${selectedUser?.user_id}`).then(res => res.data),
    enabled: !!selectedUser?.user_id
  })

  const { data: subscriptionHistory } = useQuery({
    queryKey: ['subscription-history', historyUser?.user_id],
    queryFn: () => api.get(`/api/v1/admin/subscriptions/users/${historyUser?.user_id}/history`).then(res => res.data),
    enabled: !!historyUser?.user_id
  })

  const { data: activeSubscription } = useQuery({
    queryKey: ['active-subscription', activeSubUser?.user_id],
    queryFn: () => api.get(`/api/v1/admin/subscriptions/users/${activeSubUser?.user_id}`).then(res => res.data),
    enabled: !!activeSubUser?.user_id
  })

  const updateUserStatus = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      api.put(`/api/v1/admin/vpn-user/${id}/status?is_active=${is_active}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update user status')
  })

  const filteredUsers = users?.filter((user: VPNUser) => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && user.is_active) ||
                         (filter === 'inactive' && !user.is_active)
    return matchesFilter
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
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Status</TableHead>
                    {isSuperAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user: any) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>{user.country || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={user.is_email_verified ? 'text-green-600' : 'text-red-600'}>
                          {user.is_email_verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${user.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isSuperAdmin ? (
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={(checked) =>
                              updateUserStatus.mutate({ id: user.user_id, is_active: checked })
                            }
                          />
                        ) : (
                          <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setHistoryUser(user)}
                              title="Subscription History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveSubUser(user)}
                              title="Active Subscription"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
                  <label className="text-sm font-medium">User ID</label>
                  <p>{userDetails.user_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p>{userDetails.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{userDetails.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p>{userDetails.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <p>{userDetails.country || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Verified</label>
                  <p>{userDetails.is_email_verified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Premium</label>
                  <p>{userDetails.is_premium ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p>{userDetails.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={!!historyUser} onOpenChange={() => setHistoryUser(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Subscription History - {historyUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {subscriptionHistory ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auto Renew</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionHistory.map((sub: any) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.plan?.name || 'N/A'}</TableCell>
                        <TableCell>{sub.plan?.description || 'N/A'}</TableCell>
                        <TableCell>${sub.plan?.price_usd || '0.00'}</TableCell>
                        <TableCell>{sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            sub.status === 'active' ? 'bg-green-100 text-green-800' :
                            sub.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {sub.status || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={sub.auto_renew ? 'text-green-600' : 'text-red-600'}>
                            {sub.auto_renew ? 'Yes' : 'No'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div>Loading subscription history...</div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!activeSubUser} onOpenChange={() => setActiveSubUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Active Subscription - {activeSubUser?.name}</DialogTitle>
            </DialogHeader>
            <div>
              {activeSubscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Plan Name</label>
                      <p>{activeSubscription.plan?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p>{activeSubscription.plan?.description || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <p>${activeSubscription.plan?.price_usd || '0.00'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <p>{activeSubscription.plan?.duration_days || 0} days</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <p>{activeSubscription.start_date ? new Date(activeSubscription.start_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <p>{activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <span className={`px-2 py-1 rounded text-xs ${
                        activeSubscription.status === 'active' ? 'bg-green-100 text-green-800' :
                        activeSubscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activeSubscription.status || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Auto Renew</label>
                      <span className={activeSubscription.auto_renew ? 'text-green-600' : 'text-red-600'}>
                        {activeSubscription.auto_renew ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading active subscription...</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}