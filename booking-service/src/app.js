// src/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting middleware (simplified version)
const rateLimit = (req, res, next) => {
  // In production, use a proper rate limiter like express-rate-limit
  next();
};

// Apply rate limiting to all requests
app.use(rateLimit);

// Routes
app.use("/api/v1/bookings", bookingRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
  });
});

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/booking-service"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = app;
