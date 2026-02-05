import { Router } from "express";
import { loginAuth } from "./auth.controller.ts";

const router = Router();

router.post("/login", loginAuth);

export default router;
