const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    user: 'postgres',
    password: 'konkazazis',
    host: 'localhost',
    port: 5432,
    // database: 'JobReady-local',
    dialect: 'postgres',
})

