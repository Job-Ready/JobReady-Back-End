// src/config/db.js
const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : true,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log("Database connection initialized");
  } catch (err) {
    console.error("Error initializing database connection", err);
    throw err; // Re-throw the error after logging it
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
