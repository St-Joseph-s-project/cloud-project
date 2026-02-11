import type { Response } from "express";

interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export const sendSuccess = <T = any>(
  res: Response,
  statusCode: number = 200,
  data?: T,
  message?: string,
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number = 500,
  error: string,
  details?: string,
): Response => {
  const response: ErrorResponse = {
    success: false,
    error,
    ...(details && { details }),
  };
  return res.status(statusCode).json(response);
};
