// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthed: (s) => !!s.token
  },
  actions: {
    async login(username, password) {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(r => r.json())

      if (!res?.data?.access_token) {
        throw new Error(res?.error?.message || 'invalid credentials')
      }

      this.token = res.data.access_token
      localStorage.setItem('token', this.token)
      return true
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
