# International Flight Service Microservices

## Prerequisites
- Node.js installed
- Docker Desktop installed and running
- Git installed

## Setup Guide

1. **Clone and Setup**
```powershell
git clone https://github.com/tievenr/International-Flight-Service-Microservice.git
cd International-Flight-Service
```

2. **Start Services**
```powershell
# Start all containers
docker compose up -d --build

# Verify containers are running
docker ps
```

3. **Seed Test Data**
```powershell
# Seed flight data
cd flight-search-service
node seed-data.js

# Seed booking data
cd ../booking-service
node seed-data.js
```

## Testing the Services

### 1. Health Checks
```bash
# Flight Search Service
curl http://localhost:3001/health

# Booking Service
curl http://localhost:3002/health
```


### 2. Search for Available Flights
```bash
curl -X POST http://localhost:3001/api/v1/flights/search \
-H "Content-Type: application/json" \
-d '{
  "origin": "DEL",
  "destination": "LHR",
  "departureDate": "2025-05-15"
}'
```

### 3. Create a New Booking
```bash
curl -X POST http://localhost:3002/api/v1/bookings \
-H "Content-Type: application/json" \
-d '{
  "flightId": "YOUR_FLIGHT_ID",
  "passengers": [{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }],
  "amount": 850,
  "currency": "USD"
}'
```

### 4. Process Payment
```bash
curl -X POST http://localhost:3002/api/v1/bookings/YOUR_BOOKING_ID/payment \
-H "Content-Type: application/json" \
-d '{
  "amount": 850,
  "currency": "USD",
  "paymentMethod": "CARD"
}'
```

### 5. Check Booking Status
```bash
curl http://localhost:3002/api/v1/bookings/YOUR_BOOKING_ID
```

### 6. Cancel Booking
```bash
curl -X DELETE http://localhost:3002/api/v1/bookings/YOUR_BOOKING_ID
```

## Response Examples

### 1. Search Response
```json
{
  "outboundFlights": [{
    "_id": "67fd0f278b498af37c0c7d3d",
    "flightNumber": "AI101",
    "airline": "Air India",
    "departure": {
      "airport": "DEL",
      "time": "2025-05-15T08:00:00Z"
    }
  }]
}
```

### 2. Booking Creation Response
```json
{
  "message": "Booking created successfully",
  "booking": {
    "bookingId": "807f9071-96b2-451b-b4e4-dff8cacf5fd6",
    "status": "PENDING",
    "pnr": "2JIALF",
    "passengers": [...],
    "paymentDetails": {
      "amount": 850,
      "currency": "USD",
      "status": "PENDING"
    }
  }
}
```

### 3. Payment Response
```json
{
  "message": "Payment processed successfully",
  "status": "CONFIRMED",
  "pnr": "2JIALF"
}
```

### 4. Booking Status Response
```json
{
  "bookingId": "807f9071-96b2-451b-b4e4-dff8cacf5fd6",
  "status": "CONFIRMED",
  "pnr": "2JIALF",
  "flight": {
    "flightNumber": "AI101",
    "departure": "DEL",
    "arrival": "LHR"
  }
}
```

### 5. Cancellation Response
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "status": "CANCELLED",
    "refundAmount": 850
  }
}
```
