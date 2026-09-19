# Testing Setup & Strategy

## Automated Test Infrastructure

### Backend Testing (Jest + Supertest)
- **Framework**: Jest (`jest` v30+) with Supertest (`supertest` v7+)
- **Script**: `npm test` (`jest --runInBand --detectOpenHandles --forceExit`)
- **App Export**: `backend/index.js` exports Express `app` when imported into test modules while listening only when executed directly (`require.main === module`).
- **Test Suites**:
  - `backend/tests/smsParser.test.js`: 12 unit tests validating bank SMS regex extraction, merchant normalization, currency parsing, and fallback classification.
  - `backend/tests/api.test.js`: 10 integration tests validating `/health`, API root, `/verify-token`, `/auth/register` validation, `/auth/login` validation, and route token guards.
- **Total Backend Tests**: 22 tests (100% passing).

### Frontend Testing (Vitest)
- **Framework**: Vitest (`vitest` v5+)
- **Script**: `npm test` (`vitest run`)
- **Test Suites**:
  - `frontend/ExpanceTraker/src/utils/analytics.test.js`: 8 unit tests covering `getCategory`, `groupByCategory`, and `groupByDay` financial aggregation, descending sorting, top 5 slicing, and empty/invalid data fallbacks.
- **Total Frontend Tests**: 8 tests (100% passing).

---

## Running Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend/ExpanceTraker
npm test
```
