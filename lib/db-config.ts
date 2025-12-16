import { Pool, QueryResult, PoolConfig } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DB_CONNECTION_STRING;

let dbConfig: PoolConfig;

if (connectionString) {
  // Parse the connection string to extract the host
  const url = new URL(connectionString);

  dbConfig = {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    database: url.pathname.slice(1), // Remove leading slash
    ssl: { rejectUnauthorized: false },
    // Force IPv4 to avoid IPv6 connectivity issues
    // @ts-ignore - family is a valid option but not in types
    family: 4,
    // Connection pool settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection configured for:', url.hostname);
  }
} else {
  // Validate required environment variables
  const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD'];
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please create a .env.local file based on .env.example'
    );
  }

  const mustUseSSL = process.env.DB_REQUIRE_SSL !== 'false';

  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: mustUseSSL ? { rejectUnauthorized: false } : false,
    // Force IPv4 to avoid IPv6 connectivity issues
    // @ts-ignore - family is a valid option but not in types
    family: 4,
    // Connection pool settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Connected to PostgreSQL database');
  }
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => pool.query(text, params);
export { pool };

const db = {
  query,
  pool
};

export default db;