
---

## README.md — **Frontend (Vue 3 + Vite + Tailwind)**

Akun :
username : "08123"
password : "123456"

```markdown
# Mile App Frontend

Frontend for the Mile App Fullstack Test — built using **Vue 3 (Vite)** with **TailwindCSS**, connected to the Go backend API.

---
### Login Page
- Form for username and password.
- Calls backend `/v1/login` endpoint.
- On success → token stored in Pinia store → redirect to `/tasks`.
- On failure → show error message.

### Task Module
- Displays task list (from `/v1/tasks`).
- Supports:
  - Filter by status
  - Search (`q`)
  - Sort (newest/oldest/title)
  - Pagination
- Modal for creating and editing tasks.
- Delete confirmation popup.
- Responsive design with TailwindCSS.
- Logout button to clear token and redirect to login.

---

## Design Decisions

| Area | Decision | Reason |
|-------|-----------|--------|
| **Framework** | Vue 3 + Vite | Modern, reactive, fast dev/build cycle. |
| **Styling** | TailwindCSS | Utility-first CSS, rapid UI prototyping. |
| **State Management** | Pinia | Lightweight and simple global store for auth. |
| **Routing** | Vue Router | Protected routes & redirection after login. |
| **API** | Fetch API | Minimal dependency, easy to customize headers. |
| **Deployment** | Vercel | Auto-deploy from GitHub, great for SPA hosting. |

---

## Strengths of This Module
- Fast and responsive UI built with TailwindCSS.
- Clean structure: views, stores, and APIs separated.
- Simple login + token-based mock auth.
- Works seamlessly with backend endpoints.
- Fully deployed and accessible online.

---

## Environment Variables
Create `.env`:
```env
VITE_API_BASE_URL=https://backend-mile-app-production.up.railway.app

npm install
npm run dev

npm run build
npm run preview



