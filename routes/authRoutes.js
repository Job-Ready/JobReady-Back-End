// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const authenticateToken = require("../middleware/auth");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await createUser({ fullname, email, password });

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: { id: user.id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: { id: user.id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
