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
import blogRoutes from "./modules/interview_experience/blogs/blog.routes.ts";
import commentRoutes from "./modules/interview_experience/comments/comments.routes.ts";
import tagRoutes from "./modules/interview_experience/blogs/tag.routes.ts";
import interviewExperienceAdminRoutes from "./modules/interview_experience/admin/admin.routes.ts";

app.use("/api/auth", authRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/test", testRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs/comments", commentRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/interview-experience/admin", interviewExperienceAdminRoutes);

// --- ERROR HANDLING ---
import { errorHandler } from "./middlewares/error.middleware.ts";
app.use(errorHandler);

export default app;
