const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
  override: true,
  path: path.resolve(__dirname, ".env"),
});

const { createResumeTable } = require("./models/resumeModel");
const { createUserTable } = require("./models/userModel");

const { initializeDatabase } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://jobready-front-end.fly.dev"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/", indexRoutes, authRoutes);
app.use("/api", resumeRoutes);
app.use("/user", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Initialize Database Tables
initializeDatabase();
createResumeTable();
createUserTable();

module.exports = app;
