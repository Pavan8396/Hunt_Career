const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/env');
const { getDb } = require('../config/db');

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
    const db = getDb();
    const existingEmployer = await db.collection('employers').findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('employers').insertOne({
      companyName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Employer registered successfully", employerId: result.insertedId });
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
    const db = getDb();
    const employer = await db.collection('employers').findOne({ email });
    if (employer && await bcrypt.compare(password, employer.password)) {
      const token = jwt.sign({ email: employer.email, id: employer._id, type: 'employer' }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        employer: { companyName: employer.companyName, email: employer.email }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during employer login:", err);
    res.status(500).json({ message: "Failed to login" });
  }
};

module.exports = { registerEmployer, loginEmployer };
