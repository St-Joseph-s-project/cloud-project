import pool from "./models/model.ts";

async function listUsers() {
  try {
    console.log("Listing users...");
    const res = await pool.query(
      "SELECT id, name, email, role_id, password FROM users",
    );
    console.table(res.rows);

    console.log("Listing roles...");
    const rolesRes = await pool.query("SELECT * FROM roles");
    console.table(rolesRes.rows);
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await pool.end();
  }
}

listUsers();
