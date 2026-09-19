# Phase 4: Advanced Financial Insights & Multi-Currency - Execution Plan

## Objective
Enhance financial wellness and analytics capabilities with predictive monthly run-rate forecasting, custom category budget tracking with visual threshold alerts, multi-format reporting (CSV alongside PDF), and global multi-currency formatting support.

---

## Scope & Tasks

### Task 1: Mathematical Foundations in `analytics.js`
- **File**: `frontend/ExpanceTraker/src/utils/analytics.js`
- **Action**:
  - Implement `calculateRunRateForecast(expenses, monthlyIncome, referenceDate)`:
    - Calculates month-to-date spending, days elapsed, total days in month, and projected month-end spend.
    - Determines risk level (`'on-track'`, `'near-budget'`, `'over-budget'`).
  - Implement `generateExpensesCsv(expenses)`:
    - Converts expense objects to clean CSV format with sanitized string escaping.
  - Implement `getBudgetThresholdStatus(spent, budgetLimit)`:
    - Returns status (`'safe'`, `'warning'`, `'exceeded'`) and percentage used.

### Task 2: Multi-Currency Formatter Support in `utils.js`
- **File**: `frontend/ExpanceTraker/src/lib/utils.js`
- **Action**:
  - Update `formatCurrency(amount, currencyOverride)`:
    - Checks currency preference from `localStorage.getItem('preferredCurrency')` or override (defaulting to `'INR'`).
    - Supports INR (`en-IN`), USD (`en-US`), EUR (`de-DE`), and GBP (`en-GB`).
  - Add `SUPPORTED_CURRENCIES` export (`[{ code: 'INR', symbol: '₹', label: 'INR (₹)' }, ...]`).

### Task 3: Interactive Budgeting & Forecast UI in `analytics.jsx`
- **File**: `frontend/ExpanceTraker/src/pages/analytics.jsx`
- **Action**:
  - Render **Predictive Run-Rate Forecast Card**:
    - Displays month-to-date spend, daily run rate, and projected month-end total.
    - Visual indicator showing budget risk level.
  - Render **Category Budget Tracker**:
    - Allows setting and updating budget targets per category stored in `localStorage`.
    - Real-time progress bars with dynamic status badges (Green = Safe, Amber = 80%+ Warning, Red = Exceeded).
  - Add **Multi-Format Export**:
    - Export button dropdown supporting both **Download PDF Report** and **Export to CSV**.
  - Add **Currency Selector**:
    - Currency toggle in header or settings to seamlessly switch between ₹, $, €, and £.

### Task 4: Automated Unit Tests for Financial Forecast & CSV
- **File**: `frontend/ExpanceTraker/src/utils/analytics.test.js`
- **Action**:
  - Add unit tests for `calculateRunRateForecast` verifying correct day calculations, month projections, and risk tiers.
  - Add unit tests for `generateExpensesCsv` verifying CSV headers, column formatting, and comma escaping.
  - Add unit tests for `getBudgetThresholdStatus`.

---

## Verification & Validation Plan
1. **Automated Unit Tests**:
   - Run `cd frontend/ExpanceTraker && npm test` to ensure all new financial helpers pass with 100% coverage.
   - Run `cd backend && npm test` to verify backend tests continue to pass.
2. **Interactive UI Validation**:
   - Verify changing category budget persists in `localStorage` and updates progress bars.
   - Verify CSV export downloads a valid `.csv` file.
   - Verify currency toggle changes rendered symbols across stats and charts.
