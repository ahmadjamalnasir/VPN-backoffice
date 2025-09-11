import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UserList from './pages/Users/UserList'
import Login from './pages/Auth/Login'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

function App() {
  const { token, isAdmin } = useSelector((s: RootState) => s.auth)

  const authed = !!token && isAdmin

  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </Box>
    </Layout>
  )
}

export default App


