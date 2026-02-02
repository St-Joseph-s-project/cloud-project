import express from "express"
import authRoutes from "./routes/auth.routes.ts"
import pool from "./models/model.ts"
import { testDbConnection } from "./models/model.ts"
// 1. Import the middleware you created
import { authMiddleware } from "./middlewares/ex.middleware.ts" 

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

// --- ROUTES ---

// Public Route: Used for getting the JWT token
app.use("/api/auth", authRoutes)

// 2. Protected Route: Only accessible with a valid token
// This is where you'd put coding tests or user-specific data
app.get("/api/test/start", authMiddleware, (req, res) => {
    res.json({ 
        message: "Welcome to the coding test platform!", 
        user: (req as any).user 
    });
});

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