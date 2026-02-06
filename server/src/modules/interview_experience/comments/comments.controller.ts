import type { Request, Response, RequestHandler } from "express";
import { commentService } from "./comments.service.ts";
import { sendSuccess, sendError } from "../../../utils/response.ts";

export const addComment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const comment = await commentService.addComment(req.body, user.userId);
    return sendSuccess(res, 201, comment, "Comment added successfully!");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add comment";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const getComments: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const blog_id = Number(req.params.blog_id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (!blog_id || isNaN(blog_id)) {
      return sendError(res, 400, "Bad Request", "Valid blog_id is required");
    }

    const result = await commentService.getComments(blog_id, page, limit);
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch comments";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};
