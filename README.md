# Hunt-Career: A Modern Job Application Platform

Hunt-Career is a full-stack web application designed to connect job seekers with employers. It provides a seamless experience for finding jobs, applying for them, and managing the application process.

## Features

### For Job Seekers:
- **Job Search:** Search for jobs with filters for keywords, locations, and job types.
- **User Authentication:** Secure registration and login for job seekers.
- **Apply for Jobs:** Easily apply for jobs with a single click.
- **Saved Jobs:** Save interesting jobs to review later.
- **Applied Jobs:** View a list of all the jobs you have applied for and their status.
- **Real-time Chat:** Communicate with employers in real-time.

### For Employers:
- **Employer Authentication:** Secure registration and login for employers.
- **Post a Job:** Create and publish new job postings.
- **View Posted Jobs:** Manage all the jobs you have posted.
- **View Applications:** See a list of all candidates who have applied for your jobs.
- **Shortlist Candidates:** Shortlist promising candidates for further review.
- **Shortlisted Candidates Page:** View all shortlisted candidates, grouped by job posting.
- **Real-time Chat:** Communicate with job seekers in real-time.
- **Enhanced Dashboard:** An informative dashboard with graphs showing applications over time and a summary of job postings by type.

## Technology Stack

### Frontend:
- **React:** A JavaScript library for building user interfaces.
- **React Router:** For declarative routing in the application.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Recharts:** A composable charting library built on React components.
- **Socket.io-client:** For real-time, bidirectional event-based communication.

### Backend:
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express:** A minimal and flexible Node.js web application framework.
- **MongoDB:** A NoSQL database for storing application data.
- **Mongoose:** An elegant mongodb object modeling for node.js.
- **Socket.io:** For real-time, bidirectional event-based communication.
- **JSON Web Tokens (JWT):** For secure authentication.

## Project Structure

The project is organized as a monorepo with two main directories:

-   `frontend/`: Contains the React frontend application.
-   `backend/`: Contains the Node.js/Express backend application.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

-   Node.js and npm
-   MongoDB

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```
2.  Install NPM packages for the backend
    ```sh
    cd backend
    npm install
    ```
3.  Install NPM packages for the frontend
    ```sh
    cd ../frontend
    npm install
    ```
4.  Create a `.env` file in the `backend` directory and add the following:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

You can run the frontend and backend servers concurrently from the root directory:

```sh
npm start
```

## API Endpoints

### Auth
-   `POST /api/auth/register`: Register a new job seeker.
-   `POST /api/auth/login`: Login a job seeker.

### Employer
-   `POST /api/employer/register`: Register a new employer.
-   `POST /api/employer/login`: Login an employer.
-   `GET /api/employer/applications`: Get all applications for the employer's jobs.
-   `GET /api/employer/shortlisted-candidates`: Get all shortlisted candidates for the employer's jobs, grouped by job.
-   `GET /api/employer/stats/applications-over-time`: Get statistics on applications over time.
-   `GET /api/employer/stats/job-postings-summary`: Get a summary of job postings by type.

### Jobs
-   `GET /api/jobs`: Get all jobs with optional filters.
-   `GET /api/jobs/:id`: Get a single job by ID.
-   `POST /api/jobs`: Create a new job (employer only).
-   `DELETE /api/jobs/:id`: Delete a job (employer only).
-   `GET /api/jobs/employer`: Get all jobs posted by the logged-in employer.

### Applications
-   `POST /api/applications/apply/:jobId`: Apply for a job.
-   `GET /api/applications/job/:jobId`: Get all applications for a specific job.
   -`POST /api/applications/shortlist/:applicationId`: Shortlist a candidate for a job.

### User
-   `GET /api/user`: Get details for the logged-in job seeker.
-   `GET /api/user/applications`: Get all applications for the logged-in job seeker.
-   `GET /api/user/applied-jobs`: Get all jobs the logged-in job seeker has applied for.

### Chat
-   `GET /api/chat/:roomId`: Get the chat history for a specific chat room.
