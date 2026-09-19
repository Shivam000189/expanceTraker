# Code Conventions & Patterns

## Coding Standards

### JavaScript & React Conventions
- **Module System**:
  - Backend uses CommonJS (`require` / `module.exports`).
  - Frontend uses ES Modules (`import` / `export`).
- **File Naming**:
  - React components use PascalCase (`ExpenseModal.jsx`, `DonutChart.jsx`) or camelCase/lowercase in pages (`dashboard.jsx`, `login.jsx`, `setting.jsx`, `Bank.jsx`).
  - Helper and utility files use camelCase (`analytics.js`, `utils.js`).
  - Route handlers in backend use camelCase (`authRoutes.js`, `expanceRoutes.js`).
- **Styling**:
  - Tailwind CSS utility classes directly inside JSX `className`.
  - Utility helpers `clsx` and `tailwind-merge` (`cn` pattern in `lib/utils.js`) for conditional styling.
  - Dark mode styles implemented with `dark:` variants and semantic color palettes.

### Backend API Design Conventions
- **Routing**: Grouped under domain prefixes (`/auth`, `/expenses`, `/settlements`, `/payouts`, `/bank`).
- **Middleware**:
  - JWT verification extracted into reusable `authMiddleware.js`.
  - Optional user attachment middleware for contextual routes (e.g. landing page chat advisor).
- **Error Responses**:
  - Standard JSON response format: `{ message: "...", error?: "..." }` or `{ msg: "..." }`.
  - HTTP status codes: `200` (OK), `201` (Created), `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden), `404` (Not Found), `500` (Server Error).
  - Centralized Express error handler in `backend/index.js`.

### State Management & Data Fetching
- **Client State**:
  - Local component state via React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
  - Auth token persisted in `localStorage` (`localStorage.getItem('token')`).
- **API Requests**:
  - Centralized Axios instance in `frontend/ExpanceTraker/src/api.js`.
  - Auto-injection of Authorization Bearer header.
  - Global 401 interceptor automatically clears token and redirects to `/login`.
  - User feedback via `react-hot-toast` for success and error states.

### Validation & Security
- Password hashing with `bcryptjs` before persisting user records.
- Input validation on backend using `zod` schemas or explicit regex validators (e.g. IFSC code regex `/^[A-Z]{4}0[A-Z0-9]{6}$/` and 10-digit account numbers in payout routes).
- HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) configured in Express.
