'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AnalyticsUsage, AnalyticsPerformance } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function AnalyticsPage() {
  const { data: usage } = useQuery({
    queryKey: ['analytics', 'usage'],
    queryFn: () => api.get('/api/v1/analytics/usage').then(res => res.data)
  })

  const { data: performance } = useQuery({
    queryKey: ['analytics', 'performance'],
    queryFn: () => api.get('/api/v1/analytics/performance').then(res => res.data)
  })

  const connectionData = usage?.connections_per_server?.map((conn: any) => ({
    server: `Server ${conn.server_id.slice(-4)}`,
    connections: conn.connections
  })) || []

  const performanceData = performance?.map((perf: AnalyticsPerformance) => ({
    time: new Date(perf.timestamp).toLocaleTimeString(),
    latency: perf.latency_ms,
    uptime: perf.uptime_percentage
  })) || []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {usage?.active_users || 0}
              </div>
              <p className="text-sm text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Bandwidth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {usage?.total_bandwidth || 0} GB
              </div>
              <p className="text-sm text-muted-foreground">Data transferred</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Server Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {Math.round((connectionData.reduce((sum, item) => sum + item.connections, 0) / connectionData.length) || 0)}%
              </div>
              <p className="text-sm text-muted-foreground">Average utilization</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Connections per Server</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={connectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="server" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="connections" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Server Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" stroke="#ef4444" name="Latency (ms)" />
                  <Line type="monotone" dataKey="uptime" stroke="#10b981" name="Uptime %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Server Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance?.map((perf: AnalyticsPerformance, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <p className="font-medium">Server {perf.server_id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(perf.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Latency: <span className="font-medium">{perf.latency_ms}ms</span>
                    </p>
                    <p className="text-sm">
                      Uptime: <span className="font-medium">{perf.uptime_percentage}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}