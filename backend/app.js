const express = require("express");
const cors = require("cors");

// Pre-load all Mongoose models
require('./models/userModel');
require('./models/employerModel');
require('./models/jobModel');
require('./models/applicationModel');
require('./models/chatModel');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Enable pre-flight for all routes
app.options('*', cors());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
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