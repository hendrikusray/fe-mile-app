import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

http.interceptors.request.use((cfg) => {
  const auth = useAuthStore()
  if (auth?.token) {
    cfg.headers = cfg.headers || {}
    cfg.headers.Authorization = `Bearer ${auth.token}`
  }
  return cfg
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default http
