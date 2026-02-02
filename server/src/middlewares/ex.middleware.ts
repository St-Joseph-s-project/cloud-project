// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const protect = (req: Request, res: Response, next: NextFunction) => {
//     let token;

//     // 1. Check if token exists in headers
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//         return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     try {
//         // 2. Verify token
//         // Make sure to add JWT_SECRET to your .env file!
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        
//         // 3. Attach user info to request (optional)
//         (req as any).user = decoded; 
        
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Not authorized, token failed" });
//     }
// };


import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/login", (req, res) => {
    // In a real app, you'd verify the PG user here first
    const user = { id: 1, username: "candidate_test" };

    // Sign the token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

    res.status(200).json({
        message: "Login Successful",
        token: token
    });
});

export default router;