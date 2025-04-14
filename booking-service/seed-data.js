// booking-service/seed-data.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Booking = require("./src/models/booking");
const { generatePNR } = require("./src/utils/pnrGenerator");
require("dotenv").config();

const testBookings = [
  {
    bookingId: uuidv4(),
    flightId: "AI101", // Matching one from flight service seed data
    status: "CONFIRMED",
    passengers: [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        seatNumber: "12A",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        phone: "+1234567891",
        seatNumber: "12B",
      },
    ],
    paymentDetails: {
      amount: 850,
      currency: "USD",
      status: "COMPLETED",
      transactionId: `PAY-${Date.now()}`,
    },
    pnr: generatePNR(),
  },
  {
    bookingId: uuidv4(),
    flightId: "BA402", // Matching one from flight service seed data
    status: "PENDING",
    passengers: [
      {
        firstName: "Michael",
        lastName: "Smith",
        email: "michael.smith@example.com",
        phone: "+1234567892",
      },
    ],
    paymentDetails: {
      amount: 920,
      currency: "USD",
      status: "PENDING",
    },
    pnr: generatePNR(),
  },
];

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/booking-service"
  )
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing data
    await Booking.deleteMany({});

    // Insert test bookings
    await Booking.insertMany(testBookings);

    console.log("Test booking data inserted successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding booking data:", err);
    process.exit(1);
  });
