import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
  process.exit(1);
});
export async function testDbConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB Connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}
export default pool;
