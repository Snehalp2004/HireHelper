const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Connected to default db');
        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`Creating database ${process.env.DB_NAME}...`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log('Database created');
        } else {
            console.log('Database already exists');
        }
    } catch (err) {
        console.error('Error creating database:', err);
        return;
    } finally {
        await client.end();
    }

    const dbClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    });

    try {
        await dbClient.connect();
        console.log(`Connected to database ${process.env.DB_NAME}`);
        const schemaFile = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaFile, 'utf8');
        await dbClient.query(schema);
        console.log('Schema executed successfully');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await dbClient.end();
    }
}

init();
