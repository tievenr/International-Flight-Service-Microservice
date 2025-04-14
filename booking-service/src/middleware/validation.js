// src/middleware/validation.js
const validateBookingRequest = (req, res, next) => {
  const { flightId, passengers } = req.body;

  // Basic validation
  if (!flightId) {
    return res.status(400).json({ message: "Flight ID is required" });
  }

  if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one passenger is required" });
  }

  // Validate each passenger
  for (const passenger of passengers) {
    if (
      !passenger.firstName ||
      !passenger.lastName ||
      !passenger.email ||
      !passenger.phone
    ) {
      return res
        .status(400)
        .json({
          message:
            "Each passenger must have firstName, lastName, email and phone",
        });
    }
  }

  next();
};

const validatePaymentRequest = (req, res, next) => {
  const { amount, currency } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Valid payment amount is required" });
  }

  if (!currency) {
    return res.status(400).json({ message: "Currency is required" });
  }

  next();
};

module.exports = {
  validateBookingRequest,
  validatePaymentRequest,
};
