import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. Grab the token from the 'Authorization' header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        // 2. Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // 3. Attach user info to the request object so routes can use it
        (req as any).user = verified;
        
        next(); // Move to the next function/route
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};