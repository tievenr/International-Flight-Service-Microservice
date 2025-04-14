// src/controllers/bookingController.js
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const Booking = require("../models/booking");
const { generatePNR } = require("../utils/pnrGenerator");
const { sendBookingConfirmation } = require("../utils/emailService");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    // Check if flight exists and has availability (communicate with Flight Service)
    try {
      const flightServiceUrl =
        process.env.FLIGHT_SERVICE_URL || "http://flight-search-service:3001";
      const response = await axios.get(
        `${flightServiceUrl}/api/v1/flights/${flightId}`
      );

      // Check if flight has enough seats
      if (response.data.availableSeats < passengers.length) {
        return res
          .status(400)
          .json({ message: "Not enough seats available for this booking" });
      }
    } catch (error) {
      console.error("Error checking flight availability:", error.message);
      return res
        .status(404)
        .json({ message: "Flight not found or service unavailable" });
    }

    // Create booking with pending status
    const booking = new Booking({
      bookingId: uuidv4(),
      flightId,
      passengers,
      status: "PENDING",
      paymentDetails: {
        amount: req.body.amount || 0,
        currency: req.body.currency || "USD",
        status: "PENDING",
      },
      pnr: generatePNR(),
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

// Get booking details
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error retrieving booking:", error);
    res
      .status(500)
      .json({ message: "Error retrieving booking", error: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { passengers, status } = req.body;
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow updates if booking isn't cancelled
    if (booking.status === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Cannot update a cancelled booking" });
    }

    // Update allowed fields
    if (passengers) booking.passengers = passengers;
    if (status) booking.status = status;

    booking.updatedAt = Date.now();
    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update status to cancelled
    booking.status = "CANCELLED";
    booking.updatedAt = Date.now();

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};

// Process payment for booking
exports.processPayment = async (req, res) => {
  try {
    const { amount, currency, transactionId } = req.body;
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Cannot process payment for a cancelled booking" });
    }

    // In real-world, you would integrate with a payment gateway here
    // For demo purposes, we'll simulate a successful payment

    booking.paymentDetails = {
      amount,
      currency,
      status: "COMPLETED",
      transactionId: transactionId || `PAY-${Date.now()}`,
    };

    booking.status = "CONFIRMED";
    await booking.save();

    // Send confirmation email
    await sendBookingConfirmation(booking);

    res.json({
      message: "Payment processed successfully",
      booking,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
};

// Get PNR details
exports.getPNR = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      pnr: booking.pnr,
      status: booking.status,
      passengersCount: booking.passengers.length,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving PNR:", error);
    res
      .status(500)
      .json({ message: "Error retrieving PNR", error: error.message });
  }
};
