import prisma from "../../lib/prisma.ts";
import type { DbUser } from "../users/user.model.ts";
import { comparePassword } from "../../utils/password.ts";
import { generateToken } from "../../utils/jwt.ts";

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    token?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
        role_id: number;
    };
    message?: string;
}

export class AuthService {
    /**
     * Authenticate user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResult> {
        const { email, password } = credentials;

        if (!email || !password) {
            return {
                success: false,
                message: "All fields are required"
            };
        }

        // Query user from database with Prisma
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!user) {
            return {
                success: false,
                message: "Invalid email"
            };
        }

        // Verify password
        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            return {
                success: false,
                message: "Invalid password"
            };
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            role: user.role.role,
            role_id: user.role_id
        });

        return {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.role,
                role_id: user.role_id
            }
        };
    }
}

export const authService = new AuthService();

