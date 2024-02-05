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

const secretKey = 'your-secret-key';
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check credentials against the database
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (result.rows.length > 0) {

      res.json({ message: 'Login successful', token: secretKey});
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
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