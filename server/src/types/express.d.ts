import type { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: string;
                role_id: number;
            };
        }
    }
}

export { };
