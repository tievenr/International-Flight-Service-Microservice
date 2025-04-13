// src/controllers/flightController.js
const Flight = require("../models/flight");

// Search flights based on criteria
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      cabinClass = "ECONOMY",
    } = req.body;

    if (!origin || !destination || !departureDate) {
      return res
        .status(400)
        .json({ message: "Missing required search parameters" });
    }

    // Create date range for departure (beginning to end of the selected day)
    const startDate = new Date(departureDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(departureDate);
    endDate.setHours(23, 59, 59, 999);

    // Build search query
    const searchQuery = {
      "departure.airport": origin,
      "arrival.airport": destination,
      "departure.time": { $gte: startDate, $lte: endDate },
      availableSeats: { $gte: passengers },
      "price.fareClass": cabinClass,
    };

    const flights = await Flight.find(searchQuery).sort({
      "departure.time": 1,
    });

    // If return date is provided, also search for return flights
    let returnFlights = [];
    if (returnDate) {
      const returnStartDate = new Date(returnDate);
      returnStartDate.setHours(0, 0, 0, 0);

      const returnEndDate = new Date(returnDate);
      returnEndDate.setHours(23, 59, 59, 999);

      const returnSearchQuery = {
        "departure.airport": destination,
        "arrival.airport": origin,
        "departure.time": { $gte: returnStartDate, $lte: returnEndDate },
        availableSeats: { $gte: passengers },
        "price.fareClass": cabinClass,
      };

      returnFlights = await Flight.find(returnSearchQuery).sort({
        "departure.time": 1,
      });
    }

    res.json({
      outboundFlights: flights,
      returnFlights,
      metadata: {
        outboundCount: flights.length,
        returnCount: returnFlights.length,
      },
    });
  } catch (error) {
    console.error("Error searching flights:", error);
    res
      .status(500)
      .json({ message: "Error searching flights", error: error.message });
  }
};

// Get all available flight routes
exports.getRoutes = async (req, res) => {
  try {
    const { origin } = req.query;

    let aggregationPipeline = [];

    if (origin) {
      aggregationPipeline.push({ $match: { "departure.airport": origin } });
    }

    aggregationPipeline.push({
      $group: {
        _id: {
          origin: "$departure.airport",
          destination: "$arrival.airport",
        },
        airlines: { $addToSet: "$airline" },
        flightCount: { $sum: 1 },
      },
    });

    const routes = await Flight.aggregate(aggregationPipeline);

    const formattedRoutes = routes.map((route) => ({
      origin: route._id.origin,
      destination: route._id.destination,
      airlines: route.airlines,
      flightCount: route.flightCount,
    }));

    res.json(formattedRoutes);
  } catch (error) {
    console.error("Error getting routes:", error);
    res
      .status(500)
      .json({ message: "Error getting routes", error: error.message });
  }
};

// Get flight by ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.json(flight);
  } catch (error) {
    console.error("Error getting flight:", error);
    res
      .status(500)
      .json({ message: "Error getting flight", error: error.message });
  }
};
