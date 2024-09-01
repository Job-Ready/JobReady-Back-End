const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  const absolutePath = path.resolve(__dirname, "../public/index.html");
  res.sendFile(absolutePath);
});

router.get("/docs", (req, res) => {
  const absolutePath = path.resolve(__dirname, "../public/docs.html");
  res.sendFile(absolutePath);
});

module.exports = router;
