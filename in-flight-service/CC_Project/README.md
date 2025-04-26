# Flight Booking System Documentation

## Getting Started

### Starting the Services
```powershell
# Start all services in detached mode
docker compose up -d
```

### Health Checks
```powershell
# Check health of all services
curl -X GET http://localhost:8001/health
curl -X GET http://localhost:8002/health
curl -X GET http://localhost:8003/health
```

## API Endpoints Testing

### User Service (Port 8001)
```powershell
# Create a new user
curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}" http://localhost:8001/register

# Login
curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}" http://localhost:8001/login
```

### Flight Service (Port 8002)
```powershell
# Add a new flight
curl -X POST -H "Content-Type: application/json" -d "{\"flight_id\":\"FL101\",\"airline\":\"TestAir\",\"source\":\"NYC\",\"destination\":\"LAX\",\"departure_time\":\"2025-04-22T10:00:00\",\"arrival_time\":\"2025-04-22T13:00:00\",\"seats\":100}" http://localhost:8002/add-flight

# Get all flights
curl -X GET http://localhost:8002/flights
```

### Booking Service (Port 8003)
```powershell
# Create a booking
curl -X POST -H "Content-Type: application/json" -d "{\"user_email\":\"test@example.com\",\"flight_id\":\"FL101\",\"seats_booked\":2}" http://localhost:8003/book

# Get all bookings
curl -X GET http://localhost:8003/bookings
```

## Database Management
- MongoDB Express UI: http://localhost:8081
  - Username: admin
  - Password: secret123

## Useful Docker Commands
```powershell
# View running containers
docker compose ps

# View service logs
docker compose logs

# View specific service logs
docker compose logs service-name

# Restart a specific service
docker compose restart service-name

# Stop all services
docker compose down

# Rebuild and start services
docker compose up -d --build
```

## Service URLs
- User Service: http://localhost:8001
- Flight Service: http://localhost:8002
- Booking Service: http://localhost:8003
- MongoDB Express: http://localhost:8081
- MongoDB: mongodb://localhost:27017

# User Service

This service handles user authentication and management for the flight booking system.

## Features

- User registration
- User login
- Duplicate user prevention
- Secure password handling
- MongoDB integration

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login existing user

## Data Model

### User
```python
{
    "username": str,
    "email": str,
    "password": str
}
```

## Setup and Running

### Prerequisites
- Docker and Docker Compose
- Python 3.9+ (for local development)

### Using Docker (Recommended)

1. Build and start the services:
```bash
docker-compose up --build
```

2. The services will be available at:
- User Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017

### Local Development

1. Install dependencies:
```bash
cd user_service
pip install -r requirements.txt
```

2. Start the service:
```bash
uvicorn main:app --reload
```

3. Run tests:
```bash
python test.py
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string (default: mongodb://admin:secret123@mongodb:27017/flight_booking?authSource=admin)

## Testing

The service includes a comprehensive test suite that can be run using:
```bash
python test.py
```

### Test Results
✅ User Registration
- Successfully registers new users
- Prevents duplicate registrations

✅ Login Functionality
- Successfully authenticates with correct credentials
- Rejects incorrect passwords
- Rejects non-existent emails

✅ MongoDB Integration
- Database connection working
- Data persistence verified
- Authentication working

## API Documentation

Once the service is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc