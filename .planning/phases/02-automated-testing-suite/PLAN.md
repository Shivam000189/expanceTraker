# Phase 2: Automated Testing Suite - Execution Plan

## Objective
Establish a comprehensive, repeatable automated testing harness across backend and frontend, covering API endpoints, SMS regex/normalization logic, and frontend analytics calculations.

---

## Scope & Tasks

### Task 1: Test Infrastructure Setup
- **Backend**:
  - Install `supertest` and `jest` in `backend/` devDependencies.
  - Update `backend/package.json` with `"test": "jest --runInBand --detectOpenHandles"`.
  - Refactor `backend/index.js` to export `app` (`module.exports = app`) and only call `app.listen()` when executed directly (`require.main === module`), allowing Supertest to test the Express app without port collisions.
- **Frontend**:
  - Install `vitest` in `frontend/ExpanceTraker/` devDependencies.
  - Add `"test": "vitest run"` script to `frontend/ExpanceTraker/package.json`.

### Task 2: Modularize SMS Detection Logic for Unit Testing
- **File**: Create `backend/utils/smsParser.js`
- **Action**:
  - Extract `normalizeDate`, `inferCategory`, `normalizeDetection`, and `extractJson` from `backend/routes/expanceRoutes.js` into `backend/utils/smsParser.js`.
  - Export functions cleanly.
  - Update `backend/routes/expanceRoutes.js` to import from `backend/utils/smsParser.js`.

### Task 3: Backend Unit & Integration Test Suites
- **SMS Parser Unit Tests**: Create `backend/tests/smsParser.test.js`
  - Test categorization for Swiggy/Zomato -> "Food", Uber/Ola -> "Travel", Amazon/Flipkart -> "Shopping", Electricity/Recharge -> "Bills".
  - Test INR/Rs./₹ currency symbol parsing and amount extraction from bank SMS strings.
  - Test fallback to "Other" category for unknown merchants.
- **API Integration Tests**: Create `backend/tests/api.test.js`
  - Test `GET /health` returns status 200 `{ status: "OK" }`.
  - Test `GET /` returns status 200 with API metadata.
  - Test `GET /verify-token` without auth header returns 401.
  - Test `POST /auth/register` without body returns 400.
  - Test `POST /auth/login` without body returns 400.
  - Test `POST /expenses` without token returns 401 with standardized error payload.
  - Test `POST /bank/balance` without token returns 401.

### Task 4: Frontend Analytics Unit Test Suite
- **File**: Create `frontend/ExpanceTraker/src/utils/analytics.test.js`
- **Action**:
  - Test `getCategory` returns correct styling/icon configuration and falls back to "Other".
  - Test `groupByCategory` correctly aggregates amounts and sorts descending by amount.
  - Test `groupByDay` correctly groups expenses by ISO day and limits to top 5.
  - Test empty array handling for edge cases.

---

## Verification & Validation Plan
1. **Run Backend Test Suite**:
   ```bash
   cd backend && npm test
   ```
   Verify 100% test pass rate across all test suites.
2. **Run Frontend Test Suite**:
   ```bash
   cd frontend/ExpanceTraker && npm test
   ```
   Verify 100% test pass rate for financial calculation functions.
