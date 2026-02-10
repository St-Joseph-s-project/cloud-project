import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  voteBlog,
  reactBlog,
} from "./blog.controller.ts";
import { getComments } from "../comments/comments.controller.ts";
import { authMiddleware, optionalAuthMiddleware } from "../../auth/auth.middleware.ts";
import { uploadPermissionMiddleware } from "../middlewares/uploadPermission.middleware.ts";
import { upload } from "../../../utils/fileUpload.ts";

const router = Router();

// Public routes (order matters - more specific routes first)
router.get("/", optionalAuthMiddleware, getBlogs);
router.get("/getAllBlog", getAllBlogs);
router.get("/:blog_id/comments", optionalAuthMiddleware, getComments);
router.get("/:id", optionalAuthMiddleware, getBlogById);

// Protected routes
router.post("/", authMiddleware, uploadPermissionMiddleware, upload.array("files", 5), createBlog);
router.post("/vote", authMiddleware, voteBlog);
router.post("/react", authMiddleware, reactBlog);
router.put("/:id", authMiddleware, uploadPermissionMiddleware, upload.array("files", 5), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
