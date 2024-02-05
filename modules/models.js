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
    title VARCHAR(255),
    workExperience JSONB,
    education JSONB,
    languages JSONB,
    projects JSONB,
    skills JSONB,
    personalDetails JSONB
  );
`;

module.exports = {
  createUserTable,
  createResumeTable,
};

