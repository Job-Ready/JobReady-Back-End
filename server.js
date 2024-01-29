// server.js
const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser'); // For parsing JSON in request body
const app = express();
const port = 3001;
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const sequelize = new Sequelize({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'JobReady-local',
    dialect: 'postgres',
  })

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, this is your resume builder backend!');
});

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Example route to save a resume
app.post('/saveResume', (req, res) => {
  const resumeData = req.body;
  // Save resume data to the database or perform other actions
  // Replace this with your actual database logic

  res.json({ message: 'Resume saved successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
