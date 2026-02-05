import express from "express"
import authRoutes from "./routes/auth.routes.ts"
import { connectDB } from "./config/db.ts";
import problemRoutes from "./routes/problem.routes.ts"
import testRoutes from "./routes/test.routes.ts"

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
app.use("/api/test", testRoutes);

// --- DATABASE & SERVER START ---

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();