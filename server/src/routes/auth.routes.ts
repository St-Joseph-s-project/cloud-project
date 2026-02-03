import { Router } from "express";
import { loginAuth } from "../controllers/auth.controllers.ts";

const router = Router();

router.post("/login", loginAuth)

export default router
