const { MongoClient } = require("mongodb");
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
let db;

const connectToMongo = async () => {
  console.log('Connecting to MongoDB with URI:', mongoUri);
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("hcdb");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const getDb = () => db;

module.exports = { connectToMongo, getDb };
