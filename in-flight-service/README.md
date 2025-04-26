# International Flight Service

A microservice-based system for international flight bookings with integrated visa requirements.

## API Overview

### Data Flow
1. **User Registration & Authentication**
   - User registers and gets authentication token
   - Token is required for all subsequent API calls

2. **Flight Search & Booking Flow**
   - Search for available flights
   - Get flight details and pricing
   - Create booking with passenger details
   - Get booking confirmation

3. **Visa Application Flow**
   - Check visa requirements for destination country
   - Verify if visa is required for passenger's nationality
   - Submit visa application with required documents
   - Track visa application status

### Typical User Journey
1. User registers and logs in
2. Searches for flights between desired locations
3. Selects a flight and creates booking
4. If visa is required:
   - Checks visa requirements
   - Submits visa application
   - Uploads required documents
   - Tracks application status
5. Receives booking confirmation

### Authentication
- All endpoints except registration and login require an Authorization header
- Format: `Authorization: Bearer {TOKEN}`
- Token is obtained from the login endpoint

### Error Handling
- All endpoints return appropriate HTTP status codes
- Error responses include a message explaining the issue
- Common status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
  - 500: Server Error

### Rate Limiting
- API calls are rate-limited to prevent abuse
- Default limit: 100 requests per minute per IP
- Rate limit headers are included in responses

## Services

1. **API Gateway** (Port: 8000)
   - Central entry point for all service requests
   - Handles authentication and request routing

2. **User Service** (Port: 8001)
   - User registration and authentication
   - Profile management

3. **Flight Search Service** (Port: 3001)
   - Flight search and availability
   - Flight details and pricing

4. **Booking Service** (Port: 3002)
   - Flight booking management
   - Booking status and updates

5. **Visa Requirements Service** (Port: 3000)
   - Visa requirements for different countries
   - Visa application status tracking

## API Endpoints with Examples

### User Service (Port: 8001)
- `POST /register` - Register new user
  ```bash
  curl -X POST http://localhost:8001/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
  ```

- `POST /login` - Authenticate user and get token
  ```bash
  curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
  ```

### Flight Search Service (Port: 3001)
- `GET /api/v1/flights/search` - Search available flights
  ```bash
  curl -X GET "http://localhost:3001/api/v1/flights/search?origin=DEL&destination=LHR&date=2025-05-15&passengers=1&cabinClass=ECONOMY"
  ```

- `GET /api/v1/flights/routes` - Get all available routes
  ```bash
  curl -X GET http://localhost:3001/api/v1/flights/routes
  ```

- `GET /api/v1/flights/{flightId}` - Get specific flight details
  ```bash
  curl -X GET http://localhost:3001/api/v1/flights/680b59aa1c98dd1977a6fd19
  ```

### Booking Service (Port: 3002)
- `POST /api/v1/bookings` - Create new booking
  ```bash
  curl -X POST http://localhost:3002/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "flightId": "680b59aa1c98dd1977a6fd19",
    "passengers": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "test@example.com",
        "phone": "+1234567890",
        "passportNumber": "AB123456",
        "nationality": "USA"
      }
    ]
  }'
  ```

- `GET /api/v1/bookings/{bookingId}` - Get booking details
  ```bash
  curl -X GET http://localhost:3002/api/v1/bookings/680b5d253e77e6746ce15cc6
  ```

- `PUT /api/v1/bookings/{bookingId}` - Update booking
  ```bash
  curl -X PUT http://localhost:3002/api/v1/bookings/680b5d253e77e6746ce15cc6 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled"
  }'
  ```

- `DELETE /api/v1/bookings/{bookingId}` - Cancel booking
  ```bash
  curl -X DELETE http://localhost:3002/api/v1/bookings/680b5d253e77e6746ce15cc6
  ```

### Visa Requirements Service (Port: 3000)
- `GET /api/visa/requirements/{country}` - Get visa requirements
  ```bash
  curl -X GET http://localhost:3000/api/visa/requirements/UK
  ```

- `GET /api/visa/check/{country}/{nationality}` - Check visa requirement
  ```bash
  curl -X GET http://localhost:3000/api/visa/check/UK/USA
  ```

- `POST /api/visa/apply` - Submit visa application
  ```bash
  curl -X POST http://localhost:3000/api/visa/apply \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "name": "John Doe",
    "nationality": "USA",
    "passport": {
      "number": "AB123456",
      "expiryDate": "2030-12-31",
      "issueCountry": "USA"
    },
    "country": "UK",
    "bankBalance": 10000,
    "criminalHistory": false
  }'
  ```

- `GET /api/visa/status/{applicationId}` - Check application status
  ```bash
  curl -X GET http://localhost:3000/api/visa/status/680b5d253e77e6746ce15cc6
  ```

- `POST /api/visa/documents/{applicationId}` - Upload documents
  ```bash
  curl -X POST http://localhost:3000/api/visa/documents/680b5d253e77e6746ce15cc6 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "bankStatement",
    "url": "https://example.com/bank-statement.pdf"
  }'
  ```

## Example Response Formats

### User Service Responses
```json
// Register Response
{
  "message": "User registered successfully"
}

// Login Response
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Flight Search Responses
```json
// Search Flights Response
{
  "outboundFlights": [
    {
      "_id": "680b59aa1c98dd1977a6fd19",
      "flightNumber": "AI101",
      "airline": "Air India",
      "departure": {
        "airport": "DEL",
        "city": "Delhi",
        "time": "2025-05-15T10:30:00.000Z"
      },
      "arrival": {
        "airport": "LHR",
        "city": "London",
        "time": "2025-05-15T16:00:00.000Z"
      },
      "price": {
        "amount": 45000,
        "currency": "INR"
      }
    }
  ],
  "returnFlights": [],
  "metadata": {
    "outboundCount": 1,
    "returnCount": 0
  }
}
```

### Booking Service Responses
```json
// Create Booking Response
{
  "_id": "680b5d253e77e6746ce15cc6",
  "flightId": "680b59aa1c98dd1977a6fd19",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "test@example.com",
      "phone": "+1234567890",
      "passportNumber": "AB123456",
      "nationality": "USA"
    }
  ],
  "status": "confirmed",
  "createdAt": "2025-04-25T10:00:05.671Z",
  "updatedAt": "2025-04-25T10:00:05.671Z"
}
```

### Visa Service Responses
```json
// Visa Requirements Response
{
  "country": "UK",
  "requiresVisa": true,
  "visaType": "Standard Visitor",
  "processingTime": 15,
  "requirements": [
    "Valid passport",
    "Bank statements",
    "Accommodation details",
    "Travel insurance",
    "Employment letter"
  ],
  "exemptNationalities": ["EU", "USA", "Canada", "Australia", "New Zealand"]
}

// Visa Check Response
{
  "requiresVisa": false,
  "visaType": null,
  "processingTime": null
}

// Visa Application Response
{
  "_id": "680b5d253e77e6746ce15cc6",
  "userId": "testuser",
  "name": "John Doe",
  "nationality": "USA",
  "passport": {
    "number": "AB123456",
    "expiryDate": "2030-12-31T00:00:00.000Z",
    "issueCountry": "USA"
  },
  "country": "UK",
  "bankBalance": 10000,
  "criminalHistory": false,
  "status": "pending",
  "documents": [],
  "createdAt": "2025-04-25T10:00:05.671Z",
  "updatedAt": "2025-04-25T10:00:05.671Z"
}
```

## Country Codes
The system uses IATA airport codes for countries and airports. Here are some common codes:

### Common Country Codes
- `USA` - United States
- `UK` - United Kingdom
- `IND` - India
- `CAN` - Canada
- `AUS` - Australia
- `DEU` - Germany
- `FRA` - France
- `ITA` - Italy
- `ESP` - Spain
- `JPN` - Japan

### Common Airport Codes
- `JFK` - New York (USA)
- `LHR` - London (UK)
- `DEL` - Delhi (India)
- `YYZ` - Toronto (Canada)
- `SYD` - Sydney (Australia)
- `FRA` - Frankfurt (Germany)
- `CDG` - Paris (France)
- `FCO` - Rome (Italy)
- `MAD` - Madrid (Spain)
- `NRT` - Tokyo (Japan)

You can find the complete list of IATA codes at:
- [IATA Country Codes](https://www.iata.org/en/publications/directories/code-search/)
- [IATA Airport Codes](https://www.iata.org/en/publications/directories/code-search/)

## Environment Variables

### API Gateway
- `USER_SERVICE_URL`: http://user_service:8000
- `VISA_REQ_URL`: http://visa-req:3000
- `FLIGHT_SEARCH_URL`: http://flight-search-service:3001
- `BOOKING_SERVICE_URL`: http://booking-service:3002

### User Service
- `MONGO_URI`: mongodb://admin:secret123@mongodb_user:27017/flight_booking?authSource=admin

### Visa Requirements Service
- `MONGODB_URI`: mongodb://admin:secret123@mongodb_visa:27017/visa-service?authSource=admin
- `PORT`: 3000

### Flight Search Service
- `MONGODB_URI`: mongodb://admin:secret123@mongodb_flight:27017/flight_service?authSource=admin
- `PORT`: 3001

### Booking Service
- `MONGODB_URI`: mongodb://admin:secret123@mongodb_flight:27017/flight_service?authSource=admin
- `REDIS_URL`: redis://redis:6379
- `PORT`: 3002

## Database Management

The system uses three MongoDB instances:
1. Flight Service DB (Port: 27017)
2. User Service DB (Port: 27018)
3. Visa Service DB (Port: 27019)

And one Redis instance for caching (Port: 6379)

## Useful Docker Commands

- Start all services: `docker compose up -d --build`
- Stop all services: `docker compose down`
- View logs: `docker compose logs [service_name]`
- Rebuild a specific service: `docker compose up -d --build [service_name]`
- Check service status: `docker compose ps`

## Cleanup and Shutdown

### Stop All Services
```bash
# Stop all running containers
docker compose down

# Stop and remove all containers, networks, and volumes
docker compose down -v

# Stop and remove all containers, networks, volumes, and images
docker compose down -v --rmi all
```

### Clean Up Docker Resources
```bash
# Remove all stopped containers
docker container prune

# Remove all unused volumes
docker volume prune

# Remove all unused networks
docker network prune

# Remove all unused images
docker image prune

# Remove all unused build cache
docker builder prune

# Remove all unused Docker resources (containers, networks, images, volumes)
docker system prune -a --volumes
```

### Reset MongoDB Data
```bash
# Connect to MongoDB container
docker exec -it mongodb_flight mongosh

# Switch to admin database
use admin

# Drop all databases
db.adminCommand({listDatabases: 1}).databases.forEach(function(d) {
  if (d.name !== 'admin' && d.name !== 'local') {
    db.getSiblingDB(d.name).dropDatabase();
  }
});
```

### Reset Redis Cache
```bash
# Connect to Redis container
docker exec -it redis redis-cli

# Clear all data
FLUSHALL
```

### Complete Cleanup Script
```bash
#!/bin/bash
# Stop all services and remove volumes
docker compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes -f

# Remove all Docker images
docker rmi $(docker images -q) -f

# Remove all Docker volumes
docker volume rm $(docker volume ls -q)

# Remove all Docker networks
docker network prune -f
```

Save this as `cleanup.sh` and run:
```bash
chmod +x cleanup.sh
./cleanup.sh
```

### Important Notes
1. The `-v` flag in `docker compose down` removes all volumes, which means:
   - All database data will be lost
   - All cached data will be cleared
   - All uploaded files will be deleted

2. `docker system prune -a` will:
   - Remove all unused containers
   - Remove all unused networks
   - Remove all unused images
   - Remove all unused volumes
   - Remove all build cache

3. Be careful with these commands in production as they will:
   - Delete all data
   - Remove all containers
   - Remove all images
   - Remove all volumes

4. To preserve data while stopping services:
   ```bash
   # Stop services without removing volumes
   docker compose down
   
   # Start services again
   docker compose up -d
   ```