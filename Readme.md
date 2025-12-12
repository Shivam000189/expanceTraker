
APP - https://expance-traker.vercel.app/

Frontend:

React (Vite)

React Router

Tailwind CSS

Axios

Recharts

React Hot Toast

Backend:

Node.js

Express.js

MongoDB & Mongoose

JWT (jsonwebtoken)

bcryptjs







fintrackr/
│
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ExpenseModal.jsx
│   │   │   ├── ExpenseStats.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── dashboard.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── vite.config.js
│
├── server/                     # Backend
│   ├── index.js
│   ├── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   └── .env
│
└── README.md
