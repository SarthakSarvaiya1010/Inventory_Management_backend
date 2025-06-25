// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render.com
  },
});

// Optional: test connection once when app starts
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected at:', res.rows[0].now);
  } catch (err) {
    console.error('Initial DB connection error:', err);
  }
})();

module.exports = pool;

