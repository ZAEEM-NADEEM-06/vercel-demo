require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// 1. Updated CORS Configuration
app.use(cors({
  origin: [
    "https://zaeem-todo.vercel.app", // Your live frontend domain (removed trailing slash!)
    "http://localhost:5173",                     // Standard Vite local development port
    "http://localhost:3000"                      // Standard CRA local development port
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 2. Explicitly handle Preflight OPTIONS requests across all routes
app.options("*", cors());

app.use(express.json());

// Main Database Connection (Cached for Serverless performance)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Middleware to ensure DB is connected on every API request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api/todos", todoRoutes);

// Root landing route to clear up the "Cannot GET /" message
app.get("/", (req, res) => {
  res.send("Welcome to the Todo API! Use /api/todos to interact with data.");
});

// A simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is up and running" });
});

// Local development fallback (Vercel ignores app.listen)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server Running locally on port ${PORT}`);
  });
}

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;