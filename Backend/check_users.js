const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.query('SELECT id, first_name, last_name, email_id FROM users')
  .then(r => {
    console.log('Users in DB:');
    r.rows.forEach(u => {
      console.log(JSON.stringify(u));
    });
    process.exit(0);
  })
  .catch(e => { console.error(e.message); process.exit(1); });
