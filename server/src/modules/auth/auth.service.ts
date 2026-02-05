import pool from "../../config/database.ts";
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

        // Query user from database
        const { rows } = await pool.query<DbUser>(
            `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.password,
        u.role_id,
        r.role AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1
      LIMIT 1;
      `,
            [email]
        );

        const user = rows[0];
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
            role: user.role,
            role_id: user.role_id
        });

        return {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                role_id: user.role_id
            }
        };
    }
}

export const authService = new AuthService();
