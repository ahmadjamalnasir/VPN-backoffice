'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Users, Server, Activity, TrendingUp, Wifi, Database, Zap } from 'lucide-react'

export default function DashboardPage() {
  const { data: dashboardData } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/api/v1/admin/dashboard').then(res => res.data)
  })

  const { data: healthStatus } = useQuery({
    queryKey: ['health', 'status'],
    queryFn: () => api.get('/api/v1/health/status').then(res => res.data)
  })

  const { data: systemMetrics } = useQuery({
    queryKey: ['health', 'metrics'],
    queryFn: () => api.get('/api/v1/health/metrics').then(res => res.data)
  })

  const { data: pingStatus } = useQuery({
    queryKey: ['health', 'ping'],
    queryFn: () => api.get('/api/v1/health/ping').then(res => res.data)
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard & System Health</h1>
        
        {/* Basic Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.active_users || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_servers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_bandwidth || 0} GB</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.active_subscriptions || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Health Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                healthStatus?.status === 'healthy' ? 'text-green-600' :
                healthStatus?.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {healthStatus?.status || 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus?.timestamp ? new Date(healthStatus.timestamp).toLocaleTimeString() : 'Last check'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                healthStatus?.database?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {healthStatus?.database?.status || 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus?.database?.response_time_ms}ms response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redis Cache</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                healthStatus?.redis?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {healthStatus?.redis?.status || 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus?.redis?.response_time_ms}ms response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {healthStatus?.servers?.active_count || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus?.servers?.total_connections || 0} total connections
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">CPU Usage</label>
                  <p className="text-lg font-bold">{healthStatus?.system?.cpu_usage_percent || 0}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Memory Usage</label>
                  <p className="text-lg font-bold">{healthStatus?.system?.memory_usage_percent || 0}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Disk Usage</label>
                  <p className="text-lg font-bold">{healthStatus?.system?.disk_usage_percent || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>24h Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Connections (24h)</label>
                  <p className="text-lg font-bold">{systemMetrics?.connections_24h || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Active Now</label>
                  <p className="text-lg font-bold">{systemMetrics?.active_connections || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Avg Session</label>
                  <p className="text-lg font-bold">{systemMetrics?.avg_session_duration_minutes || 0}m</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data Transfer</label>
                  <p className="text-lg font-bold">{systemMetrics?.data_transfer_24h_gb || 0} GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Server Load Distribution */}
        {systemMetrics?.server_load_distribution && (
          <Card>
            <CardHeader>
              <CardTitle>Server Load Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemMetrics.server_load_distribution.map((server: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{server.location}</p>
                      <p className="text-sm text-muted-foreground">{server.server_count} servers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{server.avg_load_percent}%</p>
                      <p className="text-sm text-muted-foreground">avg load</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}