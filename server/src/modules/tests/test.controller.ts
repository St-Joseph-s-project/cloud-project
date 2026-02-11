import type { Request, Response, RequestHandler } from "express";
import { testService } from "./test.service.ts";
import { sendSuccess, sendError } from "../../utils/response.ts";

export const createTest: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const test = await testService.createTest(req.body);
    return sendSuccess(res, 201, test, "Test created successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const updateTestStatus: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { status } = req.body;
    const test = await testService.updateTestStatus(
      Number(req.params.id),
      status,
    );
    return sendSuccess(res, 200, test, "Test status updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const mapProblemsToTest: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    await testService.mapProblemsToTest(req.body);
    return sendSuccess(
      res,
      201,
      undefined,
      "Problems mapped to test successfully",
    );
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const getAllTests: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const tests = await testService.getAllTests();
    return sendSuccess(res, 200, tests);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const getTestById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const test = await testService.getTestById(Number(req.params.id));
    return sendSuccess(res, 200, test);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const updateTest: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const test = await testService.updateTest(Number(req.params.id), req.body);
    return sendSuccess(res, 200, test, "Test updated successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};

export const deleteTest: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    await testService.deleteTest(Number(req.params.id));
    return sendSuccess(res, 200, undefined, "Test deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    return sendError(res, 500, "Internal Server Error", errorMessage);
  }
};
