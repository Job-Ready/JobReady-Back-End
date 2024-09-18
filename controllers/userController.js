const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

// Create a new user
exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await userModel.createUser({ fullname, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Update user email
exports.updateEmail = async (req, res) => {
  const { id, email } = req.body;

  try {
    const updatedUser = await userModel.updateUserEmail(id, email);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating email", error });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  try {
    const user = await userModel.findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const updatedUser = await userModel.updateUserPassword(id, newPassword);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

// Update username (fullname)
exports.updateUsername = async (req, res) => {
  const { id, username } = req.body;

  try {
    const updatedUser = await userModel.updateUserFullname(id, username);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating fullname", error });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedUser = await userModel.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
