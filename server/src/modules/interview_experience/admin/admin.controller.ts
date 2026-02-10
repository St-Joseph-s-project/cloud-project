import type { Request, Response, RequestHandler } from "express";
import { blogService } from "../blogs/blog.service.ts";
import { sendSuccess, sendError } from "../../../utils/response.ts";
import { commentService } from "../comments/comments.service.ts";


/**
 * Get all blogs for admin with email search capability
 */
export const getAdminBlogs: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search_email = (req.query.search_email as string) || undefined;
    const sort_by = (req.query.sort_by as "latest" | "oldest") || "latest";

    const result = await blogService.getAdminBlogs(
      page,
      limit,
      search_email,
      sort_by
    );
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

/**
 * Admin delete blog - can delete any blog regardless of ownership
 */
export const adminDeleteBlog: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const blogId = Number(req.params.id);

    if (!blogId || isNaN(blogId)) {
      return sendError(res, 400, "Bad Request", "Valid blog ID is required");
    }

    await blogService.adminDeleteBlog(blogId);
    return sendSuccess(res, 200, undefined, "Blog deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};


export const adminDeleteComment: RequestHandler = async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    if (!commentId || isNaN(commentId)) {
      return sendError(res, 400, "Bad Request", "Valid comment ID is required");
    }

    await commentService.adminDeleteComment(commentId);

    return sendSuccess(res, 200, undefined, "Comment deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete comment";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

