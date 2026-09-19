# Technical Concerns & Areas for Improvement

## 1. Security & Secrets Management
- **Sensitive Keys in Local Environment**: `backend/.env` contains raw API keys (`OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `SECRET_KEY`). Ensure `.env` files remain strictly in `.gitignore` and are never committed to version control.
- **JWT Secret Fallback**: In some places, fallback strings or generic secrets are tolerated in development. A strong, mandatory secret must be enforced in production.
- **CORS Allowed Origins**: Ensure production CORS origins in `backend/index.js` strictly allow verified client domains.

---

## 2. Data Integrity & Concurrency
- **Bank Balance Transfers Lack Atomicity**:
  - In `bankRoutes.js`, balance transfers deduct from the sender and credit the receiver in separate Mongoose operations without a MongoDB replica set session / multi-document transaction (`session.withTransaction`).
  - If the server crashes or network fails between the debit and credit operations, funds could be lost.
- **Deprecated Mongoose 8 Connection Flags**:
  - `useNewUrlParser: true` and `useUnifiedTopology: true` in `backend/config/db.js` are deprecated and no-ops in Mongoose 8.x.

---

## 3. Architecture & Code Consistency
- **Naming Inconsistencies & Typos**:
  - "expance" vs "expense" appears across folders and filenames (`expance traker`, `ExpanceTraker`, `expanceRoutes.js`, `expance.js`).
  - In `frontend/ExpanceTraker/src/pages/`, file naming is mixed: `Bank.jsx` (PascalCase), `Main.jsx` (PascalCase), `dashboard.jsx` (lowercase), `selete.jsx` (typo/abbreviation for settlement select), `store-dashboard.jsx` (kebab-case).
  - API response keys: Some endpoints return `{ msg: "..." }` while others return `{ message: "..." }`. Standardizing on `{ message: "..." }` will prevent client parsing discrepancies.
- **Duplicate Routes & Dead Code**:
  - In `frontend/ExpanceTraker/src/App.jsx`, both `/expenses` and `/dashboard` point to `<Dashboard />`.
  - Commented out routes (e.g. line 38 in `App.jsx` pointing to `Settlements` vs `Selete`).

---

## 4. Test Coverage & Quality Assurance
- **No Automated Tests**:
  - Neither the backend nor frontend contains unit, integration, or end-to-end tests.
  - Critical financial calculations (monthly totals, category breakdowns, daily spending averages) in `utils/analytics.js` lack test assertions.
  - Adding automated testing with Vitest/Jest and Supertest is a high priority before significant refactoring.
