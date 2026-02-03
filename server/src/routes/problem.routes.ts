import { Router } from "express";
import { handleProblemSubmission } from "../controllers/problem.controller.ts";

const router = Router();

router.post("/problem-submit", handleProblemSubmission)

export default router 
