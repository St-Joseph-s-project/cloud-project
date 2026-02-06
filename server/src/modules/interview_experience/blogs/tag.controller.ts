import type { Request, Response, RequestHandler } from "express";
import { tagService } from "./tag.service.ts";
import { sendSuccess, sendError } from "../../../utils/response.ts";

export const getAllTags: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const tags = await tagService.getAllTags();
    return sendSuccess(res, 200, tags);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tags";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const createTags: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await tagService.createTags();
    return sendSuccess(res, 201, result, `Created ${result.created.length} tags, ${result.existing.length} already existed`);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create tags";
    return sendError(res, 400, "Bad Request", errorMessage);
  }
};
