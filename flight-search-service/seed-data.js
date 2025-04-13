const mongoose = require("mongoose");
const Flight = require("./src/models/flight");
require("dotenv").config();

const testFlights = [
  {
    flightNumber: "AI101",
    airline: "Air India",
    departure: {
      airport: "DEL",
      city: "New Delhi",
      country: "India",
      time: new Date("2025-05-15T08:00:00Z"),
      terminal: "T3",
    },
    arrival: {
      airport: "LHR",
      city: "London",
      country: "UK",
      time: new Date("2025-05-15T12:30:00Z"),
      terminal: "T5",
    },
    price: {
      amount: 850,
      currency: "USD",
      fareClass: "ECONOMY",
    },
    availableSeats: 42,
    status: "SCHEDULED",
  },
  {
    flightNumber: "BA402",
    airline: "British Airways",
    departure: {
      airport: "LHR",
      city: "London",
      country: "UK",
      time: new Date("2025-05-20T14:30:00Z"),
      terminal: "T5",
    },
    arrival: {
      airport: "DEL",
      city: "New Delhi",
      country: "India",
      time: new Date("2025-05-21T02:45:00Z"),
      terminal: "T3",
    },
    price: {
      amount: 920,
      currency: "USD",
      fareClass: "ECONOMY",
    },
    availableSeats: 25,
    status: "SCHEDULED",
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/flight-search")
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing data
    await Flight.deleteMany({});

    // Insert test flights
    await Flight.insertMany(testFlights);

    console.log("Test data inserted successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
  });
