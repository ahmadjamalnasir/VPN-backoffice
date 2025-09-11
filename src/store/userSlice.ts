import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService, User } from '../services/userService'

type UsersState = {
  items: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null
}

export const fetchUserByEmail = createAsyncThunk(
  'users/fetchByEmail',
  async (email: string) => {
    const user = await userService.getByEmail(email)
    return user
  }
)

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        state.loading = false
        const user = action.payload
        const exists = state.items.findIndex(u => u.id === user.id)
        if (exists >= 0) state.items[exists] = user
        else state.items.push(user)
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user'
      })
  }
})

export default slice.reducer


