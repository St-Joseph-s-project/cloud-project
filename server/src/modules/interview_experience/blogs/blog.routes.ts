import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  voteBlog,
} from "./blog.controller.ts";
import { authMiddleware } from "../../auth/auth.middleware.ts";

const router = Router();

// Public routes
router.get("/", getBlogs);
router.get("/getAllBlog", getAllBlogs);

// Protected routes
router.post("/", authMiddleware, createBlog);
router.post("/vote", authMiddleware, voteBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
