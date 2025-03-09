# Uber Microservices Project

## Overview

This project is a microservices-based implementation of a ride-hailing application similar to Uber. It consists of multiple services, each responsible for a specific domain of the application. The services communicate with each other using RabbitMQ for messaging and HTTP for direct communication.

## Microservices

The project is divided into the following microservices:

1. **User Service**: Manages user registration, login, and profile.
2. **Captain Service**: Manages captain registration, login, profile, and ride availability.
3. **Ride Service**: Manages ride creation and acceptance.
4. **Gateway Service**: Acts as an API gateway to route requests to the appropriate microservice.

## Tools and Technologies

- **Node.js**: JavaScript runtime for building the services.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user, captain, and ride data.
- **Mongoose**: ODM for MongoDB.
- **RabbitMQ**: Message broker for communication between services.
- **JWT**: JSON Web Tokens for authentication.
- **bcrypt**: Library for hashing passwords.
- **dotenv**: Module for loading environment variables.
- **cookie-parser**: Middleware for parsing cookies.
- **axios**: HTTP client for making requests between services.

## Reverse Proxy Implementation

The reverse proxy is implemented using the `express-http-proxy` library in the Gateway Service. The gateway routes incoming requests to the appropriate microservice based on the URL path.

### Gateway Service (`gateway/app.js`)

```javascript
// filepath: d:\projects\uber-microservices\gateway\app.js
import express from 'express';
import expressProxy from 'express-http-proxy';

const app = express();

app.use('/user', expressProxy('http://localhost:3001'));
app.use('/captain', expressProxy('http://localhost:3002'));
app.use('/ride', expressProxy('http://localhost:3003'));

app.listen(3000, () => {
    console.log("Gateway Server started on port 3000");
});
```

### How It Works

- Requests to `/user` are proxied to the User Service running on port 3001.
- Requests to `/captain` are proxied to the Captain Service running on port 3002.
- Requests to `/ride` are proxied to the Ride Service running on port 3003.

This setup allows the gateway to act as a single entry point for all client requests, simplifying the client-side logic and enabling centralized request handling.


## Request Flow

### User Registration and Login

1. **Register**: User sends a POST request to `/user/register` with name, email, and password.
2. **Login**: User sends a POST request to `/user/login` with email and password.
3. **Profile**: Authenticated user sends a GET request to `/user/profile` to retrieve their profile.

### Captain Registration and Login

1. **Register**: Captain sends a POST request to `/captain/register` with name, email, and password.
2. **Login**: Captain sends a POST request to `/captain/login` with email and password.
3. **Profile**: Authenticated captain sends a GET request to `/captain/profile` to retrieve their profile.
4. **Toggle Availability**: Authenticated captain sends a PATCH request to `/captain/toggle-availability` to change their availability status.

### Ride Management

1. **Create Ride**: Authenticated user sends a POST request to `/ride/create` with pickup and destination details.
2. **Accept Ride**: Authenticated captain sends a PUT request to `/ride/accept-ride` with the ride ID.



## Handling Heavy Payloads

The application is designed to handle heavy payloads and high traffic efficiently through the following techniques:

1. **Asynchronous Operations**: All database operations and external service calls are performed asynchronously to improve performance and prevent blocking.
2. **Event-Driven Architecture**: RabbitMQ is used for asynchronous communication between services, allowing the system to handle high volumes of messages without overloading any single service.
3. **Load Balancing**: The reverse proxy setup can be extended with load balancing to distribute incoming requests across multiple instances of each microservice.
4. **Scalability**: Each microservice can be scaled independently based on its load, ensuring that the system can handle increased traffic without performance degradation.
5. **Timeouts and Retries**: Implementing timeouts and retries for external service calls to handle transient failures and ensure reliability.

## Optimization Techniques

1. **Asynchronous Operations**: All database operations and external service calls are performed asynchronously to improve performance.
2. **Token Blacklisting**: Implemented token blacklisting to handle user and captain logout securely.
3. **Event-Driven Architecture**: Used RabbitMQ to decouple services and enable asynchronous communication.
4. **Environment Variables**: Used `dotenv` to manage configuration and secrets securely.
5. **Error Handling**: Implemented comprehensive error handling to ensure robustness.

## Directory Structure

```
uber-microservices/
├── captain/
│   ├── controllers/
│   ├── DB/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── service/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── user/
│   ├── controllers/
│   ├── DB/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── service/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── rides/
│   ├── controllers/
│   ├── DB/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── service/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── gateway/
│   ├── app.js
│   └── package.json
└── .gitignore
```

## Running the Project

1. **Install Dependencies**: Run `npm install` in each microservice directory (`captain`, `user`, `rides`, `gateway`).
2. **Environment Variables**: Create a `.env` file in each microservice directory with the necessary environment variables.
3. **Start Services**: Run `npm start` in each microservice directory to start the services.
4. **Access Gateway**: The API gateway will be running on `http://localhost:3000`.

## Environment Variables

Each microservice requires the following environment variables:

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT.
- `RABBIT_URL`: RabbitMQ connection string.
- `BASE_URL`: Base URL for inter-service communication (for `rides` service).

## Conclusion

This project demonstrates a microservices architecture for a ride-hailing application using modern tools and technologies. The services are designed to be scalable, maintainable, and secure, with a focus on asynchronous communication and robust error handling.