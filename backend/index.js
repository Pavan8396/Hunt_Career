const app = require('./app');
const { PORT } = require('./config/env');
const { connectToMongo } = require('./config/db');

const http = require('http');
const initSocket = require('./socket');

const startServer = async () => {
  await connectToMongo(); // Ensure DB connection before starting server
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown logic
  process.on('SIGTERM', () => {
    server.close(() => {
      // If you have a client.close() for mongo, call it here before exiting
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    server.close(() => {
      // If you have a client.close() for mongo, call it here before exiting
      process.exit(0);
    });
  });
};

startServer().catch(err => {
  process.exit(1);
});
