const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS for Atlas SRV resolution


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription_app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (!dbURI) {
      throw new Error("CRITICAL CONFIGURATION ERROR: MONGODB_URI is completely missing from the environmental .env module.");
    }

    // Initialize Mongoose connection layer parameters
    await mongoose.connect(dbURI);
    console.log("MongoDB Central Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Shuts down the engine immediately if the database is dead
  }
};

module.exports = connectDatabase;
