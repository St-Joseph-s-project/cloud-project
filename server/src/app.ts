import express from "express";
import type { Express } from "express";
import cors from "cors";

const app: Express = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: "http://localhost:5173", // URL of your frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
// Routes will be imported and registered here
import authRoutes from "./modules/auth/auth.routes.ts";
import problemRoutes from "./modules/problems/problem.routes.ts";
import testRoutes from "./modules/tests/test.routes.ts";

app.use("/api/auth", authRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/test", testRoutes);

// --- ERROR HANDLING ---
import { errorHandler } from "./middlewares/error.middleware.ts";
app.use(errorHandler);

export default app;
