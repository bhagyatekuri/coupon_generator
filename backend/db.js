import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
//const { Pool } = require("pg");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: Number(process.env.DB_PORT),
});
// ✅ test DB connection (do NOT close pool)
pool.query("SELECT NOW()")
    .then(res => console.log("DB connected:", res.rows[0]))
    .catch(err => console.error("DB error:", err));

export default pool;