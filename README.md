# International-Flight-Service-Microservice
# Setup Guide for Flight Service Repository

## Prerequisites
- Node.js installed
- Docker Desktop installed and running

## Step-by-Step Setup

1. **Clone the repository**
```powershell
git clone https://github.com/tievenr/International-Flight-Service-Microservice.git
cd International-Flight-Service-Microservice
```

2. **Set up Flight Search Service**
```powershell
cd flight-search-service

Create .env file from example


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

## Expected Output`
- Health check should return: ```{"status":"UP"}```
- Flight search should return test flights from the seed data
