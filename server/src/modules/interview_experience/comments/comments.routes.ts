import { Router } from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  reactComment,
  getReplies,
} from "./comments.controller.ts";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../../auth/auth.middleware.ts";

const router = Router();

// Get comments for a blog (public, optional auth for reactions)
router.get("/:blog_id", optionalAuthMiddleware, getComments);

// Get replies for a comment
router.get("/:id/replies", optionalAuthMiddleware, getReplies);

// Add a comment (protected)
router.post("/", authMiddleware, addComment);

// React to a comment (protected)
router.post("/reaction", authMiddleware, reactComment);

// Update a comment (protected - user can only update their own)
router.put("/:id", authMiddleware, updateComment);

// Delete a comment (protected - user can only delete their own)
router.delete("/:id", authMiddleware, deleteComment);

export default router;
