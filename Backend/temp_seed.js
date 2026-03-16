require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    // Insert a dummy user
    const userRes = await pool.query(`
      INSERT INTO users (first_name, last_name, email_id, password, is_verified) 
      VALUES ('Alice', 'Smith', 'alice@test.com', 'hashed_pw', true) 
      RETURNING id
    `);
    const userId = userRes.rows[0].id;

    // Insert task for that user
    await pool.query(`
      INSERT INTO task (user_id, title, description, location, status) 
      VALUES ($1, 'Help Moving Furniture', 'Need strong hands to move a couch from the 2nd floor.', 'Downtown Appt', 'open')
    `, [userId]);

    console.log('Test user and task seeded successfully!');
  } catch(err) {
    if(err.code === '23505') {
       console.log('Test user already exists.');
    } else {
       console.error(err);
    }
  } finally {
    process.exit(0);
  }
}

seed();
