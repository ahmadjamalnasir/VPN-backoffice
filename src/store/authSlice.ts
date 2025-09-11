import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

type AuthState = {
  token: string | null
  loading: boolean
  error: string | null
  isAdmin: boolean
}

const initialState: AuthState = {
  token: localStorage.getItem('auth_token'),
  loading: false,
  error: null,
  isAdmin: false
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await api.post('/api/v1/auth/login', payload)
    return res.data as { access_token: string }
  }
)

export const verifyAdmin = createAsyncThunk(
  'auth/verifyAdmin',
  async () => {
    const res = await api.get('/api/v1/admin/rate-limits/config')
    return !!res.data
  }
)

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      localStorage.removeItem('auth_token')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const token = action.payload.access_token
        state.token = token
        localStorage.setItem('auth_token', token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(verifyAdmin.fulfilled, (state) => {
        state.isAdmin = true
      })
      .addCase(verifyAdmin.rejected, (state) => {
        state.isAdmin = false
        state.token = null
        localStorage.removeItem('auth_token')
      })
  }
})

export const { logout } = slice.actions
export default slice.reducer


