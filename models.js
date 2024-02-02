const { Sequelize, DataTypes } = require('sequelize');

// Define models
const User = sequelize.define('User', {
    // Define User model fields
    fullname: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
});

const Resume = sequelize.define('Resume', {
    // Define Resume model fields
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    title: DataTypes.STRING,
    summary: DataTypes.TEXT,
});

const Education = sequelize.define('Education', {
    // Define Education model fields
    resumeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'resumes',
            key: 'id',
        },
    },
    institution: DataTypes.STRING,
    degree: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
});

// Define associations between models
User.hasMany(Resume);
Resume.belongsTo(User);
Resume.hasMany(Education);
Education.belongsTo(Resume);