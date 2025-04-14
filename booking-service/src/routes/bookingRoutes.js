// src/routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const {
  validateBookingRequest,
  validatePaymentRequest,
} = require("../middleware/validation");

const router = express.Router();

// Create booking
router.post("/", validateBookingRequest, bookingController.createBooking);

// Get booking details
router.get("/:id", bookingController.getBooking);

// Update booking
router.put("/:id", bookingController.updateBooking);

// Cancel booking
router.delete("/:id", bookingController.cancelBooking);

// Process payment
router.post(
  "/:id/payment",
  validatePaymentRequest,
  bookingController.processPayment
);

// Get PNR details
router.get("/:id/pnr", bookingController.getPNR);

module.exports = router;
