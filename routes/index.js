// src/routes/index.js
const express = require("express");
const router = express.Router();
const path = require("path");

// Serve static HTML file for home route
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;
