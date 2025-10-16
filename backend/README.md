# Hunt-Career Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Overview

This is the backend for Hunt-Career, a comprehensive job application platform. It is a robust RESTful API built with Node.js and Express, designed to handle all business logic, data storage, and user authentication. It provides a secure and scalable foundation for the frontend application to consume.

## Features

- **User & Employer Authentication:** Secure user and employer registration and login using JSON Web Tokens (JWT).
- **Job Management:** Full CRUD (Create, Read, Update, Delete) functionality for job postings.
- **Application Tracking:** Allows users to apply for jobs and employers to manage applications.
- **Candidate Shortlisting:** Enables employers to shortlist candidates for further review.
- **Real-time Communication:** Integrated with Socket.io for real-time chat between job seekers and employers.
- **Dashboard Analytics:** Provides employers with statistics on job applications and postings.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/<your-github-username>/hunt-career.git
    cd hunt-career/backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory:
    ```sh
    touch .env
    ```
    Add the following configuration to your `.env` file:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
    - `PORT`: The port for the server to run on (e.g., 5000).
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secret key for signing JWTs.

### Running the Application

- **Development Mode:**
  ```sh
  npm run dev
  ```
  This command starts the server with `nodemon`, which will automatically restart the server on file changes.

- **Production Mode:**
  ```sh

  npm start
  ```
  This command starts the server in a production-ready mode.

The server will be running at `http://localhost:5000`.

## Project Structure

The project follows a modular architecture to keep the codebase organized and maintainable.

```
backend/
├── config/           # Database and environment configurations
├── controllers/      # Request handlers (logic for routes)
├── middleware/       # Custom middleware (e.g., auth, error handling)
├── models/           # Mongoose schemas for MongoDB
├── routes/           # API route definitions
├── services/         # Business logic and database interactions
├── utils/            # Utility functions (e.g., JWT helpers)
├── app.js            # Express application setup
├── index.js          # Server entry point
└── socket.js         # Socket.io setup and event handling
```

## API Endpoints

The API is organized into the following sections:

### Authentication (`/api/auth`)

-   `POST /register`: Register a new user.
-   `POST /login`: Log in an existing user.

### Jobs (`/api/jobs`)

-   `GET /`: Retrieve a list of all available jobs.
-   `GET /:id`: Fetch a single job by its ID.
-   `POST /`: Create a new job posting (Employer only).
-   `DELETE /:id`: Remove a job posting (Employer only).
-   `GET /employer`: Fetch all jobs posted by the authenticated employer.
-   `GET /:id/application`: Retrieve the current user's application for a specific job.

### Users (`/api/users`)

-   `GET /`: Get the profile of the authenticated user.
-   `GET /:id`: Get a user's public profile by their ID.
-   `GET /applications`: Fetch all applications submitted by the authenticated user.
-   `GET /applied-jobs`: Get a list of all jobs the authenticated user has applied for.

### Employer (`/api/employer`)

-   `POST /register`: Register a new employer account.
-   `POST /login`: Log in an existing employer.
-   `GET /:id`: Get an employer's public profile by their ID.
-   `GET /applications`: Retrieve all applications for jobs posted by the authenticated employer.
-   `GET /stats/applications-over-time`: Get statistics on the number of applications received over time.
-   `GET /stats/job-postings-summary`: Fetch a summary of all job postings.
-   `GET /stats/recent-activity`: Retrieve a log of recent employer activities.

### Applications (`/api/applications`)

-   `POST /apply/:jobId`: Submit an application for a job.
-   `GET /job/:jobId`: Get all applications for a specific job (Employer only).
-   `POST /shortlist/:applicationId`: Shortlist a candidate for a job (Employer only).

### Chat (`/api/chat`)

-   `GET /notifications`: Retrieve all notifications for the authenticated user.
-   `GET /:applicationId`: Get the chat history for a specific application.
-   `DELETE /:applicationId`: Delete the chat history for a specific application.

## Deployment

To deploy this backend, you can use platforms like Heroku, AWS, or DigitalOcean. Here are some general steps:

1.  **Set Environment Variables:** Ensure all required environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) are set in your deployment environment.
2.  **Build Your Application:** If you have a build step, run it.
3.  **Start the Server:** Use `npm start` to run the application.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
