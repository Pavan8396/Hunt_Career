# Hunt-Career Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

## Overview

This is the frontend for Hunt-Career, a modern and intuitive job application platform. Built with React, it provides a seamless user experience for job seekers and employers. The application is designed to be fast, responsive, and easy to use, ensuring a smooth journey from job searching to hiring.

## Features

- **Interactive Job Search:** A dynamic and responsive interface for searching, filtering, and sorting job listings.
- **User-Friendly Authentication:** Simple and secure registration and login for both job seekers and employers.
- **Real-time Chat:** Enables instant communication between candidates and recruiters using Socket.io.
- **Informative Dashboards:** Visual representations of job application data and statistics for employers.
- **Saved Jobs & Application History:** Allows job seekers to save jobs for later and track their application status.
- **Responsive Design:** A mobile-first design that works beautifully on all devices.

## Getting Started

To get the frontend up and running on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/<your-github-username>/hunt-career.git
    cd hunt-career/frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `frontend` directory:
    ```sh
    touch .env
    ```
    Add the following environment variable to your `.env` file:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```
    - `REACT_APP_API_URL`: The base URL for the backend API.

### Running the Application

- **Development Mode:**
  ```sh
  npm start
  ```
  This will start the React development server, and the application will be available at `http://localhost:3000`.

## Project Structure

The project is structured to promote maintainability and scalability.

```
frontend/
├── public/           # Static assets (index.html, favicon)
├── src/
│   ├── components/   # Reusable UI components (Button, Card, etc.)
│   ├── pages/        # Page-level components (HomePage, LoginPage)
│   ├── context/      # React context for state management (AuthContext)
│   ├── services/     # API service calls to the backend
│   ├── utils/        # Utility functions and helpers
│   ├── App.js        # Main application component with routing
│   └── index.js      # Entry point of the React application
├── tailwind.config.js # Tailwind CSS configuration
└── package.json      # Project dependencies and scripts
```

## Deployment

The frontend can be deployed to various static site hosting services like Netlify, Vercel, or AWS S3.

1.  **Build the application:**
    ```sh
    npm run build
    ```
    This will create a `build` directory with the optimized, production-ready files.
2.  **Deploy the `build` directory:**
    Upload the contents of the `build` directory to your hosting provider.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
