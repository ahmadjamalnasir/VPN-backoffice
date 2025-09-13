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
import { VPNServer } from '@/lib/types'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Server } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface ServerForm {
  name: string
  ip_address: string
  country: string
  city: string
  is_premium: boolean
  status: 'active' | 'inactive' | 'maintenance'
  max_connections: number
}

export default function ServersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingServer, setEditingServer] = useState<VPNServer | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, setValue, watch } = useForm<ServerForm>()

  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: () => api.get('/api/v1/vpn/servers').then(res => res.data)
  })

  const createServer = useMutation({
    mutationFn: (data: any) => api.post('/api/v1/vpn/servers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
      toast.success('Server created successfully')
      setShowForm(false)
      reset()
    },
    onError: () => toast.error('Failed to create server')
  })

  const updateServer = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/v1/vpn/servers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
      toast.success('Server updated successfully')
      setShowForm(false)
      setEditingServer(null)
      reset()
    },
    onError: () => toast.error('Failed to update server')
  })

  const deleteServer = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/vpn/servers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
      toast.success('Server deleted successfully')
    },
    onError: () => toast.error('Failed to delete server')
  })

  const onSubmit = (data: ServerForm) => {
    if (editingServer) {
      updateServer.mutate({ id: editingServer.id, data })
    } else {
      createServer.mutate(data)
    }
  }

  const handleEdit = (server: VPNServer) => {
    setEditingServer(server)
    setValue('name', server.name)
    setValue('ip_address', server.ip_address)
    setValue('country', server.country)
    setValue('city', server.city)
    setValue('is_premium', server.is_premium)
    setValue('status', server.status)
    setValue('max_connections', server.max_connections)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      deleteServer.mutate(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'inactive': return 'text-red-600'
      case 'maintenance': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">VPN Servers</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingServer ? 'Edit Server' : 'Add New Server'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Server name"
                    {...register('name', { required: true })}
                  />
                  <Input
                    placeholder="IP Address"
                    {...register('ip_address', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Country"
                    {...register('country', { required: true })}
                  />
                  <Input
                    placeholder="City"
                    {...register('city', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    {...register('status', { required: true })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Max connections"
                    {...register('max_connections', { required: true, valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('is_premium')}
                    className="h-4 w-4"
                  />
                  <label className="text-sm">Premium server</label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingServer ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingServer(null)
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
            <CardTitle>Servers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Connections</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.map((server: VPNServer) => (
                    <TableRow key={server.id}>
                      <TableCell className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        {server.name}
                      </TableCell>
                      <TableCell>{server.ip_address}</TableCell>
                      <TableCell>{server.city}, {server.country}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${server.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {server.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`capitalize ${getStatusColor(server.status)}`}>
                          {server.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {server.current_connections}/{server.max_connections}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(server)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(server.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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