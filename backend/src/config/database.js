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