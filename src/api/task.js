import http from './http'

// GET /v1/tasks?q=&status=&sort=&page=&limit=
export async function listTasks(params = {}) {
  const resp = await http.get('/v1/tasks', { params })
  // backend: { data: { data: [...], meta: {...} }, message: "Success" }
  const payload = resp.data?.data || {}
  return {
    rows: payload.data || [],
    meta: payload.meta || { page: 0, limit: 10, total: 0, total_pages: 1, sort: '-created_at' },
  }
}

export async function createTask(body) {
  const resp = await http.post('/v1/tasks', body)
  // asumsi backend: { data: { ...task }, message: "Success" }
  return resp.data?.data || null
}

export async function updateTask(id, body) {
  const resp = await http.put(`/v1/tasks/${id}`, body)
  return resp.data?.data || null
}

export async function deleteTask(id) {
  // bisa 204 No Content atau { message: "Success" }
  const resp = await http.delete(`/v1/tasks/${id}`)
  return resp.data?.data || null
}
