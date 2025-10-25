<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
      <h1 class="text-xl font-semibold mb-4">Sign in</h1>

      <label class="block text-sm mb-1">Username</label>
      <input
        v-model="username"
        class="w-full rounded-xl border px-3 py-2 outline-none focus:ring focus:border-gray-400"
        placeholder="e.g. 08123"
      />

      <label class="block text-sm mt-4 mb-1">Password</label>
      <input
        v-model="password"
        type="password"
        class="w-full rounded-xl border px-3 py-2 outline-none focus:ring focus:border-gray-400"
        placeholder="••••••"
      />

      <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>

      <button
        class="bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 disabled:opacity-50 w-full mt-4"
        :disabled="loading"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { nextTick } from 'vue'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    await nextTick() // beri kesempatan guard membaca token dari localStorage

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.replace(redirect ? { path: redirect } : { name: 'tasks' })
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
