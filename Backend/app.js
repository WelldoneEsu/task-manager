// app.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path"); 

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/tasksRoutes'); 
const app = express();
// Middleware
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const corsOptions = {
  origin:
  process.env.CORS_ORIGIN, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));



app.use(session({
  name: process.env.SESSION_NAME || "sid",
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: parseInt(process.env.SESSION_TTL) || 1000 * 60 * 60 * 24 // 1 day
  }
}));


app.use((req, res, next) => {
  console.log("Incoming request cookies:", req.headers.cookie);  // raw cookie header
  console.log("Session data:", req.session);
  next();
});

// For error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "❌Server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});


// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

/*app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running sucessfully'})
});*/

// A simple health check route to confirm the API is live
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Serve static files from the Frontend folder
app.use(express.static(path.join(__dirname, "../Frontend")));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});


// Export the app instance for testing
module.exports = app;