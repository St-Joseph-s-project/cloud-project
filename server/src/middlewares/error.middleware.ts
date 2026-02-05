import type { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
}

export const errorHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};
