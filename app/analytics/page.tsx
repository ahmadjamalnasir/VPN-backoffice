'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)

  const { data: personalUsage } = useQuery({
    queryKey: ['analytics', 'personal-usage', days],
    queryFn: () => api.get(`/api/v1/analytics/usage/personal?days=${days}`).then(res => res.data)
  })

  const { data: serverPerformance } = useQuery({
    queryKey: ['analytics', 'server-performance'],
    queryFn: () => api.get('/api/v1/analytics/servers/performance').then(res => res.data)
  })

  const { data: systemOverview } = useQuery({
    queryKey: ['analytics', 'system-overview'],
    queryFn: () => api.get('/api/v1/analytics/system/overview').then(res => res.data)
  })

  const { data: locationUsage } = useQuery({
    queryKey: ['analytics', 'location-usage', days],
    queryFn: () => api.get(`/api/v1/analytics/locations/usage?days=${days}`).then(res => res.data)
  })

  const serverData = serverPerformance?.map((server: any) => ({
    name: server.hostname || `Server ${server.server_id?.slice(-4)}`,
    location: server.location,
    load: Math.round(server.current_load * 100),
    ping: server.ping,
    connections: server.total_connections,
    data_gb: server.total_data_gb,
    avg_session: server.avg_session_minutes
  })) || []

  const locationData = locationUsage?.map((location: any) => ({
    name: location.location,
    connections: location.total_connections,
    users: location.unique_users,
    data_gb: location.total_data_gb,
    avg_session: location.avg_session_minutes
  })) || []

  const dailyUsageData = personalUsage?.daily_usage?.slice(-7).map((day: any) => ({
    date: new Date(day.date).toLocaleDateString(),
    connections: day.connections,
    data_gb: Math.round(day.data_mb / 1024 * 100) / 100,
    duration_hours: Math.round(day.duration_minutes / 60 * 100) / 100
  })) || []

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <div className="flex gap-2 mb-6">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? 'default' : 'outline'}
              onClick={() => setDays(d)}
            >
              {d} days
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {systemOverview?.active_connections || 0}
              </div>
              <p className="text-sm text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {personalUsage?.total_connections || 0}
              </div>
              <p className="text-sm text-muted-foreground">Last {days} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {personalUsage?.total_data_gb || 0} GB
              </div>
              <p className="text-sm text-muted-foreground">Last {days} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(personalUsage?.total_duration_hours || 0)}h
              </div>
              <p className="text-sm text-muted-foreground">Last {days} days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="connections" stroke="#3b82f6" name="Connections" />
                  <Line type="monotone" dataKey="data_gb" stroke="#10b981" name="Data (GB)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {locationData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Server Load & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="load" fill="#ef4444" name="Load %" />
                  <Bar dataKey="ping" fill="#3b82f6" name="Ping (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Transfer by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="data_gb" fill="#10b981" name="Data (GB)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Server Performance</h4>
                <div className="space-y-2">
                  {serverData.map((server: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {server.location} • {server.connections} connections
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Load: <span className="font-medium">{server.load}%</span>
                        </p>
                        <p className="text-sm">
                          Ping: <span className="font-medium">{server.ping}ms</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Location Statistics</h4>
                <div className="space-y-2">
                  {locationData.map((location: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.users} unique users • {location.connections} connections
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Data: <span className="font-medium">{location.data_gb} GB</span>
                        </p>
                        <p className="text-sm">
                          Avg Session: <span className="font-medium">{location.avg_session}m</span>
                        </p>
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