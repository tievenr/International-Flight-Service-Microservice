# International-Flight-Service-Microservice
# Setup Guide for Flight Service Repository

## Prerequisites
- Node.js installed
- Docker Desktop installed and running
- Git installed

## Step-by-Step Setup

1. **Clone the repository**
```powershell
git clone git@github.com:YourUsername/IntFlightService.git
cd IntFlightService
```

2. **Set up Flight Search Service**
```powershell
cd flight-search-service

# Create .env file from example
copy .env.example .env

# Install dependencies
npm install
```

3. **Start Docker containers**
```powershell
# Go back to root directory
cd ..

# Start MongoDB and Flight Search Service
docker compose up -d
```

4. **Seed the database**
```powershell
cd flight-search-service
node seed-data.js
```

5. **Verify setup**
```powershell
# Check if containers are running
docker ps

# Test the API
curl http://localhost:3001/health

# Test flight search
curl -X POST http://localhost:3001/api/v1/flights/search `
-H "Content-Type: application/json" `
-d '{\"origin\":\"DEL\",\"destination\":\"LHR\",\"departureDate\":\"2025-05-15\"}'
```

## Troubleshooting
- If MongoDB connection fails, ensure Docker is running
- If containers don't start, try:
```powershell
docker compose down
docker compose up -d
```

## Expected Output
- Health check should return: `{"status":"UP"}`
- Flight search should return test flights from the seed data