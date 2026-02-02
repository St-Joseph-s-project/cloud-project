import express from "express"
import authRoutes from "./routes/auth.routes.ts"
import pool from "./models/model.ts"
// const pool = require('./db'); 
import { testDbConnection } from "./models/model.ts"

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())

app.use("/api/auth", authRoutes)

pool.connect()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error', err.stack);
    process.exit(1); // Exit if DB connection fails
  });

testDbConnection()