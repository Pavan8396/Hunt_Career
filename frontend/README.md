# Job Aggregator Frontend

## Overview

This frontend provides the user interface for the Job Aggregator application. It allows users to search for jobs, register and log in to their accounts, view detailed job descriptions, and manage their profiles. It communicates with the backend API to fetch and display job data and handle user authentication.

## Prerequisites

*   **Node.js and npm (or yarn):** Ensure you have a recent version of Node.js installed, which includes npm. Alternatively, you can use yarn.

## Setup & Installation

1.  **Navigate to the Frontend Directory:**
    If you have cloned the main repository, navigate to the `frontend` directory:
    ```bash
    cd <repository_name>/frontend
    ```
    (If you've already cloned, just ensure you are in the `frontend` directory.)

2.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend` directory. This file is used to store environment-specific variables, primarily the backend API URL.
    ```bash
    touch .env
    ```
    Add the following variable to your `.env` file:

    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

    *   `REACT_APP_API_URL`: This variable specifies the base URL for the backend API. If your backend is running on a different port or domain, update this value accordingly. For example, if your backend is at `https://api.example.com`, use `REACT_APP_API_URL=https://api.example.com/api`.

3.  **Install Dependencies:**
    In the `frontend` directory, run:
    ```bash
    npm install
    ```
    Or, if you are using yarn:
    ```bash
    yarn install
    ```

## Running the Application

To start the frontend development server, run the following command from the `frontend` directory:

```bash
npm start
```

Or, if you are using yarn:

```bash
yarn start
```

This command starts the React development server (usually using Create React App scripts). The application will typically open automatically in your default web browser at `http://localhost:3000`. The server watches for file changes and automatically reloads the application.

## Project Structure

The frontend application is organized with the following directory structure:

*   `public/`: Contains static assets such as `index.html` (the main HTML page), favicons, and images.
*   `src/`: Contains the main source code for the React application.
    *   `components/`: Reusable UI components that are used across different parts of the application (e.g., buttons, navigation bars, job cards).
    *   `pages/`: Page-level components that represent different views or routes in the application (e.g., HomePage, LoginPage, SignupPage, JobDetailsPage).
    *   `services/`: Contains modules for making API calls to the backend. For example, `api.js` defines functions for fetching jobs, user authentication, etc.
    *   `context/`: Holds React Context API implementations for global state management. For instance, `AuthContext.js` manages user authentication state.
    *   `utils/`: Includes utility functions and helpers that can be reused throughout the application (e.g., date formatting, validation functions).
    *   `App.js`: The main application component, responsible for routing and overall layout.
    *   `index.js`: The entry point of the React application, which renders the `App` component into the DOM.

## Key Features

*   **User Authentication:** Secure user registration and login functionality.
*   **Job Search & Filtering:** Users can search for jobs based on keywords, locations, and job types.
*   **View Job Details:** Users can click on a job listing to view more detailed information about the position.
*   **Responsive Design:** The interface is designed to be usable across various devices and screen sizes.
*   **Toast Notifications:** User-friendly notifications for actions like login success/failure, registration, etc.

## Environment Variables

The following environment variables are used by the application (defined in the `.env` file):

*   **`REACT_APP_API_URL`**
    *   **Description:** Specifies the base URL for the backend API.
    *   **Example:** `REACT_APP_API_URL=http://localhost:5000/api`
    *   **Usage:** This is used by the API service modules (e.g., `src/services/api.js`) to make requests to the correct backend endpoints.

---

This README provides a guide for setting up and running the Job Aggregator frontend. Refer to the source code for more detailed insights into specific components and functionalities.
