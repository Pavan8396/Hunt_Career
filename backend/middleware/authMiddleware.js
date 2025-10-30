const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  //console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  //console.log('Token:', token);

  if (!token) {
    console.error('Token not found');
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    //console.log('Token verified successfully. User:', user);
    req.user = user;
    next();
  });
};

const User = require('../models/userModel');
const Employer = require('../models/employerModel');

const isEmployer = (req, res, next) => {
  if (req.user.type !== 'employer') {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

const isJobSeeker = (req, res, next) => {
  if (req.user.type !== 'user') {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, isEmployer, isJobSeeker, isAdmin };
