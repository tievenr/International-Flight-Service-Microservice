import requests
import json
import time

BASE_URL = "http://localhost:8000"

def wait_for_service():
    """Wait for the service to become available"""
    max_attempts = 10
    attempt = 0
    while attempt < max_attempts:
        try:
            response = requests.get(f"{BASE_URL}/docs")
            if response.status_code == 200:
                print("Service is up and running!")
                return True
        except requests.exceptions.ConnectionError:
            print(f"Waiting for service to start... (attempt {attempt + 1}/{max_attempts})")
            time.sleep(2)
            attempt += 1
    return False

def test_user_service():
    print("Starting user service tests...\n")

    if not wait_for_service():
        print("Error: Could not connect to the user service after multiple attempts")
        return

    # Test data
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }

    try:
        # Test registration
        print("1. Testing user registration...")
        response = requests.post(f"{BASE_URL}/register", json=test_user)
        print(f"Registration response: {response.json()}\n")

        # Test duplicate registration
        print("2. Testing duplicate registration...")
        response = requests.post(f"{BASE_URL}/register", json=test_user)
        print(f"Duplicate registration response: {response.json()}\n")

        # Test login with correct credentials
        print("3. Testing login with correct credentials...")
        response = requests.post(f"{BASE_URL}/login", json=test_user)
        print(f"Login response: {response.json()}\n")

        # Test login with incorrect password
        print("4. Testing login with incorrect password...")
        wrong_pass_user = test_user.copy()
        wrong_pass_user["password"] = "wrongpass"
        response = requests.post(f"{BASE_URL}/login", json=wrong_pass_user)
        print(f"Wrong password login response: {response.json()}\n")

        # Test login with non-existent email
        print("5. Testing login with non-existent email...")
        wrong_email_user = test_user.copy()
        wrong_email_user["email"] = "nonexistent@example.com"
        response = requests.post(f"{BASE_URL}/login", json=wrong_email_user)
        print(f"Non-existent email login response: {response.json()}\n")

        print("All tests completed! 🎉")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the user service. Make sure it's running!")
    except Exception as e:
        print(f"Error during testing: {str(e)}")

if __name__ == "__main__":
    test_user_service() 