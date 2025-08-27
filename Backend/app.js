// app.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/tasksRoutes'); 
const app = express();

// Middleware
app.use(express.json());

// ✅ CORS: open in dev, locked in prod
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? "https://your-frontend.com" 
    : true,
  credentials: true
}));

// for session
app.use(session({
  name: process.env.SESSION_NAME || 'sid',
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: Number(process.env.SESSION_TTL) || 24 * 60 * 60 * 1000
  }
}));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "❌Server error" });
});

// Export the app instance for testing
module.exports = app;