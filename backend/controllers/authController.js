const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const userService = require('../services/userService');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

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
    if (!insertedUser) {
        return res.status(500).json({ message: "Failed to register user due to database error" });
    }
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
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
      const token = jwt.sign({ _id: user._id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to login" });
  }
};

module.exports = { registerUser, loginUser };
