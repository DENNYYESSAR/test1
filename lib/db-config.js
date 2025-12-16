const { Pool } = require('pg');

// Use direct connection string to force proper connection
const connectionString = process.env.SUPABASE_DB_URL || 
  `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

const dbConfig = {
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  // Force IPv4 by setting this
  options: '-c search_path=public',
};

console.log('Database connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};