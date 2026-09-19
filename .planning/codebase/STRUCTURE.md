# Repository Structure

## Root Layout

```
expance-tracker/
├── backend/                      # Express REST API backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection initialization (Mongoose 8)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token validation middleware (message + msg standardized)
│   ├── models/
│   │   ├── auth.js               # User model & advisor usage schema
│   │   ├── bank.js               # Bank balance model
│   │   ├── expance.js            # Expense transaction model
│   │   └── settlement.js         # Settlement tracking model
│   ├── routes/
│   │   ├── authRoutes.js         # /auth routes & AI advisor (rate-limited via express-rate-limit)
│   │   ├── bankRoutes.js         # /bank routes (dual-mode atomic balance transfers)
│   │   ├── expanceRoutes.js      # /expenses CRUD & SMS extraction
│   │   ├── payoutRoutes.js       # /payouts bulk vendor payouts validation
│   │   └── settlementRoutes.js   # /settlements transaction settlement lifecycle
│   ├── utils/
│   │   └── smsParser.js          # Extracted SMS parsing & category inference engine
│   ├── tests/
│   │   ├── smsParser.test.js     # 12 unit tests for SMS parser and category inference
│   │   └── api.test.js           # 10 integration tests for API routes and auth guards
│   ├── index.js                  # Main server entry point & exported app
│   ├── package.json              # Backend dependencies and test scripts (Jest + Supertest)
│   └── .env                      # Backend environment variables
│
├── frontend/ExpanceTraker/       # React SPA Frontend (Spendora)
│   ├── public/                   # Static assets (favicons, manifest)
│   ├── src/
│   │   ├── assets/               # Visual media and images
│   │   ├── components/           # Active UI component library
│   │   │   ├── layout/           # Shared layout components (Navbar, Layout, Sidebar)
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx    # Unified top navbar with AI forecast & navigation popover
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   ├── ExpenseTable.jsx
│   │   │   │   ├── SMSDetector.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── settlements/      # Settlements feature components
│   │   │   │   ├── FeeBreakdownCard.jsx
│   │   │   │   ├── ReceiptDownloadButton.jsx
│   │   │   │   └── SettlementTimeline.jsx
│   │   │   ├── payout/           # Bulk vendor payout components
│   │   │   │   ├── BulkPayoutStepper.jsx
│   │   │   │   ├── CSVUploader.jsx
│   │   │   │   ├── PayoutSuccessScreen.jsx
│   │   │   │   └── ReviewConfirmOverlay.jsx
│   │   │   ├── store/            # Store dashboard widgets
│   │   │   │   ├── EarningsToggle.jsx
│   │   │   │   ├── LatestTransactionAlert.jsx
│   │   │   │   └── UPIQRGenerator.jsx
│   │   │   ├── AnalyticsAdvisorCard.jsx # AI financial recommendations widget
│   │   │   ├── LandingChatbot.jsx       # Floating AI chatbot for landing page
│   │   │   ├── LoadingSpinner.jsx       # Reusable loading indicator
│   │   │   ├── ProtectedRoute.jsx       # React Router authentication guard
│   │   │   └── Toast.jsx                # Toast notification wrapper
│   │   ├── pages/                # Active application routes
│   │   │   ├── Main.jsx                 # Landing page
│   │   │   ├── signup.jsx               # User registration
│   │   │   ├── login.jsx                # User authentication
│   │   │   ├── dashboard.jsx            # Canonical dashboard (/dashboard)
│   │   │   ├── analytics.jsx            # Financial analytics & charts (/analytics)
│   │   │   ├── setting.jsx              # User preferences & budget settings (/setting)
│   │   │   ├── Bank.jsx                 # Banking portal & QR payments (/bank)
│   │   │   ├── settlements.jsx          # Full settlements tracking workspace (/settlements)
│   │   │   ├── bulk-payout.jsx          # Vendor batch payout interface (/bulk-payout)
│   │   │   └── store-dashboard.jsx      # Store transaction overview (/store-dashboard)
│   │   ├── utils/
│   │   │   ├── analytics.js             # Financial aggregation math helpers
│   │   │   └── analytics.test.js        # Vitest unit tests for financial math
│   │   ├── lib/
│   │   │   └── utils.js                 # Shared utility functions (classNames, currency formatter)
│   │   ├── api.js                       # Axios instance with auth interceptor
│   │   ├── App.jsx                      # Streamlined client router table
│   │   ├── main.jsx                     # Vite React DOM mount entry point
│   │   ├── index.css                    # Tailwind CSS v4 styling
│   │   └── App.css                      # Global style overrides
│   ├── vite.config.js                   # Vite bundler configuration
│   ├── eslint.config.js                 # ESLint rules configuration
│   ├── package.json                     # Frontend dependencies and test script (Vitest)
│   └── .env.local                       # Local frontend environment configs
│
├── FRONTEND_FLOW_AND_WORKING.md  # Detailed frontend feature documentation
├── Readme.md                     # Main repository documentation
└── .planning/                    # GSD planning and codebase intelligence directory
```
