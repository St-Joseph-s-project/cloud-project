// import { Request, Response } from "express";
import type { Request, Response } from "express";

import pool from "../models/model.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

interface DbUser {
  id: number;
  email: string;
  password: string;
}


export async function loginAuth(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { rows } = await pool.query<DbUser>(
      "SELECT id, email, password FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY not defined");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
