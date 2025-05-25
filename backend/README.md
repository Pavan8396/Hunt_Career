# Job Aggregator Backend

## Overview

This backend provides API endpoints for user authentication, job listings, and user profiles for the Job Aggregator application. It handles data storage, business logic, and secure communication with the frontend application.

## Prerequisites

*   **Node.js and npm (or yarn):** Ensure you have a recent version of Node.js installed, which includes npm. Alternatively, you can use yarn.
*   **MongoDB:** A MongoDB instance needs to be running. You can use a local installation or a cloud-hosted service like MongoDB Atlas. The connection string will be configured via an environment variable.

## Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>/backend
    ```
    (If you've already cloned, navigate to the `backend` directory.)

2.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory. This file will store your environment-specific configurations.
    ```bash
    touch .env
    ```
    Add the following variables to your `.env` file, replacing the example values with your actual configuration:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/job-aggregator
    JWT_SECRET=yourSuperSecretAndLongEnoughJwtSecretKey
    CLIENT_URL=http://localhost:3000
    ```

    *   `PORT`: The port on which the backend server will run (default is 5000).
    *   `MONGO_URI`: The connection string for your MongoDB database.
        *   For a local MongoDB instance, it might look like: `mongodb://localhost:27017/your_db_name`
        *   For MongoDB Atlas, it will be provided by Atlas (e.g., `mongodb+srv://<username>:<password>@clustername.mongodb.net/your_db_name`).
    *   `JWT_SECRET`: A strong, unique secret key used for signing JSON Web Tokens (JWTs) for authentication. Make this a long, random string.
    *   `CLIENT_URL`: The URL of the frontend application, used for CORS configuration.

3.  **Install Dependencies:**
    Navigate to the `backend` directory in your terminal and run:
    ```bash
    npm install
    ```
    Or, if you are using yarn:
    ```bash
    yarn install
    ```

## Running the Application

To start the backend server, run the following command from the `backend` directory:

```bash
npm start
```

Or, if you are using yarn:

```bash
yarn start
```

This command typically uses `nodemon` for development, which will automatically restart the server when file changes are detected. The server will listen on the `PORT` specified in your `.env` file.

## Project Structure

The backend follows a modular structure to organize code effectively:

*   `config/`: Contains configuration files, primarily for database connections (`db.js`) and environment variable loading.
*   `controllers/`: Holds the request handler functions for various API routes. Controllers process incoming requests, interact with services, and send responses.
*   `middleware/`: Contains custom middleware functions used in the request-response cycle. Examples include authentication checks (`authMiddleware.js`), error handling, and database connection checks (`dbMiddleware.js`).
*   `models/`: Defines the Mongoose schemas for database collections (e.g., `User.js`, `Job.js`).
*   `routes/`: Contains the API route definitions. Each file typically groups routes for a specific resource (e.g., `authRoutes.js`, `jobRoutes.js`).
*   `services/`: Implements the business logic and interacts with the database models. Controllers delegate tasks to services.
*   `utils/`: Includes utility functions that can be reused across the application (e.g., token generation, password hashing).

## API Endpoints

The backend exposes the following main groups of API endpoints:

### Auth

*   **`POST /api/auth/register`**
    *   Registers a new user.
    *   **Request Body:** `{ "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "password123", "phoneNumber": "1234567890" }`
*   **`POST /api/auth/login`**
    *   Logs in an existing user.
    *   **Request Body:** `{ "email": "john.doe@example.com", "password": "password123" }`
    *   **Response:** `{ "token": "jwt_token", "user": { ...user_details } }`

### Jobs

*   **`GET /api/jobs`**
    *   Retrieves a list of jobs.
    *   **Query Parameters:**
        *   `search` (string): Search term to filter jobs by title, company, etc.
        *   `locations` (string): Semicolon-separated list of locations to filter by (e.g., "New York;Remote").
        *   `jobTypes` (string): Comma-separated list of job types to filter by (e.g., "Full-time,Part-time").
*   **`GET /api/jobs/:id`**
    *   Retrieves details for a specific job by its ID.

### User

*   **`GET /api/user`**
    *   Retrieves the profile of the currently authenticated user.
    *   **Protected:** Requires a valid JWT in the `Authorization` header (e.g., `Bearer <token>`).

---

This README provides a foundational guide for setting up and running the Job Aggregator backend. Refer to the source code and specific route/controller files for more detailed information on each endpoint and its functionality.
