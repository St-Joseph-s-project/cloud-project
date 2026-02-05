import type { Request, Response, RequestHandler } from "express";
import { problemService } from "./problem.service.ts";
import { sendSuccess, sendError } from "../../utils/response.ts";

/**
 * Controller to handle problem submission
 */
export const handleProblemSubmission: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const problem = await problemService.createProblem(req.body);
        return sendSuccess(res, 201, problem, "Problem successfully stored in PostgreSQL!");
    } catch (error: any) {
        const errorMessage =
            error instanceof Error ? error.message : "Database connection failed";
        return sendError(res, 500, "Internal Server Error", errorMessage);
    }
};

export const getAllProblems: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const problems = await problemService.getAllProblems();
        return sendSuccess(res, 200, problems);
    } catch (error: any) {
        const errorMessage =
            error instanceof Error ? error.message : "Database connection failed";
        return sendError(res, 500, "Internal Server Error", errorMessage);
    }
};

export const getProblemById: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const problem = await problemService.getProblemById(Number(req.params.id));
        return sendSuccess(res, 200, problem);
    } catch (error: any) {
        const errorMessage =
            error instanceof Error ? error.message : "Database connection failed";
        return sendError(res, 500, "Internal Server Error", errorMessage);
    }
};

export const updateProblem: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const problem = await problemService.updateProblem(
            Number(req.params.id),
            req.body
        );
        return sendSuccess(res, 200, problem, "Problem updated successfully");
    } catch (error: any) {
        const errorMessage =
            error instanceof Error ? error.message : "Database connection failed";
        return sendError(res, 500, "Internal Server Error", errorMessage);
    }
};

export const deleteProblem: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        await problemService.deleteProblem(Number(req.params.id));
        return sendSuccess(res, 200, undefined, "Problem deleted successfully");
    } catch (error: any) {
        const errorMessage =
            error instanceof Error ? error.message : "Database connection failed";
        return sendError(res, 500, "Internal Server Error", errorMessage);
    }
};

export const createProblemWithDetails: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const problem = await problemService.createProblemWithDetails(req.body);
        return sendSuccess(
            res,
            201,
            problem,
            "Problem and test cases created successfully"
        );
    } catch (error: any) {
        console.error("Error creating problem with details:", error);
        return sendError(res, 500, "Internal Server Error", error.message);
    }
};
