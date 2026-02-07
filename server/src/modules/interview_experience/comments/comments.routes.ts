import { Router } from "express";
import { addComment, getComments, deleteComment } from "./comments.controller.ts";
import { authMiddleware } from "../../auth/auth.middleware.ts";

const router = Router();

// Get comments for a blog (public)
router.get("/:blog_id", getComments);

// Add a comment (protected)
router.post("/", authMiddleware, addComment);

// Delete a comment (protected - user can only delete their own)
router.delete("/:id", authMiddleware, deleteComment);

export default router;
