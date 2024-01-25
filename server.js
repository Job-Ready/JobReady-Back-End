// server.js
const express = require('express');
const bodyParser = require('body-parser'); // For parsing JSON in request body
const app = express();
const port = 3001;
const cors = require('cors');

app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
  
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, this is your resume builder backend!');
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
