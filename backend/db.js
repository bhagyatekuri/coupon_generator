import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
//const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT 1')
    .then(() => console.log('✅ DB CONNECTED'))
    .catch(err => console.error('❌ DB ERROR:', err.message));



export default pool;