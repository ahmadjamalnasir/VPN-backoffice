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
import { useRole } from '@/hooks/use-role'

interface ServerForm {
  hostname: string
  location: string
  endpoint: string
  public_key: string
  tunnel_ip: string
  allowed_ips: string
  is_premium: boolean
  status: 'active' | 'inactive' | 'maintenance'
  max_connections: number
}

export default function ServersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingServer, setEditingServer] = useState<any | null>(null)
  const queryClient = useQueryClient()
  const { isSuperAdmin } = useRole()

  const { register, handleSubmit, reset, setValue } = useForm<ServerForm>()

  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: () => api.get('/api/v1/admin/servers').then(res => res.data)
  })

  const createServer = useMutation({
    mutationFn: (data: ServerForm) => {
      const params = new URLSearchParams({
        hostname: data.hostname,
        location: data.location,
        endpoint: data.endpoint,
        public_key: data.public_key,
        tunnel_ip: data.tunnel_ip,
        allowed_ips: data.allowed_ips,
        is_premium: data.is_premium.toString(),
        status: data.status,
        max_connections: data.max_connections.toString()
      })
      return api.post(`/api/v1/admin/add_server?${params}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
      toast.success('Server created successfully')
      setShowForm(false)
      reset()
    },
    onError: () => toast.error('Failed to create server')
  })

  const updateServer = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServerForm }) => {
      const params = new URLSearchParams({
        hostname: data.hostname,
        location: data.location,
        endpoint: data.endpoint,
        public_key: data.public_key,
        tunnel_ip: data.tunnel_ip,
        allowed_ips: data.allowed_ips,
        is_premium: data.is_premium.toString(),
        status: data.status,
        max_connections: data.max_connections.toString()
      })
      return api.put(`/api/v1/admin/servers/${id}?${params}`)
    },
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
    mutationFn: (id: string) => api.delete(`/api/v1/admin/servers/${id}`),
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

  const handleEdit = (server: any) => {
    setEditingServer(server)
    setValue('hostname', server.hostname)
    setValue('location', server.location)
    setValue('endpoint', server.endpoint)
    setValue('public_key', server.public_key)
    setValue('tunnel_ip', server.tunnel_ip)
    setValue('allowed_ips', server.allowed_ips)
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
          {isSuperAdmin && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Server
            </Button>
          )}
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
                    placeholder="Hostname (e.g., test-server-1)"
                    {...register('hostname', { required: true })}
                  />
                  <Input
                    placeholder="Location (e.g., United States)"
                    {...register('location', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Endpoint (e.g., 23.123.12.12:51820)"
                    {...register('endpoint', { required: true })}
                  />
                  <Input
                    placeholder="Public Key"
                    {...register('public_key', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Tunnel IP (e.g., 10.221.12.11/32)"
                    {...register('tunnel_ip', { required: true })}
                  />
                  <Input
                    placeholder="Allowed IPs (e.g., 0.0.0.0/0)"
                    {...register('allowed_ips', { required: true })}
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
                    placeholder="Max Connections"
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
                    <TableHead>Hostname</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Public Key</TableHead>
                    <TableHead>Tunnel IP</TableHead>
                    <TableHead>Allowed IPs</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Load</TableHead>
                    <TableHead>Max Connections</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.map((server: any) => (
                    <TableRow key={server.id}>
                      <TableCell className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        {server.hostname}
                      </TableCell>
                      <TableCell>{server.location}</TableCell>
                      <TableCell>{server.endpoint}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {server.public_key ? server.public_key.substring(0, 20) + '...' : 'N/A'}
                      </TableCell>
                      <TableCell>{server.tunnel_ip}</TableCell>
                      <TableCell>{server.allowed_ips}</TableCell>
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
                        {server.current_load ? (server.current_load * 100).toFixed(1) : '0.0'}%
                      </TableCell>
                      <TableCell>
                        {server.max_connections}
                      </TableCell>
                      <TableCell className="text-xs">
                        {server.created_at ? new Date(server.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {isSuperAdmin && (
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