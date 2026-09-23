/* eslint-disable no-console */
require("dotenv").config();
const app = require("./src/app.js");

const PORT = process.env.PORT || 5000;

// Placeholder function: Database connection will be called here
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Capstone MVP Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initiate system bootstrapper:", error.message);
    process.exit(1);
  }
};

startServer();
