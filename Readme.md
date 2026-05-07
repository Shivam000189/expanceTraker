
# 💰 Expense Tracker

A full-stack web application to track, visualize, and manage your daily expenses. Built with React, Node.js, Express, and MongoDB.

🔗 **Live Demo:** [https://expance-traker.vercel.app/](https://expance-traker.vercel.app/)

---

## 📋 Features

- ✅ **User Authentication** - Secure signup/login with JWT tokens and password hashing
- 📊 **Dashboard** - Real-time expense overview with statistics and insights
- 📈 **Analytics** - Interactive charts and expense breakdowns by category
- ➕ **Add/Edit Expenses** - Easy-to-use modal for expense management
- 🎯 **Category Tracking** - Organize expenses by different categories
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Protected Routes** - Secure pages only accessible to authenticated users
- ⚡ **Real-time Updates** - Instant data synchronization across the app

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite (fast development server)
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud account)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/expance-tracker.git
cd expance-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expance-tracker
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expance-tracker

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend/ExpanceTraker
npm install
```

Create a `.env.local` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# or
node index.js
```
Backend runs on `http://localhost:5000`

### Start Frontend (in a new terminal)
```bash
cd frontend/ExpanceTraker
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📂 Project Structure

```
expance-tracker/
│
├── backend/                    # Node.js/Express API
│   ├── index.js               # Server entry point
│   ├── package.json
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/
│   │   ├── auth.js            # User model
│   │   └── expance.js         # Expense model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── expanceRoutes.js   # Expense endpoints
│   └── .env                   # Environment variables
│
├── frontend/ExpanceTraker/     # React/Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── CategoryBreakdown.jsx
│   │   │   ├── DonutChart.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   ├── ExpenseModal.jsx
│   │   │   ├── ExpenseStats.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Main.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TopSpendingDays.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── analytics.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── expense.jsx
│   │   │   ├── login.jsx
│   │   │   ├── setting.jsx
│   │   │   └── signup.jsx
│   │   ├── utils/
│   │   │   └── analytics.js   # Utility functions
│   │   ├── api.js             # API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses for the user
- `POST /api/expenses` - Add a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

---

## 🔐 Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Frontend routes protected with auth checks
- **Environment Variables** - Sensitive data stored in `.env` files

---

## 📝 Git Best Practices

Make sure to add these to `.gitignore` to avoid pushing sensitive files:

```
.env
.env.local
node_modules/
dist/
.DS_Store
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

---

**Happy Tracking! 💸**
