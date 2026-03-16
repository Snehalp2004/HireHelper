const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    // Get both users
    const user1Result = await pool.query("SELECT id, first_name FROM users WHERE email_id = 'umoney2004@gmail.com'");
    const user2Result = await pool.query("SELECT id, first_name FROM users WHERE email_id = '3al22cs097@aiet.org.in'");

    if (user1Result.rows.length === 0) {
      console.log('❌ User umoney2004@gmail.com not found. Please register first.');
      process.exit(1);
    }
    if (user2Result.rows.length === 0) {
      console.log('❌ User 3al22cs097@aiet.org.in not found. Please register first.');
      process.exit(1);
    }

    const user1Id = user1Result.rows[0].id;
    const user2Id = user2Result.rows[0].id;
    const user1Name = user1Result.rows[0].first_name;
    const user2Name = user2Result.rows[0].first_name;

    console.log(`\n👤 User 1: ${user1Name} (${user1Id})`);
    console.log(`👤 User 2: ${user2Name} (${user2Id})`);

    // ---- Tasks by User 1 ----
    const task1a = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user1Id, 'Help Moving Furniture', 'Need strong hands to move a couch from the 2nd floor.', 'Downtown Appt']
    );

    const task1b = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user1Id, 'Grocery Delivery Needed', 'Pick up groceries from Walmart and deliver to my home by 5 PM.', 'Walmart, 5th Avenue']
    );

    const task1c = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user1Id, 'Dog Walking Service', 'Walk my Golden Retriever for 30 minutes this weekend.', 'Central Park Area']
    );

    // ---- Tasks by User 2 ----
    const task2a = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user2Id, 'Website Bug Fix', 'Need a frontend developer to fix CSS alignment issues on my portfolio site.', 'Remote']
    );

    const task2b = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user2Id, 'Math Tutoring', 'Looking for someone to help me with Calculus 2 homework.', 'College Library, Block C']
    );

    const task2c = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user2Id, 'House Cleaning Assistance', 'Deep clean a 2-bedroom apartment before moving out.', '123 Oak Street']
    );

    const task2d = await pool.query(
      `INSERT INTO task (user_id, title, description, location, status)
       VALUES ($1, $2, $3, $4, 'open') RETURNING id`,
      [user2Id, 'Photography for Event', 'Need a photographer for a small birthday party (2 hours).', 'Riverside Banquet Hall']
    );

    console.log('\n✅ Tasks seeded successfully!');

    // ---- Create cross-requests ----
    // User 2 requests to help with User 1's tasks
    await pool.query(
      `INSERT INTO requests (task_id, requester_id, status) VALUES ($1, $2, 'pending') ON CONFLICT DO NOTHING`,
      [task1a.rows[0].id, user2Id]
    );
    await pool.query(
      `INSERT INTO requests (task_id, requester_id, status) VALUES ($1, $2, 'pending') ON CONFLICT DO NOTHING`,
      [task1b.rows[0].id, user2Id]
    );

    // User 1 requests to help with User 2's tasks
    await pool.query(
      `INSERT INTO requests (task_id, requester_id, status) VALUES ($1, $2, 'pending') ON CONFLICT DO NOTHING`,
      [task2a.rows[0].id, user1Id]
    );
    await pool.query(
      `INSERT INTO requests (task_id, requester_id, status) VALUES ($1, $2, 'pending') ON CONFLICT DO NOTHING`,
      [task2b.rows[0].id, user1Id]
    );

    console.log('✅ Cross-requests seeded successfully!');
    console.log('\n🎉 Seed complete! Both users now have tasks and help requests from each other.\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
