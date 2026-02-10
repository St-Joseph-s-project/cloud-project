import { Router } from "express";
import { getAdminBlogs, adminDeleteBlog, adminDeleteComment, } from "./admin.controller.ts";
import { authMiddleware } from "../../auth/auth.middleware.ts";
import { adminMiddleware } from "./admin.middleware.ts";

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /interview-experience/admin/blogs - Get all blogs with email search
router.get("/blogs", getAdminBlogs);

// DELETE /interview-experience/admin/blogs/:id - Delete any blog
router.delete("/blogs/:id", adminDeleteBlog);

router.delete("/comments/:id", adminDeleteComment);


export default router;
