const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE
  );
`;

// Define Resume table
const createResumeTable = `
  CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id),
    fullname VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    repos VARCHAR(255),
    portfolio VARCHAR(255),
    country VARCHAR(255),
    linkedin VARCHAR(255),
    workExperiences JSONB[],
    education JSONB[],
    languages JSONB[],
    projects JSONB[],
    skills JSONB[],
    last_change TIMESTAMP
  );
`;

module.exports = {
  createUserTable,
  createResumeTable,
};

