import pool from "./models/model.ts";

async function createStudent() {
  try {
    console.log("Creating 'student one'...");
    // Check if exists
    const check = await pool.query("SELECT * FROM users WHERE name = $1", [
      "student one",
    ]);
    if (check.rows.length > 0) {
      console.log("User 'student one' already exists.");
      // Update password just in case
      await pool.query(
        "UPDATE users SET password = $1, role_id = 4 WHERE name = $2",
        ["student one", "student one"],
      );
    } else {
      await pool.query(
        "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)",
        ["student one", "student.one@example.com", "student one", 4],
      );
      console.log("User 'student one' created.");
    }
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await pool.end();
  }
}

createStudent();
