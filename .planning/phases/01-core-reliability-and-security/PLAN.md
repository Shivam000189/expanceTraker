# Phase 1: Core Reliability & Security - Execution Plan

## Objective
Harden backend security, resolve data integrity risks in banking transfers through atomic transactions and conditional updates, modernize MongoDB connection initialization for Mongoose 8, add brute-force rate limiting to auth endpoints, and standardize API response payloads.

---

## Scope & Tasks

### Task 1: Modernize Database Connection Configuration
- **File**: `backend/config/db.js`
- **Action**:
  - Remove deprecated Mongoose 8 options (`useNewUrlParser: true, useUnifiedTopology: true`).
  - Add graceful error logging and connection lifecycle hooks (`connected`, `error`, `disconnected`).
  - Ensure compatibility with both local MongoDB and MongoDB Atlas URIs.

### Task 2: Implement Atomic Bank Transfers & Transactions
- **File**: `backend/routes/bankRoutes.js`
- **Action**:
  - Replace two-step non-atomic debit/credit (`save()` on sender then `save()` on recipient) with an atomic pattern.
  - Check whether a replica set session is supported (`mongoose.startSession()`).
  - If replica set is active (such as on MongoDB Atlas), execute within `session.withTransaction(...)` ensuring all-or-nothing atomicity.
  - For standalone environments without replica set support, use an atomic conditional decrement (`findOneAndUpdate` with `{ balance: { $gte: amount } }`) and compensate if credit fails.
  - Return updated sender balance in response for instant UI synchronization.

### Task 3: Implement Auth Rate Limiting
- **Files**:
  - `backend/package.json` (install `express-rate-limit`)
  - `backend/routes/authRoutes.js` or `backend/index.js`
- **Action**:
  - Add strict rate limiting on `/auth/login` and `/auth/signup` (e.g. max 10 attempts per 15-minute window per IP).
  - Add standard rate limiting headers (`RateLimit-*`) and clear error messages: `"Too many login attempts. Please try again in 15 minutes."`

### Task 4: Standardize API Response Payloads & Error Handling
- **Files**:
  - `backend/middleware/authMiddleware.js`
  - `backend/routes/authRoutes.js`
  - `backend/index.js`
- **Action**:
  - Standardize error responses to include `{ message: "...", msg: "..." }` to maintain 100% backward compatibility while aligning with frontend `error.response?.data?.message` consumption.
  - Ensure all 401, 403, and 500 error responses provide consistent structure.

---

## Verification & Testing Plan
1. **Database Connection Test**:
   - Run backend server and verify clean startup with zero deprecation warnings.
2. **Bank Transfer Concurrency & Validation Test**:
   - Verify negative or zero amounts are rejected by Zod validation.
   - Verify transfer to self is blocked (`400 Bad Request`).
   - Verify transfer with balance < amount is blocked (`400 Insufficient balance`).
   - Verify successful transfer debits sender and credits recipient accurately.
3. **Rate Limiter Test**:
   - Trigger consecutive requests to `/auth/login` and verify HTTP 429 response after limit is reached.
4. **Auth Error Payload Test**:
   - Send request with invalid token to protected route and verify `{ message: "..." }` is returned.
