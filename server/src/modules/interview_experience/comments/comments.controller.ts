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

    const user = (req as any).user;
    const userId = user?.userId;

    const result = await commentService.getComments(blog_id, page, limit, userId);
    return sendSuccess(res, 200, result);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch comments";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const updateComment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const commentId = Number(req.params.id);
    if (!commentId || isNaN(commentId)) {
      return sendError(res, 400, "Bad Request", "Valid comment ID is required");
    }

    const comment = await commentService.updateComment(commentId, req.body, user.userId);
    return sendSuccess(res, 200, comment, "Comment updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update comment";

    if (errorMessage.includes("not found")) {
      return sendError(res, 404, "Not Found", errorMessage);
    }
    if (errorMessage.includes("only update your own")) {
      return sendError(res, 403, "Forbidden", errorMessage);
    }
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const deleteComment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const commentId = Number(req.params.id);
    if (!commentId || isNaN(commentId)) {
      return sendError(res, 400, "Bad Request", "Valid comment ID is required");
    }

    await commentService.deleteComment(commentId, user.userId);
    return sendSuccess(res, 200, undefined, "Comment deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete comment";

    if (errorMessage.includes("not found")) {
      return sendError(res, 404, "Not Found", errorMessage);
    }
    if (errorMessage.includes("only delete your own")) {
      return sendError(res, 403, "Forbidden", errorMessage);
    }
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const reactComment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return sendError(res, 401, "Unauthorized", "User ID not found in token");
    }

    const { comment_id, reaction_id } = req.body;

    if (!comment_id || !reaction_id) {
      return sendError(res, 400, "Bad Request", "comment_id and reaction_id are required");
    }

    await commentService.reactComment(comment_id, user.userId, reaction_id);
    return sendSuccess(res, 200, undefined, "Reaction updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to react to comment";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};
