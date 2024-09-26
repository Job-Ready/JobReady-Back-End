const { pool } = require("../config/db"); // Importing the pool instance
const bcrypt = require("bcrypt");

// Create the users table if it doesn't exist
const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
};

// Create a new user
const createUser = async ({ fullname, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (fullname, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, fullname, email, created_at;
  `;
  const values = [fullname, email, hashedPassword];
  const result = await pool.query(query, values); // Execute the query
  return result.rows[0]; // Return the inserted user
};

// Find a user by their email
const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]); // Execute the query
  return result.rows[0]; // Return the user found by email
};

// Update user's email
const updateUserEmail = async (id, newEmail) => {
  const query = `
    UPDATE users
    SET email = $1
    WHERE id = $2
    RETURNING id, fullname, email, created_at;
  `;
  const values = [newEmail, id];
  const result = await pool.query(query, values); // Execute the query
  return result.rows[0]; // Return the updated user
};

// Update user's password
const updateUserPassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING id, fullname, email, created_at;
  `;
  const values = [hashedPassword, id];
  const result = await pool.query(query, values); // Execute the query
  return result.rows[0]; // Return the updated user
};

// Update user's fullname (username)
const updateUserFullname = async (id, newFullname) => {
  console.log(id, newFullname);
  const query = `
    UPDATE users
    SET fullname = $1
    WHERE id = $2
    RETURNING id, fullname, email, created_at;
  `;
  const values = [newFullname, id];
  const result = await pool.query(query, values); // Execute the query
  console.log(result.rows[0]);
  return result.rows[0]; // Return the updated user
};

// Delete a user by id
const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [id]); // Execute the query
  return result.rows[0]; // Return the deleted user id
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
  updateUserEmail,
  updateUserPassword,
  updateUserFullname,
  deleteUser,
};
