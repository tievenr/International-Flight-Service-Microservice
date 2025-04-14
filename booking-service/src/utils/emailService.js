// src/utils/emailService.js
const nodemailer = require("nodemailer");

// Configure test email transporter (replace with real SMTP in production)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "test@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
});

const sendBookingConfirmation = async (booking) => {
  try {
    // Get primary passenger info
    const passenger = booking.passengers[0];

    const mailOptions = {
      from: '"Flight Booking System" <bookings@flightbooking.com>',
      to: passenger.email,
      subject: `Booking Confirmation - PNR: ${booking.pnr}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${passenger.firstName} ${passenger.lastName},</p>
        <p>Your booking has been confirmed with the following details:</p>
        <ul>
          <li>PNR: <strong>${booking.pnr}</strong></li>
          <li>Booking ID: ${booking.bookingId}</li>
          <li>Status: ${booking.status}</li>
          <li>Passengers: ${booking.passengers.length}</li>
        </ul>
        <p>Thank you for your booking!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
};
