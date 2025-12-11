// src/db.js
// Postgres pool helper — robust for Render / local dev
if (process.env.NODE_ENV !== 'production') {
  // load local .env only in development
  require('dotenv').config();
}

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || null;

// If DATABASE_URL is present, use it (Render provides this).
// Otherwise build from PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE
const poolConfig = connectionString
  ? {
      connectionString,
      // Use TLS for managed DBs (Render requires TLS). This config
      // instructs node-postgres to accept the server cert.
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  : {
      host: process.env.PGHOST || process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.PGPORT || process.env.DATABASE_PORT || '5432', 10),
      user: process.env.PGUSER || process.env.DATABASE_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.PGDATABASE || process.env.DATABASE_NAME || 'modex',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
