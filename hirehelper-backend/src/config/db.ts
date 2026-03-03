import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool: Pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Initial connection check
pool.connect()
    .then(client => {
        console.log('Database Connected Successfully');
        client.release();
    })
    .catch(err => console.error('Database Connection Error:', err.stack));

export default pool;
