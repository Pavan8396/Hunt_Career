const express = require("express");
const cors = require("cors");

// Pre-load all Mongoose models
require('./models/userModel');
require('./models/employerModel');
require('./models/jobModel');
require('./models/applicationModel');
require('./models/chatModel');

const jwt = require("jsonwebtoken"); // Still needed for JWT operations if any are left, but authController handles its own
const bcrypt = require("bcryptjs"); // Still needed for bcrypt operations if any are left, but authController handles its own
// const { connectToMongo, getDb } = require('./config/db'); // connectToMongo removed, getDb used by middleware/controllers
// const { PORT, JWT_SECRET } = require('./config/env'); // PORT removed, JWT_SECRET used by authMiddleware
const { authenticateToken } = require('./middleware/authMiddleware'); // Needed for /api/user route if not applied in userRoutes directly
const { ensureDb } = require('./middleware/dbMiddleware'); // Needed for routes if not applied in specific route files directly
const { escapeRegex } = require('./utils/regexUtils'); // Used by jobController

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);
const employerRoutes = require('./routes/employerRoutes');
app.use('/api/employer', employerRoutes);
const applicationRoutes = require('./routes/applicationRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the Job Aggregator Backend!");
});

module.exports = app;