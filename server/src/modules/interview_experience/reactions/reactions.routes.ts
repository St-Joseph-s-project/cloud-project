import { Router } from "express";
import {
  addBlogReaction,
  removeBlogReaction,
  getBlogReactions,
  addCommentReaction,
  removeCommentReaction,
  getCommentReactions,
} from "./reactions.controller.ts";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../../auth/auth.middleware.ts";

const router = Router();

// Blog reactions
router.get("/blog/:blog_id", optionalAuthMiddleware, getBlogReactions);
router.post("/blog/add", authMiddleware, addBlogReaction);
router.post("/blog/remove", authMiddleware, removeBlogReaction);

// Comment reactions
router.get("/comment/:comment_id", optionalAuthMiddleware, getCommentReactions);
router.post("/comment/add", authMiddleware, addCommentReaction);
router.post("/comment/remove", authMiddleware, removeCommentReaction);

export default router;
