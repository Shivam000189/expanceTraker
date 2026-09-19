# Phase 3: Architecture & Route Cleanup - Execution Plan

## Objective
Harmonize client-side routing, activate the full Settlements experience by replacing placeholder stubs, establish `/dashboard` as the canonical dashboard route with seamless redirection, eliminate unreferenced prototype components and pages, and clean up imports.

---

## Scope & Tasks

### Task 1: Streamline App Routing & Navigation
- **File**: `frontend/ExpanceTraker/src/App.jsx`
- **Action**:
  - Activate the full `<Settlements />` page for `/settlements`.
  - Remove reference to `<Selete />`.
  - Set `/dashboard` as the canonical dashboard route.
  - Configure `/expenses` to redirect to `/dashboard` via `<Navigate to="/dashboard" replace />`.
- **File**: `frontend/ExpanceTraker/src/components/layout/Navbar.jsx`
- **Action**:
  - Update `navItems` first entry from `path: '/expenses'` to `path: '/dashboard'`.

### Task 2: Remove Orphan & Deprecated Prototype Files
- **Pages to Remove**:
  - `frontend/ExpanceTraker/src/pages/selete.jsx` (temporary placeholder)
  - `frontend/ExpanceTraker/src/pages/expense.jsx` (legacy prototype view)
- **Components to Remove**:
  - `frontend/ExpanceTraker/src/components/Sidebar.jsx`
  - `frontend/ExpanceTraker/src/components/Navbar.jsx`
  - `frontend/ExpanceTraker/src/components/SmartSmsDetector.jsx`
  - `frontend/ExpanceTraker/src/components/ExpenseModal.jsx`
  - `frontend/ExpanceTraker/src/components/ExpenseStats.jsx`
  - `frontend/ExpanceTraker/src/components/StatCard.jsx`
  - `frontend/ExpanceTraker/src/components/ExpenseChart.jsx`
  - `frontend/ExpanceTraker/src/components/DonutChart.jsx`
  - `frontend/ExpanceTraker/src/components/CategoryBreakdown.jsx`
  - `frontend/ExpanceTraker/src/components/TopSpendingDays.jsx`

### Task 3: Clean up Unreferenced Layout Subcomponents
- Inspect `frontend/ExpanceTraker/src/components/layout/Sidebar.jsx` and ensure layout consistency across all views.

---

## Verification & Validation Plan
1. **Automated Unit & Integration Test Run**:
   - Execute backend tests: `cd backend && npm test` (verify 22/22 pass).
   - Execute frontend tests: `cd frontend/ExpanceTraker && npm test` (verify 8/8 pass).
2. **Static Lint / Compilation Check**:
   - Run `npx eslint .` in `frontend/ExpanceTraker` to confirm zero broken imports or missing symbols.
3. **Route Navigation Verification**:
   - Verify `/settlements` loads the full Settlements dashboard with fee breakdown and timeline.
   - Verify `/expenses` cleanly navigates to `/dashboard`.
   - Verify all authenticated routes render inside `<Layout>` with unified Spendora header.
