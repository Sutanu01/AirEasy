# Airline Reservation Microservices System

A professional-grade flight booking and transaction processing system built using a hardened microservices architecture. 

The system leverages an API Gateway for request routing and stateless security enforcement, uses RabbitMQ for asynchronous event-driven task processing, and integrates with the Resend API to handle transaction email dispatching.

---

## System Architecture

The following diagram illustrates the network boundary topology, proxy routing, and the asynchronous event pipeline:

```mermaid
graph TD
    Client[Client / External API User] -->|HTTP Requests| Gateway[API Gateway Port 8000]
    
    subgraph Private VPC Network Boundaries
        Gateway -->|HTTP + Context Headers| Flights[Flights Service Port 3000]
        Gateway -->|HTTP + Context Headers| Booking[Booking Service Port 4000]
        
        Booking -->|Queue Confirmations| Broker[RabbitMQ Broker]
        Broker -->|Consume Events| Notification[Notification Service Port 5000]
    end

    Notification -->|API Dispatch| Resend[Resend Email Provider]
    Resend -->|Deliver Ticket| Inbox[Customer Email Client]
```

---

## Architectural Coverage

The system implements clean microservices design patterns, focusing on security, network isolation, and loose coupling:

1. **Centralized Edge Proxy**: The API Gateway acts as the single entry point. It handles centralized JWT validation, evaluates user roles, and forwards requests to target services.
2. **Stateless Role-Based Access Control (RBAC)**: Supports roles including ADMIN, CUSTOMER, and FLIGHT_COMPANY. Role permissions are checked statelessly at the Gateway level using JWT claims.
3. **Network Boundary Hardening**: Microservices are configured using Docker internal exposure (`expose` rather than `ports`). This blocks external direct host access to port 3000 and port 4000, forcing all client requests through the Gateway.
4. **Gateway Context Injection**: The API Gateway intercepts requests, resolves user identities, and injects authenticated variables (`x-user-id` and `x-user-email`) into the forwarded HTTP headers. This prevents user ID spoofing attacks at the edge.
5. **Asynchronous Messaging**: Upon successful payment, the booking service pushes seat confirmations to RabbitMQ. The notification service processes queue events statelessly to decouple email dispatch latency from the booking transaction thread.
6. **Decoupled Templates**: Email layouts (HTML structure and CSS styles) are decoupled from the notification dispatch logic and organized inside a dedicated template module.

---

## Local Execution Guide

Follow these instructions to run the microservices stack on your local machine using Docker Compose.

### Prerequisites
* Docker Desktop installed and running.

### Execution Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd Airline-backend
   ```

2. **Configure Environment variables**:
   Create a `.env` file inside the `notification-service/` directory and populate your Resend credentials:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   SENDER_EMAIL=onboarding@resend.dev
   ```

3. **Build and Start Container Services**:
   From the repository root folder, run:
   ```bash
   docker-compose up --build -d
   ```
   This will build the Node.js/TypeScript stack, execute database migrations, seed standard database roles, start RabbitMQ, and launch the service containers internally.

4. **Health Check**:
   Confirm the stack is active by sending a request to the Gateway health endpoint:
   ```bash
   curl http://localhost:8000/api/v1/info
   ```

---

## Production Deployment Specifications

When deploying the microservices stack to staging or production environments, implement the following changes:

### 1. Zero-Trust VPC Network
* Keep microservice port exposures blocked from the public internet. 
* Run all microservices on private subnets. Only the API Gateway should be reachable via an external Application Load Balancer (ALB).
* Downstream services trust `x-user-id` and `x-user-email` headers, as they can only be injected by the gateway within the private network perimeter.

### 2. High-Performance Internal Communication (gRPC)
* For low-latency inter-service queries, transition internal communications from HTTP/REST to gRPC over HTTP/2. The flights service includes preconfigured protocol buffers (`src/protos/flights.proto`) and an active gRPC server class to handle fast binary serialization.

### 3. Managed Middleware
* Replace the local database container and local RabbitMQ broker with managed cloud alternatives (such as AWS RDS PostgreSQL and Amazon MQ or CloudAMQP) to ensure high availability and automatic backups.

---

## Appendix: Booking Ticket Template Example

Upon processing a successful flight booking payment, the notification service sends the following HTML-formatted transactional ticket summary to the user's inbox:

<img src="assets/booking-confirmation.png" alt="Booking Confirmation Email" width="450" />