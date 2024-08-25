const express = require("express");
const router = express.Router();
const path = require("path");

// Serve static HTML file for home route
router.get("/", (req, res) => {
  // __dirname gives the directory of the current file (index.js)
  const absolutePath = path.resolve(__dirname, "../public/index.html");
  res.sendFile(absolutePath);
});

module.exports = router;
