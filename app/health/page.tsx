'use client'

import { useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SystemHealth } from '@/lib/types'
import { CheckCircle, AlertTriangle, XCircle, Database, HardDrive, Activity } from 'lucide-react'

export default function HealthPage() {
  const { data: dbHealth, refetch: refetchDb } = useQuery({
    queryKey: ['health', 'db'],
    queryFn: () => api.get('/api/v1/health/db').then(res => res.data),
    refetchInterval: 30000
  })

  const { data: cacheHealth, refetch: refetchCache } = useQuery({
    queryKey: ['health', 'cache'],
    queryFn: () => api.get('/api/v1/health/cache').then(res => res.data),
    refetchInterval: 30000
  })

  const { data: systemHealth, refetch: refetchSystem } = useQuery({
    queryKey: ['health', 'system'],
    queryFn: () => api.get('/api/v1/health/system').then(res => res.data),
    refetchInterval: 30000
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Activity className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const healthServices = [
    {
      name: 'Database',
      icon: Database,
      data: dbHealth,
      refetch: refetchDb
    },
    {
      name: 'Cache',
      icon: HardDrive,
      data: cacheHealth,
      refetch: refetchCache
    },
    {
      name: 'System',
      icon: Activity,
      data: systemHealth,
      refetch: refetchSystem
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Health</h1>
          <div className="text-sm text-muted-foreground">
            Auto-refresh every 30 seconds
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthServices.map((service) => {
            const Icon = service.icon
            const status = service.data?.status || 'unknown'
            
            return (
              <Card key={service.name} className={`border-2 ${getStatusColor(status)}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
                  <Icon className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(status)}
                    <span className="text-lg font-semibold capitalize">{status}</span>
                  </div>
                  {service.data?.message && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.data.message}
                    </p>
                  )}
                  {service.data?.last_check && (
                    <p className="text-xs text-muted-foreground">
                      Last check: {new Date(service.data.last_check).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Overall Status</h3>
                  <div className="flex items-center space-x-2">
                    {healthServices.every(s => s.data?.status === 'healthy') ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-600 font-medium">All Systems Operational</span>
                      </>
                    ) : healthServices.some(s => s.data?.status === 'error') ? (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-600 font-medium">System Issues Detected</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-600 font-medium">Some Warnings</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Services Monitored</h3>
                  <p className="text-2xl font-bold">{healthServices.length}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Healthy Services</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {healthServices.filter(s => s.data?.status === 'healthy').length}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Service Details</h3>
                <div className="space-y-2">
                  {healthServices.map((service) => (
                    <div key={service.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <service.icon className="h-5 w-5" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(service.data?.status || 'unknown')}
                        <span className="capitalize">{service.data?.status || 'Unknown'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}