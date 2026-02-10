import type { Request, Response, RequestHandler } from "express";
import { blogService } from "./blog.service.ts";
import { sendSuccess, sendError } from "../../../utils/response.ts";

export const createBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    // Handle file uploads if permission is granted
    let files = [];
    if (
      user.can_upload &&
      (req as any).files &&
      (req as any).files.length > 0
    ) {
      files = (req as any).files.map((file: any) => ({
        file_url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        file_name: file.originalname,
        file_size: file.size,
        file_mime_type: file.mimetype,
      }));
    }

    const blogData = { ...req.body, files };
    const blog = await blogService.createBlog(blogData, user.userId);
    return sendSuccess(res, 201, blog, "Blog created successfully!");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const getBlogs: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = (req.query.search as string) || undefined;
    const tag_id = req.query.tag_id ? Number(req.query.tag_id) : undefined;
    const sort_by =
      (req.query.sort_by as "latest" | "oldest" | "most_upvoted") || "latest";
    const user = (req as any).user;
    const userId = user?.userId;

    const result = await blogService.getBlogs(
      page,
      limit,
      search,
      tag_id,
      sort_by,
      userId,
    );
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const getBlogById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const blogId = Number(req.params.id);
    const user = (req as any).user;
    const userId = user?.userId;

    if (!blogId || isNaN(blogId)) {
      return sendError(res, 400, "Bad Request", "Valid blog ID is required");
    }

    const blog = await blogService.getBlogById(blogId, userId);

    if (!blog) {
      return sendError(res, 404, "Not Found", "Blog not found");
    }

    return sendSuccess(res, 200, blog);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blog";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const getAllBlogs: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await blogService.getBlogs(
      1,
      1000,
      undefined,
      undefined,
      "latest",
    );
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const voteBlog: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const { blog_id, is_up_vote } = req.body;

    if (!blog_id || is_up_vote === undefined) {
      return sendError(
        res,
        400,
        "Bad Request",
        "blog_id and is_up_vote are required",
      );
    }

    const result = await blogService.voteBlog(blog_id, user.userId, is_up_vote);
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to vote on blog";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const updateBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    // Handle file uploads if permission is granted
    let files = [];
    if (
      user.can_upload &&
      (req as any).files &&
      (req as any).files.length > 0
    ) {
      files = (req as any).files.map((file: any) => ({
        file_url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        file_name: file.originalname,
        file_size: file.size,
        file_mime_type: file.mimetype,
      }));
    }

    const blogData = { ...req.body, files };
    const blog = await blogService.updateBlog(
      Number(req.params.id),
      blogData,
      user.userId,
    );
    return sendSuccess(res, 200, blog, "Blog updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update blog";

    if (errorMessage.includes("not found")) {
      return sendError(res, 404, "Not Found", errorMessage);
    }
    if (errorMessage.includes("only update your own")) {
      return sendError(res, 403, "Forbidden", errorMessage);
    }
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const deleteBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const blogId = Number(req.params.id);
    if (!blogId || isNaN(blogId)) {
      return sendError(res, 400, "Bad Request", "Valid blog ID is required");
    }

    await blogService.deleteBlog(blogId, user.userId);
    return sendSuccess(res, 200, undefined, "Blog deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog";

    if (errorMessage.includes("not found")) {
      return sendError(res, 404, "Not Found", errorMessage);
    }
    if (errorMessage.includes("only delete your own")) {
      return sendError(res, 403, "Forbidden", errorMessage);
    }
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const reactBlog: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const { blog_id, reaction_id } = req.body;

    if (!blog_id || !reaction_id) {
      return sendError(
        res,
        400,
        "Bad Request",
        "blog_id and reaction_id are required",
      );
    }

    await blogService.reactBlog(blog_id, user.userId, reaction_id);
    return sendSuccess(res, 200, undefined, "Reaction updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to react to blog";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};
