import type { Request, Response } from "express";
import { authService } from "./auth.service.ts";

export async function loginAuth(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    const result = await authService.login({
      email: email!,
      password: password!,
    });

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    // Set JWT cookie
    res.cookie("jwt", result.token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
