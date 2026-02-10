import type { Request, Response, RequestHandler } from "express";
import { reactionService } from "./reactions.service.ts";
import { sendSuccess, sendError } from "../../../utils/response.ts";

export const addBlogReaction: RequestHandler = async (
  req: Request,
  res: Response
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
        "blog_id and reaction_id are required"
      );
    }

    const reaction = await reactionService.addBlogReaction(
      blog_id,
      user.userId,
      reaction_id
    );
    return sendSuccess(res, 201, reaction, "Reaction added successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add reaction";
    if (errorMessage.includes("already reacted")) {
      return sendError(res, 409, "Conflict", errorMessage);
    }
    console.log("Error in addBlogReaction:", error);
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const removeBlogReaction: RequestHandler = async (
  req: Request,
  res: Response
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
        "blog_id and reaction_id are required"
      );
    }

    await reactionService.removeBlogReaction(
      blog_id,
      user.userId,
      reaction_id
    );
    return sendSuccess(res, 200, undefined, "Reaction removed successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove reaction";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const getBlogReactions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const blog_id = Number(req.params.blog_id);
    const user = (req as any).user;
    const user_id = user?.userId;

    if (!blog_id || isNaN(blog_id)) {
      return sendError(res, 400, "Bad Request", "Valid blog_id is required");
    }

    const reactions = await reactionService.getBlogReactions(blog_id, user_id);
    return sendSuccess(res, 200, reactions);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch reactions";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const addCommentReaction: RequestHandler = async (
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
      return sendError(
        res,
        400,
        "Bad Request",
        "comment_id and reaction_id are required"
      );
    }

    const reaction = await reactionService.addCommentReaction(
      comment_id,
      user.userId,
      reaction_id
    );
    return sendSuccess(res, 201, reaction, "Reaction added successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add reaction";
    if (errorMessage.includes("already reacted")) {
      return sendError(res, 409, "Conflict", errorMessage);
    }
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const removeCommentReaction: RequestHandler = async (
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
      return sendError(
        res,
        400,
        "Bad Request",
        "comment_id and reaction_id are required"
      );
    }

    await reactionService.removeCommentReaction(
      comment_id,
      user.userId,
      reaction_id
    );
    return sendSuccess(res, 200, undefined, "Reaction removed successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove reaction";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};

export const getCommentReactions: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const comment_id = Number(req.params.comment_id);
    const user = (req as any).user;
    const user_id = user?.userId;

    if (!comment_id || isNaN(comment_id)) {
      return sendError(
        res,
        400,
        "Bad Request",
        "Valid comment_id is required"
      );
    }

    const reactions = await reactionService.getCommentReactions(
      comment_id,
      user_id
    );
    return sendSuccess(res, 200, reactions);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch reactions";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};
