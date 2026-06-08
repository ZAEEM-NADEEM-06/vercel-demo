require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middleware
app.use(cors());
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

// A simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is up and running" });
});

// Local development fallback (Vercel ignores app.listen, but you need it for localhost)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server Running locally on port ${PORT}`);
  });
}

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;