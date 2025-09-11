import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { login, verifyAdmin } from '../../store/authSlice'
import type { AppDispatch, RootState } from '../../store'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((s: RootState) => s.auth)
  const [email, setEmail] = useState('admin')
  const [password, setPassword] = useState('admin')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password })).unwrap()
      await dispatch(verifyAdmin()).unwrap()
      window.location.href = '/dashboard'
    } catch (err) {
      // handled by slice state
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" gutterBottom>Admin Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={onSubmit}>
          <TextField
            label="Username or Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Default: admin / admin
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}

export default Login


