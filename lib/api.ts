import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    console.log('API Response:', res.status, res.data)
    return res
  },
  (err) => {
    console.error('API Error:', err.response?.status, err.response?.data)
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api