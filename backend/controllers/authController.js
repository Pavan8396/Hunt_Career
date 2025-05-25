const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const userService = require('../services/userService');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required: firstName, lastName, email, password, phoneNumber" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Phone number must be a 10-digit number" });
  }

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;

    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      name,
    };

    const insertedUser = await userService.createUser(userData);
    if (!insertedUser) { // Check if user creation failed in the service
        return res.status(500).json({ message: "Failed to register user due to database error" });
    }

    // The missingFields check might still be relevant if the service doesn't guarantee all fields
    // For now, assuming createUser returns the full user or handles its own errors for missing fields post-insert.
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'name'];
    const missingFields = requiredFields.filter(field => !(field in insertedUser));
    if (missingFields.length > 0) {
      // This scenario might indicate a discrepancy between what createUser promises and what it delivers
      // or how it handles partial inserts if that were possible.
      console.warn("Inserted user is missing fields", missingFields);
      return res.status(500).json({ message: "Failed to store all user data completely", missingFields });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userService.findUserForLogin(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        user: { name: user.name || email.split('@')[0] }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Failed to login" });
  }
};

module.exports = { registerUser, loginUser };
