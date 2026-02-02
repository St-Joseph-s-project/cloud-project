import { Router } from "express";
import { loginAuth } from "../controllers/auth.controllers.ts";

const router = Router();

router.get("/login", loginAuth)

export default router
