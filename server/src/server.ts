import express from "express"
import authRoutes from "./routes/auth.routes.ts"
import pool from "./models/model.ts"
import { testDbConnection } from "./models/model.ts"
import problemRoutes from "./routes/problem.routes.ts"

import cors from "cors";

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", // URL of your frontend
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// --- ROUTES ---

// Public Route: Used for getting the JWT token
app.use("/api/auth", authRoutes);
app.use("/api/problem", problemRoutes);

// 2. Protected Route: Only accessible with a valid token
// This is where you'd put coding tests or user-specific data


// --- DATABASE & SERVER START ---

pool.connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error', err.stack);
    process.exit(1);
  });

testDbConnection()