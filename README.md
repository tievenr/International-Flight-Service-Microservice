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

### 2. Search Flights
```bash
curl -X POST http://localhost:3001/api/v1/flights/search \
-H "Content-Type: application/json" \
-d '{
  "origin": "DEL",
  "destination": "LHR",
  "departureDate": "2025-05-15"
}'
```

### 3. Create Booking

#### Successful Booking
```bash
# Use the _id from flight search response
curl -X POST http://localhost:3002/api/v1/bookings \
-H "Content-Type: application/json" \
-d '{
  "flightId": "67fd0f278b498af37c0c7d3d",
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

#### Failed Booking Scenarios

1. **Invalid Flight ID**
```bash
curl -X POST http://localhost:3002/api/v1/bookings \
-H "Content-Type: application/json" \
-d '{
  "flightId": "invalid_id",
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

2. **Wrong Amount**
```bash
curl -X POST http://localhost:3002/api/v1/bookings \
-H "Content-Type: application/json" \
-d '{
  "flightId": "67fd0f278b498af37c0c7d3d",
  "passengers": [{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }],
  "amount": 100,
  "currency": "USD"
}'
```

## Expected Responses

### Successful Booking
```json
{
  "bookingId": "...",
  "status": "CONFIRMED",
  "pnr": "...",
  "flight": {
    "flightNumber": "AI101",
    "departure": "DEL",
    "arrival": "LHR"
  }
}
```

### Failed Booking
```json
{
  "message": "Flight not found or service unavailable"
}
```

## Troubleshooting

### Common Issues
1. **Services Not Starting**
```powershell
docker compose down
docker compose up -d --build
```

2. **Database Connection Issues**
- Check MongoDB logs: `docker logs intflightservice-mongodb-1`
- Verify connection strings in .env files

3. **Service Communication Issues**
- Check service URLs in .env files
- Verify network configuration in docker-compose.yaml
