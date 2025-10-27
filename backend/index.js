require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

const cors = require('cors');
app.use(cors());



app.use(bodyParser.json());
app.use('/auth', authRoutes);


const expanceRoutes = require('./routes/expanceRoutes');
app.use('/expenses', expanceRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});