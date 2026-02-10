import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt.ts";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Grab the token from the 'Authorization' header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // 2. Verify the token using the utility function
    const verified = verifyToken(token);
    // 3. Attach user info to the request object so routes can use it
    (req as any).user = verified;

    next(); // Move to the next function/route
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (token) {
    try {
      const verified = verifyToken(token);
      (req as any).user = verified;
    } catch (err) {
      // Token invalid or expired, but we proceed without user info
      // Could log error if needed
    }
  }
  next();
};
