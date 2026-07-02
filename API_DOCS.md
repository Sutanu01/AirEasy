# Airline Backend API Specifications

This document defines the REST endpoints exposed by the API Gateway at `http://localhost:8000/api/v1`.

---

## Authentication and Authorization Model

Protected endpoints require a JSON Web Token (JWT) in the HTTP Authorization header:
```http
Authorization: Bearer <your_jwt_access_token>
```

Certain endpoints are restricted by role memberships (e.g., ADMIN, CUSTOMER, FLIGHT_COMPANY), which are statelessly verified from the token payload.

---

## 1. Authentication Services

### 1.1 User Registration
Registers a new user in the database. All new registrants are assigned the default role of CUSTOMER.

* **Endpoint**: `/auth/signup`
* **HTTP Method**: `POST`
* **Authentication**: None
* **Request Payload**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Successfully registered the user",
  "data": {
    "id": 15,
    "email": "customer@example.com"
  },
  "error": {}
}
```

### 1.2 User Login
Authenticates user credentials and returns a JWT access token containing the customer ID and user roles list.

* **Endpoint**: `/auth/login`
* **HTTP Method**: `POST`
* **Authentication**: None
* **Request Payload**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully logged in",
  "data": {
    "user": {
      "id": 15,
      "email": "customer@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": {}
}
```

---

## 2. Flight Management Services (Flights Proxy)

### 2.1 Retrieve Flights
Fetches a list of flights filtered by search parameters.

* **Endpoint**: `/flights`
* **HTTP Method**: `GET`
* **Authentication**: None
* **Query Parameters (Optional)**:
  * `trips`: Airport routes code filter (e.g., `DEL-BOM`)
  * `departureAirportId`: Numeric ID of the departure airport
  * `arrivalAirportId`: Numeric ID of the arrival airport
  * `departureDate`: Format `YYYY-MM-DD`
  * `travellers`: Number of seats requested
  * `price`: Max price filter (e.g., `1000-5000`)
  * `sort`: Sort parameters (e.g., `price_asc`, `departureTime_desc`)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully fetched all flights",
  "data": [
    {
      "id": 29,
      "flightNumber": "FL-12345",
      "airplaneId": 2,
      "departureTime": "2026-07-03T10:00:00.000Z",
      "arrivalTime": "2026-07-03T12:00:00.000Z",
      "price": 5000,
      "boardingGate": "A1",
      "availableSeats": 150
    }
  ],
  "error": {}
}
```

### 2.2 Create Flight
Creates a new flight record in the flights service.

* **Endpoint**: `/flights`
* **HTTP Method**: `POST`
* **Authentication**: Required (`ADMIN` or `FLIGHT_COMPANY` role)
* **Request Payload**:
```json
{
  "flightNumber": "FL-1010",
  "airplaneId": 2,
  "departureAirportId": 1,
  "arrivalAirportId": 2,
  "departureTime": "2026-07-04T15:00:00.000Z",
  "arrivalTime": "2026-07-04T18:00:00.000Z",
  "price": 7500,
  "boardingGate": "B3",
  "totalSeats": 200
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Successfully created the flight",
  "data": {
    "id": 30,
    "flightNumber": "FL-1010",
    "airplaneId": 2,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "price": 7500,
    "availableSeats": 200
  },
  "error": {}
}
```

### 2.3 Create City
Adds a new city record.

* **Endpoint**: `/cities`
* **HTTP Method**: `POST`
* **Authentication**: Required (`ADMIN` role)
* **Request Payload**:
```json
{
  "cityName": "Mumbai"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Successfully created the city",
  "data": {
    "id": 18,
    "cityName": "Mumbai"
  },
  "error": {}
}
```

### 2.4 Create Airport
Adds a new airport to a city.

* **Endpoint**: `/airports`
* **HTTP Method**: `POST`
* **Authentication**: Required (`ADMIN` role)
* **Request Payload**:
```json
{
  "airportCode": "BOM",
  "airportName": "Chhatrapati Shivaji Maharaj International Airport",
  "cityId": 18
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Successfully created the airport",
  "data": {
    "id": 17,
    "airportName": "Chhatrapati Shivaji Maharaj International Airport",
    "airportCode": "BOM",
    "cityId": 18
  },
  "error": {}
}
```

---

## 3. Booking & Payment Services (Booking Proxy)

### 3.1 Create Booking
Initiates a pending booking transaction. The API Gateway automatically extracts the user context from the incoming token and maps the `userId` in the proxy request header to guarantee data integrity.

* **Endpoint**: `/bookings`
* **HTTP Method**: `POST`
* **Authentication**: Required (`CUSTOMER` or `ADMIN` role)
* **Request Payload**:
```json
{
  "flightId": 30,
  "noOfSeats": 2,
  "seatIds": [10, 11]
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Successfully created the booking",
  "data": {
    "id": 5,
    "pnr": "50MVN6",
    "flightId": 30,
    "userId": 15,
    "status": "PENDING",
    "noOfSeats": 2,
    "totalCost": 15000
  },
  "error": {}
}
```

### 3.2 Confirm Booking Payment
Processes booking payment, updates booking status to BOOKED, and queues an event to trigger SMTP ticket dispatching.

* **Endpoint**: `/bookings/payments`
* **HTTP Method**: `POST`
* **Authentication**: Required (`CUSTOMER` or `ADMIN` role)
* **Headers**:
  * `x-idempotency-key`: String uuid (required to prevent duplicate payment processing)
* **Request Payload**:
```json
{
  "bookingId": 5
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Payment successfully processed, seats confirmed",
  "data": {
    "id": 5,
    "pnr": "50MVN6",
    "flightId": 30,
    "userId": 15,
    "status": "BOOKED",
    "noOfSeats": 2,
    "totalCost": 15000
  },
  "error": {}
}
```

### 3.3 Get Flight Seats Map
Retrieves seat availability details for a flight.

* **Endpoint**: `/bookings/flights/:flightId/seats`
* **HTTP Method**: `GET`
* **Authentication**: None
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully fetched flight seats status map",
  "data": [
    {
      "seatNumber": "1A",
      "isBooked": true
    },
    {
      "seatNumber": "1B",
      "isBooked": false
    }
  ],
  "error": {}
}
```
