const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const Employer = require('../models/employerModel');

const registerEmployer = async (req, res) => {
  const { companyName, email, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ message: "All fields are required: companyName, email, password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    console.log('Attempting to register employer with email:', email);
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      console.error('Employer registration failed: email already exists -', email);
      return res.status(400).json({ message: "Employer already exists" });
    }

    console.log('Hashing password for employer:', email);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new employer instance for:', email);
    const employer = new Employer({
      companyName,
      email,
      password: hashedPassword,
    });

    console.log('Saving new employer to database:', email);
    await employer.save();

    console.log('Employer registered successfully:', email);
    res.status(201).json({ message: "Employer registered successfully" });
  } catch (err) {
    console.error("Error during employer registration:", err);
    res.status(500).json({ message: "Failed to register employer" });
  }
};

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log('Attempting to log in employer with email:', email);
    const employer = await Employer.findOne({ email });
    if (employer) {
      console.log('Found employer:', email);
      const isMatch = await bcrypt.compare(password, employer.password);
      if (isMatch) {
        console.log('Password match for employer:', email);
        const token = jwt.sign({ email: employer.email, id: employer._id, type: 'employer' }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
          token,
          employer: { companyName: employer.companyName, email: employer.email }
        });
      } else {
        console.error('Password mismatch for employer:', email);
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.error('Employer not found:', email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during employer login:", err);
    res.status(500).json({ message: "Failed to login" });
  }
};

module.exports = { registerEmployer, loginEmployer };
