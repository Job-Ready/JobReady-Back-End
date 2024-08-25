const pool = require("../config/db"); // Importing the pool instance
const bcrypt = require("bcrypt");

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

const createUser = async ({ fullname, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (fullname, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, fullname, email, created_at;
  `;
  const values = [fullname, email, hashedPassword];
  const result = await pool.query(query, values); // Correct use of pool.query
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]); // Correct use of pool.query
  return result.rows[0];
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
};
