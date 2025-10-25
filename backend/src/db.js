import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected! Current time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();

export default pool;
