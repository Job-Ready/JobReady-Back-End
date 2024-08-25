const pool = require("./db");
const { createUserTable } = require("../models/userModel");
const { createResumeTable } = require("../models/resumeModel");

const initializeDatabase = async () => {
  try {
    await createUserTable();
    await createResumeTable();
    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
