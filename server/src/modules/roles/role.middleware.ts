import type { Request, Response, NextFunction } from "express";
import { ROLES } from "../../constants/roles.ts";

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions"
            });
        }

        next();
    };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole(ROLES.ADMIN);

/**
 * Middleware to check if user is mentor or admin
 */
export const requireMentorOrAdmin = requireRole(ROLES.MENTOR, ROLES.ADMIN);
