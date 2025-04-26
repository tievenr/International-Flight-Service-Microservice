from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models import User, Token
from pymongo import MongoClient
import os
import jwt
from datetime import datetime, timedelta


app = FastAPI()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:secret123@mongodb_user:27017/flight_booking?authSource=admin")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")  # In production, use a secure secret key
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 30

client = MongoClient(MONGO_URI)
db = client["flight_booking"]
user_collection = db["users"]

@app.post("/register")
def register_user(user: User):
    if user_collection.find_one({"email": user.email}):
        return {"message": "User already exists"}
    user_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(user: User):
    stored = user_collection.find_one({"email": user.email})
    if stored and stored["password"] == user.password:
        # Generate JWT token
        token_data = {
            "sub": user.email,
            "username": user.username,
            "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
        }
        token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return {
            "message": "Login successful",
            "token": token
        }
    return {"message": "Invalid credentials"}

@app.post("/verify-token")
def verify_token(token_data: Token):
    try:
        # Verify and decode the token
        payload = jwt.decode(token_data.token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        # Check if token is expired
        if datetime.utcnow().timestamp() > payload["exp"]:
            raise HTTPException(status_code=401, detail="Token expired")
        
        # Return user information
        return {
            "userId": payload["sub"],
            "username": payload["username"]
        }
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
