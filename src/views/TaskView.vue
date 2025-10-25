<template>
  <div class="max-w-5xl mx-auto p-4">
    <header class="flex items-center justify-between gap-2 mb-4">
      <h1 class="text-2xl font-bold">Tasks</h1>
      <div class="flex gap-2">
        <input v-model="q" placeholder="Search..." class="input w-56" @keyup.enter="fetchTasks" />
        <select v-model="status" class="input w-36" @change="fetchTasks">
          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <select v-model="sort" class="input w-40" @change="fetchTasks">
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="title">Title A→Z</option>
          <option value="-title">Title Z→A</option>
        </select>
        <button class="btn-primary" @click="openModal()">+ New</button>
        <button class="border rounded-xl px-3 py-2" @click="logout">Logout</button>
      </div>
    </header>

    <div class="bg-white rounded-2xl shadow divide-y">
      <div v-for="t in rows" :key="t.id" class="flex items-center justify-between p-3">
        <div>
          <div class="font-medium">{{ t.title }}</div>
          <div class="text-sm text-gray-500">{{ t.description }}</div>
          <div class="text-xs mt-1 text-gray-400">{{ t.status }} · {{ new Date(t.created_at).toLocaleString() }}</div>
        </div>
        <div class="flex gap-2">
          <button class="border rounded-xl px-3 py-1" @click="openModal(t)">Edit</button>
          <button class="border rounded-xl px-3 py-1 text-red-600" @click="onDelete(t)">Delete</button>
        </div>
      </div>

      <div v-if="!rows.length" class="p-6 text-center text-gray-500">No tasks</div>
    </div>

    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">Total: {{ meta.total }}</div>
      <div class="flex gap-2">
        <button class="border rounded-xl px-3 py-1" :disabled="page<=1" @click="page--; fetchTasks()">Prev</button>
        <span class="text-sm">Page {{ page }} / {{ meta.total_pages || 1 }}</span>
        <button class="border rounded-xl px-3 py-1" :disabled="page>=meta.total_pages" @click="page++; fetchTasks()">Next</button>
      </div>
    </div>

    <!-- Modal -->
    <dialog ref="dlg" class="rounded-2xl p-0">
      <form @submit.prevent="onSave" class="p-5 w-[380px]">
        <h2 class="text-lg font-semibold mb-3">{{ editing?.id ? 'Edit Task' : 'Create Task' }}</h2>
        <label class="block text-sm mb-1">Title</label>
        <input v-model="form.title" class="input" required />
        <label class="block text-sm mt-3 mb-1">Description</label>
        <textarea v-model="form.description" class="input" rows="3"></textarea>
        <label class="block text-sm mt-3 mb-1">Status</label>
        <select v-model="form.status" class="input" required>
          <option value="todo">todo</option>
          <option value="doing">doing</option>
          <option value="done">done</option>
        </select>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="border rounded-xl px-4 py-2" @click="closeModal">Cancel</button>
          <button class="btn-primary">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { listTasks, createTask, updateTask, deleteTask } from '../api/task'

const auth = useAuthStore()

const rows = ref([])
const meta = reactive({ page: 0, limit: 10, total: 0, total_pages: 1, sort: '-created_at' })
const q = ref('')
const status = ref('')
const sort = ref('-created_at')
const page = ref(0)     // <-- 0-based
const limit = ref(10)

const dlg = ref(null)
const form = reactive({ title: '', description: '', status: 'todo' })
const editing = ref(null)
const saving = ref(false)

function logout() {
  auth.logout()
  location.href = '/login'
}

async function fetchTasks() {
  const { rows: r, meta: m } = await listTasks({
    q: q.value,
    status: status.value,
    sort: sort.value,
    page: page.value,     // 0-based
    limit: limit.value,
  })
  rows.value = r
  Object.assign(meta, m)
}

function openModal(t = null) {
  editing.value = t
  if (t) Object.assign(form, { title: t.title, description: t.description, status: t.status })
  else Object.assign(form, { title: '', description: '', status: 'todo' })
  dlg.value?.showModal()
}
function closeModal() { dlg.value?.close() }

async function onSave() {
  saving.value = true
  try {
    if (editing.value?.id) await updateTask(editing.value.id, form)
    else await createTask(form)
    closeModal()
    await fetchTasks()
  } finally { saving.value = false }
}

async function onDelete(t) {
  if (!confirm(`Delete "${t.title}"?`)) return
  await deleteTask(t.id)
  await fetchTasks()
}

onMounted(fetchTasks)
</script>

<style scoped>
@reference "tailwindcss";

.input {
  @apply w-full rounded-xl border px-3 py-2 outline-none focus:ring focus:border-gray-400;
}
.btn-primary {
  @apply bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 disabled:opacity-50;
}
dialog::backdrop {
  background: #0006;
}
</style>
