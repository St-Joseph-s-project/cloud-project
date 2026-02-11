import type { Request, Response, NextFunction } from "express";
import prisma from "../../../lib/prisma.ts";

/**
 * Middleware to check upload permission and set can_upload attribute on req.user
 * Must be used after authMiddleware
 */
export const uploadPermissionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user || !user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    // Check if user has post_community_allow_upload_files permission
    const permission = await prisma.role_permissions.findFirst({
      where: {
        role: user.role_id,
        permissions: {
          permission: "post_community_allow_upload_files",
        },
      },
      include: {
        permissions: true,
      },
    });

    // Set can_upload attribute on req.user
    if (req.user) {
      req.user.can_upload = !!permission;
    }

    next();
  } catch (error) {
    console.error("Error in uploadPermissionMiddleware:", error);
    if (req.user) {
      req.user.can_upload = false;
    }
    next();
  }
};
