// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expanceRoutes = require('./routes/expanceRoutes');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ✅ Allowed origins (local + production frontend)
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "https://expancetraker-5.onrender.com" // Render frontend
];

// ✅ CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ API Routes
app.use('/auth', authRoutes);
app.use('/expenses', expanceRoutes);

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Expense Tracker API is running...',
    version: '1.0.0',
    environment: NODE_ENV
  });
});

// ✅ Token verification endpoint
app.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false, message: "Invalid token format" });

  try {
    const SECRET_KEY = process.env.SECRET_KEY || process.env.JWT_SECRET;
    if (!SECRET_KEY) {
      return res.status(500).json({ valid: false, message: "Server configuration error" });
    }
    jwt.verify(token, SECRET_KEY);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});