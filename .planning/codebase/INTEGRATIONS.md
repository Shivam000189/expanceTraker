# Integrations & External Services

## Overview
This document details all external service integrations, environment variables, authentication protocols, and database connections utilized by the Expense Tracker application.

---

## 1. Database Integration

### MongoDB (Mongoose ODM)
- **Driver**: `mongoose` v8.19.2
- **Connection Configuration**: Located in [backend/config/db.js](file:///d:/shivam/projects/expance%20traker/backend/config/db.js)
- **Connection String**: `MONGO_URI` or fallback `mongodb://localhost:27017/expance`
- **Models**:
  - `User` ([backend/models/auth.js](file:///d:/shivam/projects/expance%20traker/backend/models/auth.js)): Manages accounts, hashed passwords, monthly income, and AI advisor usage limits.
  - `Expense` ([backend/models/expance.js](file:///d:/shivam/projects/expance%20traker/backend/models/expance.js)): Stores user expenses with title, amount, category, date, and user reference.
  - `Bank` ([backend/models/bank.js](file:///d:/shivam/projects/expance%20traker/backend/models/bank.js)): Stores user simulated bank balance.
  - `Settlement` ([backend/models/settlement.js](file:///d:/shivam/projects/expance%20traker/backend/models/settlement.js)): Tracks settlement lifecycles (`scanned`, `processing`, `cleared`, `deposited`).

---

## 2. Authentication & Authorization

### JWT Token Management
- **Token Type**: Bearer token via `Authorization: Bearer <token>` HTTP header.
- **Verification**: Middleware in [backend/middleware/authMiddleware.js](file:///d:/shivam/projects/expance%20traker/backend/middleware/authMiddleware.js) using `SECRET_KEY` or `JWT_SECRET`.
- **Client Handling**: [frontend/ExpanceTraker/src/api.js](file:///d:/shivam/projects/expance%20traker/frontend/ExpanceTraker/src/api.js) automatically injects the stored JWT from `localStorage` on outgoing requests and handles `401 Unauthorized` responses by redirecting to `/login`.
- **Protected Routes**: React router wrapper in [frontend/ExpanceTraker/src/components/ProtectedRoute.jsx](file:///d:/shivam/projects/expance%20traker/frontend/ExpanceTraker/src/components/ProtectedRoute.jsx).

---

## 3. Third-Party Services & AI Providers

### OpenRouter AI API
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `openai/gpt-4o-mini` (configurable via `OPENROUTER_MODEL`)
- **Use Cases**:
  - Financial advisor in landing chatbot (`LandingChatbot.jsx`)
  - Personalized spending advisor card in Analytics (`AnalyticsAdvisorCard.jsx`)
  - Contextual expense classification & fallback SMS extraction
- **Rate Limiting**: Authenticated users have an enforced window-based rate limit (e.g. 10 requests per 12-hour window in `authRoutes.js`). Unauthenticated landing users are limited to 5 prompts.

### Gemini API
- **Key**: Configured via `GEMINI_API_KEY` for alternate or fallback LLM processing.

---

## 4. Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default / Description |
| :--- | :--- | :--- |
| `PORT` | Optional | Port for Express server (default `5000` or `3000`) |
| `SECRET_KEY` / `JWT_SECRET` | Required | Secret key for signing and verifying JWT tokens |
| `MONGO_URI` / `MONGODB_URI` | Required | Connection string for MongoDB database |
| `OPENROUTER_API_KEY` | Optional | API key for OpenRouter AI services |
| `OPENROUTER_MODEL` | Optional | Model identifier (defaults to `openai/gpt-4o-mini`) |
| `GEMINI_API_KEY` | Optional | Google Gemini API key |
| `NODE_ENV` | Optional | Environment mode (`development` / `production`) |

### Frontend (`frontend/ExpanceTraker/.env` & `.env.local`)
| Variable | Required | Default / Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Required | Root URL for the backend API (e.g. `http://localhost:5000` or production URL) |
