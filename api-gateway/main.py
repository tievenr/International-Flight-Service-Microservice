from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Optional, List
import json
from pydantic import BaseModel

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
USER_SERVICE_URL = "http://user_service:8000"
VISA_REQ_URL = "http://visa-req:3000"
FLIGHT_SEARCH_URL = "http://flight-search-service:3001"
BOOKING_SERVICE_URL = "http://booking-service:3002"

# Models
class VisaRequirement(BaseModel):
    country: str
    requires_visa: bool
    visa_type: Optional[str] = None
    processing_time: Optional[int] = None
    requirements: Optional[List[str]] = None

class FlightBooking(BaseModel):
    flight_id: str
    user_id: str
    visa_status: Optional[str] = None
    visa_application_id: Optional[str] = None

# Authentication middleware
async def verify_token(request: Request):
    # Temporarily bypass token verification for testing
    return {
        "userId": "test@example.com",
        "username": "testuser"
    }
    
    # Original token verification code (commented out)
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="No token provided")
    
    # Extract token from Bearer header
    try:
        token = auth_header.split("Bearer ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{USER_SERVICE_URL}/verify-token",
                json={"token": token}  # Send token in request body
            )
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            return response.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="User service unavailable")
    """

# User endpoints
@app.post("/register")
async def register_user(user_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/register", json=user_data)
        return response.json()

@app.post("/login")
async def login_user(credentials: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/login", json=credentials)
        return response.json()

# Flight endpoints
@app.get("/api/v1/flights/search")
async def search_flights(
    origin: str,
    destination: str,
    date: str,
    _: dict = Depends(verify_token)
):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{FLIGHT_SEARCH_URL}/api/v1/flights/search",
                params={
                    "origin": origin,
                    "destination": destination,
                    "date": date + "T00:00:00.000Z",  # Format date for MongoDB
                    "passengers": 1,
                    "cabinClass": "ECONOMY"
                }
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Flight search service error")
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Flight search service unavailable: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Invalid response from flight search service: {str(e)}")

@app.get("/api/v1/flights/visa-requirements/{country}")
async def get_visa_requirements(
    country: str,
    _: dict = Depends(verify_token)
):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{VISA_REQ_URL}/api/visa/requirements/{country}"
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Visa requirements not found")
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Visa service unavailable: {str(e)}")

@app.post("/flights/book")
async def book_flight(
    flight_data: dict,
    user: dict = Depends(verify_token)
):
    # Check visa requirements for destination
    async with httpx.AsyncClient() as client:
        # Get visa requirements
        visa_response = await client.get(
            f"{VISA_REQ_URL}/check-requirements",
            params={"country": flight_data["destination"]}
        )
        visa_info = visa_response.json()
        
        if visa_info["requires_visa"]:
            # Check user's visa status
            visa_status = await client.get(
                f"{VISA_REQ_URL}/my-applications/{user['userId']}"
            )
            visa_applications = visa_status.json()
            
            # Check for approved visa
            approved_visa = next(
                (v for v in visa_applications if v["status"] == "approved" and v["country"] == flight_data["destination"]),
                None
            )
            
            if not approved_visa:
                # Create a new visa application if needed
                visa_application = await client.post(
                    f"{VISA_REQ_URL}/apply",
                    json={
                        "userId": user["userId"],
                        "country": flight_data["destination"],
                        "name": user.get("name", ""),
                        "passport": flight_data.get("passport", ""),
                        "bankBalance": 10000,  # Default value, should be replaced with actual data
                        "criminalHistory": False  # Default value, should be replaced with actual data
                    }
                )
                
                if visa_application.json()["status"] == "rejected":
                    raise HTTPException(
                        status_code=400,
                        detail="Visa application rejected. Cannot proceed with booking."
                    )
                
                # Link visa application with booking
                flight_data["visa_application_id"] = visa_application.json()["id"]
                flight_data["visa_status"] = "pending"
            else:
                # Link existing visa with booking
                flight_data["visa_application_id"] = approved_visa["id"]
                flight_data["visa_status"] = "approved"
    
    # Proceed with flight booking
    async with httpx.AsyncClient() as client:
        booking_response = await client.post(
            f"{BOOKING_SERVICE_URL}/api/v1/bookings",
            json={**flight_data, "userId": user["userId"]}
        )
        return booking_response.json()

# Visa endpoints
@app.post("/visa/apply")
async def apply_visa(
    visa_data: dict,
    user: dict = Depends(verify_token)
):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{VISA_REQ_URL}/apply",
                json={**visa_data, "userId": user["userId"]}
            )
            response.raise_for_status()  # This will raise an exception for 4XX/5XX responses
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 400:
            return {"error": "Invalid visa application data", "details": e.response.json()}
        return {"error": f"Visa service error: {e.response.text}"}
    except Exception as e:
        return {"error": f"Failed to process visa application: {str(e)}"}

@app.get("/visa/status")
async def get_visa_status(user: dict = Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{VISA_REQ_URL}/my-applications/{user['userId']}"
        )
        return response.json()

@app.get("/bookings/{booking_id}/visa-status")
async def get_booking_visa_status(
    booking_id: str,
    user: dict = Depends(verify_token)
):
    async with httpx.AsyncClient() as client:
        # Get booking details
        booking_response = await client.get(
            f"{BOOKING_SERVICE_URL}/bookings/{booking_id}"
        )
        booking = booking_response.json()
        
        if booking["userId"] != user["userId"]:
            raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        
        if not booking.get("visa_application_id"):
            return {"message": "No visa required for this booking"}
        
        # Get visa status
        visa_response = await client.get(
            f"{VISA_REQ_URL}/applications/{booking['visa_application_id']}"
        )
        return visa_response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 