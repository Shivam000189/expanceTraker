# Project Requirements

## 1. Functional Requirements

### 1.1 Authentication & User Management
- [x] **User Registration**: New users can register with name, email, and password.
- [x] **Secure Login**: Authentication with bcrypt password comparison and JWT token creation.
- [x] **Session Persistence**: JWT token stored in browser `localStorage` and sent with requests.
- [x] **Protected Routes**: Unauthenticated users redirected to `/login` when accessing dashboard, analytics, expenses, settings, bank, payouts, or settlements.
- [x] **User Profile & Settings**: View and update monthly income and preferences.

### 1.2 Expense Management
- [x] **CRUD Operations**: Add, read, update, and delete expenses (title, amount, category, date).
- [x] **Smart SMS Parsing**: Parse raw SMS texts from banking alerts via regex fallback to AI LLM.
- [x] **Category Classification**: Automatic categorization into Food, Travel, Shopping, Bills, Entertainment, Health, or Other.
- [x] **Expense Listing & Filters**: Search, sort, and filter transactions by date, category, and amount.

### 1.3 Analytics & Visualization
- [x] **Dashboard Metrics**: Quick metrics displaying total monthly spend, average daily spend, and budget progress.
- [x] **Interactive Charts**: Donut charts for category breakdown and bar charts for daily/monthly trends.
- [x] **Top Spending Days**: Identify peak expenditure days in the current cycle.
- [x] **AI Financial Advisor**: Tailored recommendations and budget alerts based on user spending history.

### 1.4 Banking, Settlements & Payouts
- [x] **Simulated Bank Account**: View user balance, deposit/withdraw funds, view transaction history.
- [x] **Peer-to-Peer Transfers**: Transfer funds between registered users by selecting recipients.
- [x] **QR Code Generation**: Generate dynamic QR codes for receiving payments.
- [x] **Bulk Vendor Payouts**: Validate vendor rows (account number, IFSC code, amounts) and simulate batch processing.
- [x] **Settlement Lifecycle**: Track settlement statuses through `scanned` -> `processing` -> `cleared` -> `deposited`.

---

## 2. Non-Functional & Quality Requirements

### 2.1 Security & Reliability
- [ ] **Data Integrity for Transfers**: Multi-document ACID transactions for inter-user balance transfers.
- [ ] **Strict Secrets Hygiene**: Ensure environment files and production keys are strictly isolated.
- [x] **Security Headers**: Nosniff, Frame Options DENY, XSS protection configured.
- [ ] **Rate Limiting on Auth**: Brute force protection on `/auth/login` and `/auth/signup`.

### 2.2 Testing & Automation
- [ ] **Backend Test Suite**: Automated unit and integration tests for auth, expense, and bank endpoints.
- [ ] **Frontend Test Suite**: Component tests and calculation verification in `utils/analytics.js`.

### 2.3 Code Health & Usability
- [ ] **Naming Standardization**: Harmonize directory/file naming ("expance" -> "expense", route casing).
- [x] **Responsive UI**: Mobile and desktop responsiveness across all dashboard views.
- [x] **Theme Support**: Consistent dark mode with tailored visual hierarchy.
