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
// pool.query(createUserTable)
//   .then(() => pool.query(createResumeTable))
//   .then(() => pool.query(createEducationTable))
//   .then(() => console.log('Tables created successfully'))
//   .catch((err) => console.error('Error creating tables:', err))
//   .finally(() => pool.end());

