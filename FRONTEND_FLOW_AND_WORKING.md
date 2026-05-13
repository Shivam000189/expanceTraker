# Expense Tracker Frontend - Flow & Working Documentation

## Project Overview
A modern, responsive AI-powered expense tracking dashboard built with React and Vite. The application helps users track expenses, detect expenses from SMS messages, analyze spending patterns, and manage their personal finances efficiently.

---

## Tech Stack

### Core Technologies
- **React 18.3** - UI library for building interactive components
- **Vite 7.1** - Fast build tool and dev server
- **React Router DOM 7.9** - Client-side routing and navigation
- **Tailwind CSS 4.1** - Utility-first CSS framework with @tailwindcss/vite
- **Framer Motion 12.38** - Animation and motion library
- **Axios 1.14** - HTTP client for API calls
- **Recharts 3.8** - Composable React components for charts
- **Lucide React 0.556** - Modern SVG icon library
- **React Hot Toast 2.6** - Toast notifications
- **React Icons 5.5** - Additional icon set

### Development Tools
- **ESLint** - Code quality and linting
- **Vite Plugin React** - Fast Refresh for React development

---

## Application Architecture

### Project Structure
```
frontend/ExpanceTraker/
├── src/
│   ├── pages/              # Page components
│   │   ├── Main.jsx       # Landing page with hero section
│   │   ├── login.jsx      # User login page
│   │   ├── signup.jsx     # User registration page
│   │   ├── dashboard.jsx  # Main expense dashboard
│   │   ├── analytics.jsx  # Analytics and insights page
│   │   ├── setting.jsx    # User settings page
│   │   └── expense.jsx    # Expense management page
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout wrapper components
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── SMSDetector.jsx
│   │   │   └── StatCard.jsx
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── Navbar.jsx              # Top navigation
│   │   ├── SmartSmsDetector.jsx    # SMS parsing component
│   │   ├── ExpenseModal.jsx        # Modal for expense actions
│   │   ├── Toast.jsx               # Toast notification wrapper
│   │   ├── LoadingSpinner.jsx      # Loading state UI
│   │   ├── ExpenseChart.jsx        # Expense visualization
│   │   ├── DonutChart.jsx          # Donut/pie chart
│   │   ├── CategoryBreakdown.jsx   # Category analysis
│   │   ├── TopSpendingDays.jsx     # Daily spending insights
│   │   ├── ExpenseStats.jsx        # Statistical cards
│   │   ├── AnalyticsAdvisorCard.jsx # AI advisor insights
│   │   └── LandingChatbot.jsx      # Landing page chatbot
│   ├── lib/
│   │   └── utils.js        # Utility functions
│   ├── utils/
│   │   └── analytics.js    # Analytics calculation helpers
│   ├── api.js              # Axios API client with interceptors
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # React entry point
│   ├── App.css             # Global styles
│   ├── index.css           # Tailwind CSS imports
│   └── assets/             # Static assets
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── eslint.config.js        # ESLint configuration
└── package.json            # Dependencies and scripts
```

---

## Application Routes & Pages

### Public Routes (Unauthenticated Users)

#### 1. **Landing Page** (`/`)
- **File:** `src/pages/Main.jsx`
- **Purpose:** Marketing and onboarding page
- **Features:**
  - Hero section with call-to-action
  - Feature showcase cards (6 features with icons)
  - Display of total registered users
  - Navigation to Login/Signup
  - Landing chatbot for user guidance
  - Smooth Framer Motion animations
  - Responsive grid layout

#### 2. **Login Page** (`/login`)
- **File:** `src/pages/login.jsx`
- **Purpose:** User authentication
- **Features:**
  - Email and password input fields
  - Form validation
  - Error handling
  - Remember me option (optional)
  - Link to signup page
  - Toast notifications for feedback
  - Stores authentication token in localStorage

#### 3. **Signup Page** (`/signup`)
- **File:** `src/pages/signup.jsx`
- **Purpose:** New user registration
- **Features:**
  - Name, email, password fields
  - Form validation
  - Password confirmation
  - Terms and conditions acceptance
  - Link to login page
  - Error handling and validation feedback
  - Creates new user account

---

### Protected Routes (Authenticated Users Only)

#### 4. **Dashboard/Expense Page** (`/dashboard` or `/expenses`)
- **File:** `src/pages/dashboard.jsx`
- **Purpose:** Main expense tracking and management interface
- **Features:**
  - **Layout Wrapper:** Uses `Layout` component for consistent sidebar/navbar
  - **Statistics Cards:** Display summary metrics
    - Total expenses
    - Average spending
    - Spending trends
  - **Smart SMS Detector Card:** 
    - Textarea for pasting bank SMS
    - "Detect Expense" button
    - Loading states with spinner animation
    - Auto-fill expense form with detected data
    - Shows detection results (Amount, Merchant, Category, Date, Payment Method)
  - **Add Expense Form:**
    - Title/Description
    - Amount input
    - Category dropdown
    - Date picker
    - Payment method
    - Modal or inline form
    - Edit mode for existing expenses
  - **Recent Expenses Table:**
    - List of user's expenses
    - Sortable by date, amount, category
    - Edit and delete buttons
    - Category badges with colors
    - Pagination (if needed)
  - **Expense Summary Section:**
    - Total spent this month
    - Breakdown by category
    - Visual indicators

#### 5. **Analytics Page** (`/analytics`)
- **File:** `src/pages/analytics.jsx`
- **Purpose:** Detailed spending insights and analysis
- **Features:**
  - **Summary Statistics:**
    - Total spent (all time or selected period)
    - Average spending per transaction
    - Average spending per day/month
    - Total number of transactions
  - **Key Insights:**
    - Top spending category
    - Average category spending
    - Trend indicators (up/down)
  - **Charts & Visualizations:**
    - **Spending by Category:** Bar chart or pie chart showing distribution
    - **Top Spending Days:** Line chart showing daily spending trends
    - **Monthly Trend:** Comparison of spending over months
    - **Category Breakdown:** Detailed breakdown table
  - **Responsive Design:**
    - Charts adjust to mobile screen
    - Touch-friendly interactions
    - No horizontal scrolling

#### 6. **Settings Page** (`/setting`)
- **File:** `src/pages/setting.jsx`
- **Purpose:** User profile and preference management
- **Features:**
  - **Profile Section:**
    - Display name
    - Email display
    - Edit profile option
  - **Password Section:**
    - Change password form
    - Current password verification
    - New password with confirmation
  - **Preferences Section:**
    - Default currency selection
    - Language preference
    - Notification settings
  - **Privacy/Security Section:**
    - Data privacy policy link
    - Account deletion option (with confirmation)
    - Session management
  - **Theme/Display:**
    - Light/dark mode toggle (optional)
    - Sidebar layout preference

---

## Authentication Flow

### 1. User Registration
```
User visits "/" (Landing) 
  → Clicks "Start Your Journey" 
  → Navigates to "/signup"
  → Fills registration form (name, email, password)
  → Submits form 
  → API call: POST /auth/register
  → Server validates and creates account
  → User redirected to "/login"
```

### 2. User Login
```
User visits "/login"
  → Fills credentials (email, password)
  → Submits form
  → API call: POST /auth/login
  → Server validates and returns JWT token
  → Token stored in localStorage
  → User redirected to "/dashboard"
```

### 3. Protected Route Access
```
User accesses protected route (e.g., "/dashboard")
  → ProtectedRoute component checks:
     ✓ Token exists in localStorage?
     ✓ Token is valid?
  → If NO → Redirect to "/login"
  → If YES → Render requested page
```

### 4. Token Management
```
API Interceptor (in api.js):
  Request:
    → Checks localStorage for token
    → Adds "Authorization: Bearer {token}" header
  
  Response:
    → Checks for 401 (Unauthorized) status
    → If 401:
       ✓ Removes token from localStorage
       ✓ Redirects to "/login"
    → Otherwise returns response
```

### 5. Logout
```
User clicks logout
  → Token removed from localStorage
  → User redirected to "/login" or "/"
  → API calls now fail auth check (no token)
```

---

## Key Features & User Workflows

### Feature 1: Add Expense
**Workflow:**
1. User clicks "Add Expense" button on Dashboard
2. Expense form opens (modal or inline)
3. User fills in:
   - Title (e.g., "Groceries")
   - Amount
   - Category (dropdown: Food, Transport, Entertainment, etc.)
   - Date
   - Payment method
   - Optional notes
4. Form validation checks:
   - Amount is positive number
   - Title is not empty
   - Category is selected
5. Click "Add" button
6. API call: POST /expenses
7. On success:
   - Toast notification: "Expense added!"
   - Table refreshes with new expense
   - Form clears
8. On error:
   - Toast notification with error message
   - Form preserved for retry

### Feature 2: Smart SMS Expense Detection
**Workflow:**
1. User goes to Dashboard
2. Sees "Smart Expense Detection" card
3. Pastes bank SMS (e.g., "Rs 450 debited from SBI Bank for SWIGGY on 12 May")
4. Clicks "Detect Expense" button
5. Loading spinner shows while processing
6. AI backend analyzes SMS and extracts:
   - Amount: ₹450
   - Merchant: Swiggy
   - Category: Food (auto-mapped)
   - Date: 12 May (or current date if not mentioned)
   - Payment Method: SBI Bank
   - Type: Expense
7. Detection result displayed in card
8. If success → Expense form auto-fills with detected data
9. User can edit/review before saving
10. Click "Save" to add expense

**Example SMS & Detection:**
```
SMS Input: "Rs 220 paid to Zomato via UPI"

Detected Output:
{
  amount: 220,
  merchant: "Zomato",
  category: "Food",
  date: "2024-05-13",
  paymentMethod: "UPI"
}
```

### Feature 3: Edit Expense
**Workflow:**
1. User sees expense in table
2. Clicks "Edit" icon on expense row
3. Form opens with existing data pre-filled
4. User modifies fields
5. Clicks "Update" button
6. API call: PUT /expenses/{id}
7. On success:
   - Toast: "Expense updated!"
   - Table refreshes
   - Form closes
8. On error:
   - Toast error message
   - User can retry

### Feature 4: Delete Expense
**Workflow:**
1. User sees expense in table
2. Clicks "Delete" icon
3. Confirmation dialog appears
4. Click "Confirm Delete"
5. API call: DELETE /expenses/{id}
6. On success:
   - Toast: "Expense deleted!"
   - Expense removed from table
7. On error:
   - Toast error message

### Feature 5: View Analytics
**Workflow:**
1. User navigates to "/analytics"
2. Page loads and fetches all expenses
3. Analytics utils calculate:
   - Total spent
   - Average per transaction
   - Category breakdown
   - Top spending days
4. Charts render with data:
   - Category pie/bar chart
   - Spending trend line chart
   - Daily breakdown chart
5. User can:
   - Hover on chart points for details
   - Filter by date range (optional)
   - Export data (optional)

### Feature 6: Update Profile Settings
**Workflow:**
1. User navigates to "/setting"
2. Sees profile information (name, email)
3. Can update:
   - Name
   - Email
   - Password
   - Monthly income (for budget calculation)
   - Preferences
4. Changes saved via API
5. Toast confirmation

---

## Component Hierarchy

```
App (Root)
├── Router
│   └── Routes
│       ├── "/" → Main
│       │   └── Navbar + Landing Content
│       ├── "/signup" → Signup
│       ├── "/login" → Login
│       └── Protected Routes
│           ├── "/dashboard" → ProtectedRoute
│           │   └── Dashboard
│           │       └── Layout
│           │           ├── Navbar
│           │           ├── Sidebar
│           │           └── Main Content
│           │               ├── StatCard (multiple)
│           │               ├── SmartSmsDetector
│           │               ├── ExpenseForm
│           │               └── ExpenseTable
│           ├── "/analytics" → ProtectedRoute
│           │   └── Analytics
│           │       └── Layout
│           │           ├── ExpenseStats
│           │           ├── ExpenseChart
│           │           ├── DonutChart
│           │           ├── CategoryBreakdown
│           │           └── TopSpendingDays
│           └── "/setting" → ProtectedRoute
│               └── Setting
│                   └── Layout
│                       └── Settings Form
```

---

## State Management & Data Flow

### Local State (React useState)
- **Dashboard:**
  - `expenses` - Array of expense objects
  - `monthlyIncome` - User's monthly income
  - `loading` - Loading state during fetch
  - `isFormOpen` - Toggle expense form modal
  - `editingExpense` - Currently editing expense
  - `smsAutofillData` - Data from SMS detection

- **Forms:**
  - Form field values (title, amount, category, date, etc.)
  - Form validation errors
  - Loading state during submission

- **Auth Pages:**
  - Email/password inputs
  - Form validation state
  - Loading state during login/signup

### Local Storage (Persistent Client Storage)
- `token` - JWT authentication token
- `monthlyIncome` - User's monthly income
- `userName` - Current user's name
- `userEmail` - Current user's email

### API Data Flow
1. **Initial Load:**
   - User logs in → Token saved to localStorage
   - Navigate to dashboard
   - Component mounts → useEffect triggers
   - API calls fetch expenses & profile data
   - Data stored in React state
   - UI renders with loaded data

2. **Add Expense:**
   - User fills form
   - Click submit
   - API POST to /expenses
   - Success → Re-fetch expenses list
   - Update UI with new expense

3. **Edit Expense:**
   - User clicks edit
   - Form pre-fills with expense data
   - User modifies fields
   - Click update
   - API PUT to /expenses/{id}
   - Success → Re-fetch expenses
   - Update UI

---

## API Integration

### Axios Instance (api.js)
```javascript
// Base configuration
- baseURL: process.env.VITE_API_URL (e.g., http://localhost:5000/api)
- withCredentials: true (send cookies)

// Request Interceptor
- Attaches Authorization header with JWT token
- Format: "Bearer {token}"

// Response Interceptor
- Handles 401 errors (token expired/invalid)
- Clears token from localStorage
- Redirects to /login
```

### API Endpoints Used

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Fetch user profile
- `GET /auth/stats` - Fetch app statistics (total users)

**Expenses:**
- `GET /expenses` - Fetch all user expenses
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `POST /expenses/detect-sms` - AI SMS detection

---

## Design & Animations

### Color Palette
- **Primary Purple:** `#4B2C85` (Text, accents)
- **Primary Emerald:** `#059669` (Buttons, highlights)
- **Emerald Light:** `#ECFDF5` (Backgrounds)
- **White:** `#FFFFFF` (Card backgrounds)
- **Light Gray:** `#E5E7EB` (Borders)
- **Dark Gray:** `#4B5563` (Secondary text)

### Typography
- **Font Family:** Serif (main), system defaults (fallback)
- **Headings:** Bold, large (6xl-8xl for hero)
- **Body:** Regular weight, readable line height
- **Labels:** Small, uppercased, tracking-wider

### Components Styling
- **Cards:** Rounded corners (1.5rem-2rem), soft shadows, padding
- **Buttons:** Rounded (1.5rem), padding, hover transitions
- **Inputs:** Soft borders, smooth focus states
- **Icons:** Lucide React (20-24px typically)

### Animations (Framer Motion)
- **Page Transitions:** Fade in + slide up
- **Card Reveals:** Staggered animations
- **Button Hover:** Scale/color changes
- **Form Transitions:** Slide in/out animations
- **SMS Detection:** Result reveal with fade
- **Chart Animations:** Progressive rendering

---

## Responsive Design Strategy

### Breakpoints
- **Mobile:** < 640px (sm) - Stack layout, drawer menu
- **Tablet:** 640px - 1024px (md/lg) - Adjusted spacing
- **Desktop:** > 1024px (lg) - Full sidebar, grid layouts

### Mobile-First Approach
1. **Navigation:**
   - Desktop: Sidebar + Top navbar
   - Tablet/Mobile: Top navbar + Drawer menu

2. **Layout:**
   - Desktop: Multi-column grids
   - Mobile: Single column, full width

3. **Forms:**
   - Desktop: Inline or modal
   - Mobile: Full-screen modal or slide-up

4. **Charts:**
   - Desktop: Full size with interactions
   - Mobile: Adjusted height, touch-friendly

5. **Tables:**
   - Desktop: Full table with all columns
   - Mobile: Card-based list view or horizontal scroll

---

## Loading & Error States

### Loading States
- **Page Load:** Full-screen spinner (LoadingSpinner component)
- **Data Fetch:** Skeleton loaders or dimmed content
- **Form Submit:** Button disabled with loading spinner
- **SMS Detection:** Spinner in card with "Detecting..." text

### Error States
- **Network Error:** Toast notification with error message
- **Form Validation:** Inline field errors, red borders
- **Auth Error:** Redirect to login, toast notification
- **API Error:** Toast with error message from backend
- **Empty State:** Friendly message with icon, CTA button

### Success States
- **Action Complete:** Green toast notification with checkmark
- **Form Submit:** Toast + form reset or redirect
- **SMS Detection:** Result card revealed with animation

---

## Performance Optimizations

### Currently Implemented
- **Token-based auth:** Reduces session-side storage
- **Axios interceptors:** Centralized token management
- **React Router lazy loading:** (Can be implemented)
- **Local storage caching:** Avoid unnecessary API calls
- **Conditional rendering:** Only render when necessary

### Potential Improvements
- Code splitting with React.lazy()
- Image lazy loading
- Memoization of expensive components
- Virtual scrolling for long lists
- Debouncing form inputs
- Request cancellation for duplicate calls

---

## Current Limitations & Future Enhancements

### Current Limitations
1. SMS detection might not recognize all SMS formats
2. No date range filtering in analytics
3. No category customization
4. No budget limits/alerts
5. Single currency support
6. No data export functionality

### Planned Enhancements
1. **Advanced Filtering:**
   - Filter by date range
   - Filter by category
   - Search expenses

2. **Budgeting:**
   - Set budget limits per category
   - Alert when exceeding budget
   - Budget vs actual comparison

3. **Recurring Expenses:**
   - Mark expenses as recurring
   - Auto-add monthly/weekly expenses
   - Manage recurring items

4. **Insights & Recommendations:**
   - AI-powered spending recommendations
   - Savings opportunities
   - Spending patterns analysis

5. **Data Management:**
   - Export expenses to CSV/PDF
   - Import from bank statements
   - Data backup and restore

6. **Mobile App:**
   - React Native version
   - Offline support
   - Camera SMS capture

---

## Developer Guide

### Running the Application

**Development:**
```bash
npm install
npm run dev
```
Starts Vite dev server at http://localhost:5173

**Build:**
```bash
npm run build
```
Creates optimized production build in dist/

**Preview:**
```bash
npm run preview
```
Preview production build locally

**Linting:**
```bash
npm run lint
```
Check code quality with ESLint

### Environment Variables
Create `.env.local` in frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

### File Naming Conventions
- **Components:** PascalCase (e.g., `ExpenseForm.jsx`)
- **Pages:** lowercase (e.g., `dashboard.jsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.js`)
- **Styles:** Component.module.css or inline with Tailwind

### Git Workflow
```
main (production)
├── develop (staging)
│   └── feature branches (feature/add-expense-filter)
```

---

## Testing Strategy (Optional)

### Unit Tests
- Test utility functions (calculations, formatting)
- Test form validation logic
- Test date parsing from SMS

### Integration Tests
- Test API integration with mock server
- Test authentication flow
- Test expense CRUD operations

### E2E Tests
- Test complete user workflows
- Test responsive design
- Test error scenarios

---

## Security Considerations

1. **Token Storage:** Using localStorage (vulnerable to XSS)
   - Consider: HTTP-only cookies
   - Use Content Security Policy headers

2. **Sensitive Data:** Password fields have autocomplete disabled
   - Keep sensitive info out of localStorage

3. **API Security:**
   - HTTPS only in production
   - CORS properly configured
   - Input validation on backend

4. **SMS Detection:** Don't log raw SMS text
   - Process data securely
   - Validate extraction logic

---

## Troubleshooting

### Token Not Persisting
- Check localStorage in browser DevTools
- Verify token is set after login
- Check API response contains token

### API Calls Failing
- Check VITE_API_URL environment variable
- Verify backend is running
- Check network in DevTools
- Look for CORS errors

### SMS Detection Not Working
- Check SMS format matches backend regex
- Verify backend SMS parser is working
- Check network request/response in DevTools

### Animations Not Smooth
- Check browser GPU acceleration enabled
- Reduce animation complexity
- Profile performance with DevTools

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check code quality
npm run lint

# Navigate to dashboard
http://localhost:5173/dashboard

# View expenses
http://localhost:5173/expenses

# View analytics
http://localhost:5173/analytics

# Settings page
http://localhost:5173/setting
```

---

## Conclusion

The Expense Tracker frontend provides a modern, user-friendly interface for personal finance management. The modular component structure, protected routes, and API integration create a scalable foundation for future enhancements. Focus areas for improvement include advanced filtering, budgeting features, and AI-powered insights.
