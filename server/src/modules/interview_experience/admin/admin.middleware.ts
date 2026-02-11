import type { Request, Response, NextFunction } from "express";
import { ROLE_IDS } from "../../../constants/roles.ts";

/**
 * Middleware to check if the user has admin role
 * Must be used after authMiddleware
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No user found",
    });
  }
  
  if (user.role_id === ROLE_IDS.STUDENT) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required",
    });
  }

  next();
};
