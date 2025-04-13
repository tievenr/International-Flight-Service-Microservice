// src/models/flight.js
const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: true,
    },
    departure: {
      airport: {
        type: String,
        required: true,
      },
      city: String,
      country: String,
      time: {
        type: Date,
        required: true,
      },
      terminal: String,
    },
    arrival: {
      airport: {
        type: String,
        required: true,
      },
      city: String,
      country: String,
      time: {
        type: Date,
        required: true,
      },
      terminal: String,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      fareClass: {
        type: String,
        enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
        default: "ECONOMY",
      },
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "DELAYED",
        "CANCELLED",
        "BOARDING",
        "IN_AIR",
        "LANDED",
      ],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  }
);

// Create index for common search queries
FlightSchema.index({
  "departure.airport": 1,
  "arrival.airport": 1,
  "departure.time": 1,
});

module.exports = mongoose.model("Flight", FlightSchema);
