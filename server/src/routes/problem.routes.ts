import { Router } from "express";
import { handleProblemSubmission, getAllProblems, getProblemById, updateProblem, deleteProblem } from "../controllers/problem.controller.ts";

const router = Router();

router.post("/problem-submit", handleProblemSubmission)
router.get("/get-all-problems", getAllProblems)
router.get("/get-problem-by-id/:id", getProblemById)
router.put("/update-problem/:id", updateProblem)
router.delete("/delete-problem/:id", deleteProblem)

export default router 
