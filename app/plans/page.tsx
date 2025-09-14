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
import { SubscriptionPlan } from '@/lib/types'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface PlanForm {
  name: string
  description: string
  price_usd: number
  duration_days: number
  servers: string
  bandwidth: string
  devices: number
  support: string
}

export default function PlansPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, setValue } = useForm<PlanForm>()

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/api/v1/admin/subscriptions/plans').then(res => res.data)
  })

  const createPlan = useMutation({
    mutationFn: (data: any) => api.post('/api/v1/admin/subscriptions/plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Plan created successfully')
      setShowForm(false)
      reset()
    },
    onError: () => toast.error('Failed to create plan')
  })

  const updatePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/v1/admin/subscriptions/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Plan updated successfully')
      setShowForm(false)
      setEditingPlan(null)
      reset()
    },
    onError: () => toast.error('Failed to update plan')
  })

  const deletePlan = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/admin/subscriptions/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Plan deleted successfully')
    },
    onError: () => toast.error('Failed to delete plan')
  })

  const updatePlanStatus = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      api.put(`/api/v1/admin/subscriptions/plans/${id}`, { 
        status: is_active ? 'active' : 'inactive' 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success('Plan status updated')
    },
    onError: () => toast.error('Failed to update plan status')
  })

  const onSubmit = (data: PlanForm) => {
    const planData = {
      name: data.name,
      description: data.description,
      price_usd: data.price_usd,
      duration_days: data.duration_days,
      features: {
        servers: data.servers,
        bandwidth: data.bandwidth,
        devices: data.devices,
        support: data.support
      }
    }

    if (editingPlan) {
      updatePlan.mutate({ id: editingPlan.id, data: planData })
    } else {
      createPlan.mutate(planData)
    }
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setValue('name', plan.name)
    setValue('description', plan.description)
    setValue('price_usd', plan.price_usd)
    setValue('duration_days', plan.duration_days)
    setValue('servers', plan.features.servers)
    setValue('bandwidth', plan.features.bandwidth)
    setValue('devices', plan.features.devices)
    setValue('support', plan.features.support)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan.mutate(id)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Plan name"
                    {...register('name', { required: true })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price USD"
                    {...register('price_usd', { required: true, valueAsNumber: true })}
                  />
                </div>
                <Input
                  placeholder="Description"
                  {...register('description', { required: true })}
                />
                <Input
                  type="number"
                  placeholder="Duration (days)"
                  {...register('duration_days', { required: true, valueAsNumber: true })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Servers (e.g., all)"
                    {...register('servers', { required: true })}
                  />
                  <Input
                    placeholder="Bandwidth (e.g., unlimited)"
                    {...register('bandwidth', { required: true })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Devices"
                    {...register('devices', { required: true, valueAsNumber: true })}
                  />
                  <Input
                    placeholder="Support (e.g., priority)"
                    {...register('support', { required: true })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingPlan ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingPlan(null)
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
            <CardTitle>Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans?.map((plan: SubscriptionPlan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{plan.description}</TableCell>
                      <TableCell>${plan.price_usd}</TableCell>
                      <TableCell>{plan.duration_days} days</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Servers: {plan.features.servers}</div>
                          <div>Bandwidth: {plan.features.bandwidth}</div>
                          <div>Devices: {plan.features.devices}</div>
                          <div>Support: {plan.features.support}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={plan.is_active}
                          onCheckedChange={(checked) =>
                            updatePlanStatus.mutate({ id: plan.id, is_active: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan.id)}
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