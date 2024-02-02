import { Resume, Education, Experience, Skill } from './models';


// Path: server.js
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Database connection
const sequelize = new Sequelize({
    user: 'postgres',
    password: 'konkazazis',
    host: 'localhost',
    port: 5432,
    // database: 'JobReady-local',
    dialect: 'postgres',
})

sequelize.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
