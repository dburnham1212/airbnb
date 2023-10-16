// Database connections
const { Pool } = require('pg');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } =
  process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
