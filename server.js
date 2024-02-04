const path = require('path');
require('dotenv').config({ 
    override: true,
    path: path.resolve(__dirname, 'development.env') ,
    ssl: {
        rejectUnauthorized: false, // Use this option only for development
    }
});

// Path: server.js
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// PostgreSQL URL
var connectionString = process.env.DATABASE_URL;
const { Client } = require('pg');

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // You may need to set this to true based on your PostgreSQL server configuration
  },
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });


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

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello, this is your resume builder backend!');
});

app.post('/create-resume', async (req, res) => {
    try {
        const { userId, title, summary, educations, experiences, skills } = req.body;

        // Create a new resume using Sequelize models
        const newResume = await Resume.create({ userId, title, summary });

        // Create education entries associated with the new resume
        await Education.bulkCreate(
            educations.map(education => ({ resumeId: newResume.id, ...education }))
        );

        // ... Similar logic for experiences and skills

        res.status(201).json({ message: 'Resume created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



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
