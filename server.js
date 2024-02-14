const {
  createUserTable,
  createResumeTable,
} = require('./modules/models');

const path = require('path');
require('dotenv').config({ 
    override: true,
    path: path.resolve(__dirname, '.env') ,
});

// Path: server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const cors = require('cors');
const jwt = require('jsonwebtoken');
// Secret key used to sign the JWT token (keep it secret and don't hardcode it)
const SECRET_KEY = process.env.SECRET_KEY;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Comment for local development
  ssl: {
    require: false,
    rejectUnauthorized: false
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  // Read the content of index.html
  fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading index.html:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      // Send the HTML content as the response
      res.send(data);
  });
});

app.post('/signup', async (req, res) => {
  try {
    console.log('req.body:', req.body);
    const { fullname, email, password } = req.body;
    
    // Add any validation checks for the data here if needed

    const createUserQuery = `
      INSERT INTO users (fullname, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`;

    const result = await pool.query(createUserQuery, [fullname, email, password]);

    // Assuming you have a 'users' table in your database

    res.status(201).json({ user: result.rows[0], message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check credentials against the database
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    const user = result.rows[0];

    if (result.rows.length > 0) {
      //const token = generateToken(user);
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, Id: user.id });
    } else {
      res.status(401).json({ message: 'Invalid credentials'});
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/create-resume', async (req, res) => {
  try {
    console.log('req.body:', req.body);
    const { userId, details,
      workExperiences,
      projects,
      education,
      languages,
      skills } = req.body;
    
    // Add any validation checks for the data here if needed

    const createResumeQuery = `
      INSERT INTO resumes (userId, details, workExperiences, projects, education, languages, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`;

    const result = await pool.query(createResumeQuery, [userId, details, workExperiences, projects, education, languages, skills]);

    res.status(201).json({ resume: result.rows[0], message: 'Resume created successfully' });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-resume/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const getResumeQuery = `
      SELECT * FROM resumes
      WHERE userid = $1;`;

    const result = await pool.query(getResumeQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ resume: result.rows });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: error.message });
  }
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

pool.query(createUserTable)
  .then(() => pool.query(createResumeTable))
  .then(() => console.log('Tables created successfully'))
  .catch((err) => console.error('Error creating tables:', err))
  //.finally(() => pool.end());

startServer();