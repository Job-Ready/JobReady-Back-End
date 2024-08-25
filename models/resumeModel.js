// src/models/resumeModel.js
const pool = require("../config/db");

const createResumeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      fullname VARCHAR(255),
      title VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      repos TEXT[],
      portfolio VARCHAR(255),
      country VARCHAR(100),
      linkedin VARCHAR(255),
      work_experiences JSONB,
      projects JSONB,
      education JSONB,
      languages TEXT[],
      skills TEXT[],
      last_change TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
};

const createResume = async (resumeData) => {
  const {
    user_id,
    fullname,
    title,
    email,
    phone,
    repos,
    portfolio,
    country,
    linkedin,
    work_experiences,
    projects,
    education,
    languages,
    skills,
  } = resumeData;

  const query = `
    INSERT INTO resumes (
      user_id, fullname, title, email, phone, repos, portfolio,
      country, linkedin, work_experiences, projects, education,
      languages, skills
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  const values = [
    user_id,
    fullname,
    title,
    email,
    phone,
    repos,
    portfolio,
    country,
    linkedin,
    work_experiences,
    projects,
    education,
    languages,
    skills,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getResumeByUserId = async (user_id) => {
  const query = `SELECT * FROM resumes WHERE user_id = $1`;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

const updateResume = async (resumeId, updates) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  const query = `
    UPDATE resumes
    SET ${fields.join(", ")}, last_change = NOW()
    WHERE id = $${index}
    RETURNING *;
  `;
  values.push(resumeId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createResumeTable,
  createResume,
  getResumeByUserId,
  updateResume,
};
