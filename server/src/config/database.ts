import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

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

export const connectDB = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("✅ DB Connected at:", res.rows[0].now);
    } catch (err) {
        console.error("❌ DB connection failed:", err);
        process.exit(1);
    }
};

export default pool;
