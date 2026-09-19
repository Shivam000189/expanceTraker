# Architecture

## System Architecture Overview

The application follows a client-server decoupled architecture:
1. **Frontend**: Single Page Application (SPA) built with React 18, Vite, React Router DOM, and Tailwind CSS.
2. **Backend**: RESTful API built with Express.js running on Node.js.
3. **Persistence**: MongoDB document database interfaced via Mongoose schemas.
4. **AI Layer**: External LLM integration via OpenRouter (`openai/gpt-4o-mini`) and Gemini for smart parsing and financial advisory.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│   React 18 SPA (Vite + Tailwind CSS + Framer Motion)        │
│   - Pages: Landing, Dashboard, Analytics, Bank, Payouts     │
│   - State: Local component state + LocalStorage (JWT Token) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON (Axios API client)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Express Server                        │
│   Node.js runtime + Middleware Pipeline                     │
│   - CORS, Security Headers (nosniff, DENY, XSS)             │
│   - JWT Auth Verification Middleware                        │
│   - Endpoints: /auth, /expenses, /settlements, /payouts,    │
│                /bank, /health, /verify-token                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       MongoDB Database       │ │      External AI APIs        │
│  - Users, Expenses,          │ │  - OpenRouter API            │
│    Banks, Settlements        │ │  - Google Gemini API         │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## Key Subsystems & Data Flows

### 1. Authentication Flow
1. User submits login or signup form (`/login`, `/signup`).
2. Backend hashes password using `bcryptjs` (salt rounds) and saves to `User` collection.
3. On login, backend verifies password match and issues a signed JWT containing `{ userId: user._id, email: user.email }`.
4. Frontend stores token in browser `localStorage`.
5. Subsequent API calls automatically include `Authorization: Bearer <token>` via Axios request interceptors.
6. If a response returns HTTP 401, Axios interceptor clears `localStorage` and routes the user back to `/login`.

### 2. Expense Management & Smart Detection Flow
1. **Manual Entry**: User inputs amount, category, date, and description through `ExpenseModal` or dashboard form.
2. **Smart SMS Detector**:
   - User pastes raw transaction SMS received from a bank (e.g., HDFC, ICICI, SBI).
   - Regex-based pre-parser detects amount, merchant, date, and inferable category keywords.
   - If regex is insufficient or unstructured, backend AI endpoint uses OpenRouter LLM to extract structured fields.
   - User reviews detected fields and commits them directly to the user's expense log.

### 3. Banking, Settlements, and Payouts Flow
1. **Bank Module**: Simulates virtual user accounts, balance inquiries, and inter-user transfers/recipients.
2. **Settlements Module**: Tracks expense settlements through distinct state transitions (`scanned` -> `processing` -> `cleared` -> `deposited`) with automated fee calculations.
3. **Bulk Payout Module**: Validates vendor payout tables against IFSC codes and account formats with CSV/batch export capabilities.

### 4. AI Advisory System
1. Aggregates the user's monthly income and recent expense categories.
2. Sends synthesized context (without leaking sensitive user credentials) to OpenRouter LLM.
3. Returns tailored savings suggestions, category budgeting warnings, and actionable financial tips.
