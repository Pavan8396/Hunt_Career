# Hunt-Career: A Modern Job Application Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

Hunt-Career is a full-stack web application designed to bridge the gap between job seekers and employers. It offers a seamless, real-time, and intuitive platform for discovering job opportunities, managing applications, and connecting with potential candidates.

## Features

### For Job Seekers
- **Advanced Job Search:** Filter jobs by keywords, location, and type.
- **One-Click Apply:** Streamline the application process.
- **Application Tracking:** Keep track of all submitted applications and their statuses.
- **Saved Jobs:** Bookmark jobs to apply for later.
- **Real-time Chat:** Communicate directly with employers.

### For Employers
- **Effortless Job Posting:** Create, manage, and publish job listings with ease.
- **Candidate Management:** View and organize all applications in one place.
- **Shortlisting:** Shortlist promising candidates for easy follow-up.
- **Analytics Dashboard:** Gain insights into application trends and job posting performance.
- **Real-time Chat:** Engage with potential hires instantly.

## Technology Stack

The application is built with a modern, robust technology stack to ensure scalability and performance.

- **Frontend:** React, React Router, Tailwind CSS, Socket.io-client, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.io

## Project Structure

This project is a monorepo containing the frontend and backend applications in separate directories.

-   `frontend/`: Contains the React frontend application. For more details, see the [frontend README](./frontend/README.md).
-   `backend/`: Contains the Node.js/Express backend API. For more details, see the [backend README](./backend/README.md).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your-username/hunt-career.git
    cd hunt-career
    ```

2.  **Install backend dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**
    - In the `backend` directory, create a `.env` file. See `backend/README.md` for required variables.
    - In the `frontend` directory, create a `.env` file. See `frontend/README.md` for required variables.

### Running the Application

You can run both the frontend and backend servers concurrently from the root directory:

```sh
npm start
```

This will start the backend server on `http://localhost:5000` and the frontend development server on `http://localhost:3000`.

## API Endpoints

The backend provides a comprehensive set of API endpoints for all application functionalities. For a detailed list of all endpoints, please refer to the [backend README](./backend/README.md).

## Deployment

Both the frontend and backend are designed to be deployed independently.

-   **Frontend:** Can be deployed to any static site hosting service like Netlify, Vercel, or AWS S3.
-   **Backend:** Can be deployed to platforms like Heroku, AWS, or DigitalOcean.

Refer to the individual `README.md` files in the `frontend` and `backend` directories for more detailed deployment instructions.

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See the `LICENSE` file for more information.