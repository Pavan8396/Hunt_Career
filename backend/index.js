const app = require('./app');
const { PORT } = require('./config/env');
const { connectToMongo } = require('./config/db');

const startServer = async () => {
  await connectToMongo(); // Ensure DB connection before starting server
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown logic
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      // If you have a client.close() for mongo, call it here before exiting
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      // If you have a client.close() for mongo, call it here before exiting
      process.exit(0);
    });
  });
};

startServer();
