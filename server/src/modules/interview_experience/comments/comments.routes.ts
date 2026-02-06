import { Router } from "express";
import { addComment, getComments } from "./comments.controller.ts";
import { authMiddleware } from "../../auth/auth.middleware.ts";

const router = Router();

// Get comments for a blog (public)
router.get("/:blog_id", getComments);

// Add a comment (protected)
router.post("/", authMiddleware, addComment);

export default router;

export default router;
