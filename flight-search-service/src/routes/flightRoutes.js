// src/routes/flightRoutes.js
const express = require("express");
const flightController = require("../controllers/flightController");

const router = express.Router();

// Search flights
router.post("/search", flightController.searchFlights);

// Get all available routes
router.get("/routes", flightController.getRoutes);

// Get flight by ID
router.get("/:id", flightController.getFlightById);

module.exports = router;
