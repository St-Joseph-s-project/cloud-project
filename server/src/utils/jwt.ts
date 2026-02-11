import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  userId: number;
  role: string;
  role_id: number;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET_KEY) as TokenPayload;
};
