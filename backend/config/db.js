const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/hcdb";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

const getDb = () => mongoose.connection;

module.exports = { connectToMongo, getDb };
