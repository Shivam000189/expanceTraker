# Project Roadmap

## Milestone 1: Stabilization & Hardening (v1.1)

### Phase 1: Core Reliability & Security
- **Goal**: Harden backend security, fix data integrity risks in banking transfers, and modernize database connection setup.
- **Key Deliverables**:
  - Implement MongoDB multi-document transactions (`session.withTransaction`) for bank fund transfers.
  - Remove deprecated Mongoose 8 flags (`useNewUrlParser`, `useUnifiedTopology`) from `backend/config/db.js`.
  - Add auth endpoint rate limiting (`express-rate-limit`) to prevent brute-force attacks.
  - Standardize error response payloads to consistently return `{ message: "..." }`.

### Phase 2: Automated Testing Suite
- **Goal**: Establish a baseline automated test harness for backend and frontend.
- **Key Deliverables**:
  - Configure Vitest or Jest with Supertest in `backend/`.
  - Add integration tests for `/auth/signup`, `/auth/login`, and token verification.
  - Add integration tests for `/expenses` CRUD operations and SMS regex normalization.
  - Add unit tests for frontend math helpers in `frontend/ExpanceTraker/src/utils/analytics.js`.

---

## Milestone 2: Code Quality & Feature Enhancements (v1.2)

### Phase 3: Architecture & Route Cleanup
- **Goal**: Streamline frontend page routing and harmonize naming across the codebase.
- **Key Deliverables**:
  - Standardize frontend page filename conventions (PascalCase vs camelCase).
  - Resolve route duplication (`/expenses` vs `/dashboard`, `Settlements` vs `Selete`).
  - Eliminate dead code and unreferenced components.

### Phase 4: Advanced Financial Insights & Multi-Currency
- **Goal**: Expand analytics and AI advisor capabilities for deeper financial wellness.
- **Key Deliverables**:
  - Predictive monthly spend forecasting based on run rate.
  - Custom budget limits per category with threshold push/toast alerts.
  - Export expenses to CSV, Excel, and PDF summaries.
