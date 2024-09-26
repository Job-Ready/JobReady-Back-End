const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/create", userController.createUser);

// Update user email
router.post("/update-email", userController.updateEmail);

// Update user password
router.post("/update-password", userController.updatePassword);

// Update username
router.post("/update-username", userController.updateUsername);

// Delete a user
router.post("/delete", userController.deleteUser);

module.exports = router;
