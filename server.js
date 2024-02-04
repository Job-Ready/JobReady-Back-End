const path = require('path');
require('dotenv').config({ 
    override: true,
    path: path.resolve(__dirname, 'development.env') ,
});

// Path: server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: false,
    rejectUnauthorized: false
  }
})

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello, this is your resume builder backend!');
});

const startServer = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    app.listen(PORT, function () {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to PostgreSQL database', err);
  }
};

startServer();

// const { Client } = require('pg');
// const client = new Client({
//   user: auth[0],
//   password: auth[1],
//   host: params.hostname,
//   port: params.port,
//   database: params.pathname.split('/')[1],
// });

//   client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL database');
//   })
//   .catch((err) => {
//     console.error('Error connecting to PostgreSQL database', err);
//   });

// Define User table
// const createUserTable = `
//   CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     fullname VARCHAR(255) UNIQUE,
//     password VARCHAR(255),
//     email VARCHAR(255) UNIQUE
//   );
// `;

// // Define Resume table
// const createResumeTable = `
//   CREATE TABLE IF NOT EXISTS resumes (
//     id SERIAL PRIMARY KEY,
//     userId INTEGER REFERENCES users(id),
//     title VARCHAR(255),
//     summary TEXT
//   );
// `;

// // Define Education table
// const createEducationTable = `
//   CREATE TABLE IF NOT EXISTS education (
//     id SERIAL PRIMARY KEY,
//     resumeId INTEGER REFERENCES resumes(id),
//     institution VARCHAR(255),
//     degree VARCHAR(255),
//     start_date DATE,
//     end_date DATE
//   );
// `;

// // Execute table creation queries
// client.query(createUserTable)
//   .then(() => client.query(createResumeTable))
//   .then(() => client.query(createEducationTable))
//   .then(() => console.log('Tables created successfully'))
//   .catch((err) => console.error('Error creating tables:', err))
//   .finally(() => client.end());

// // Export the client for use in other parts of your application
// module.exports = client;
