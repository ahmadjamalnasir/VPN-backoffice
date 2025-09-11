import { useEffect, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { fetchUserByEmail } from '../../store/userSlice'

type User = {
  id: string
  user_id: number
  name: string
  email: string
  is_active: boolean
  is_premium: boolean
}

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((s: RootState) => s.users.items)
  const loading = useSelector((s: RootState) => s.users.loading)
  const [query, setQuery] = useState('')

  useEffect(() => {
    // initial state empty; allow searching by email
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <TextField
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" sx={{ mb: 2 }}>
        Enter an email and press Enter to fetch a user.
      </Typography>
      <form onSubmit={(e) => { e.preventDefault(); if (query) dispatch(fetchUserByEmail(query)) }}>
        {/* hidden submit to enable Enter key */}
        <button type="submit" style={{ display: 'none' }} />
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            )}
            {filtered.map(u => (
              <TableRow key={u.id} hover>
                <TableCell>{u.user_id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{u.is_premium ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UserList


