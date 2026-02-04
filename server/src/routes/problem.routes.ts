import { Router } from "express";
import { handleProblemSubmission, getAllProblems, getProblemById, updateProblem, deleteProblem, createProblemWithDetails } from "../controllers/problem.controller.ts";

const router = Router();

router.post("/create-problem", handleProblemSubmission)
router.get("/get-all-problems", getAllProblems)
router.get("/get-problem-by-id/:id", getProblemById)
router.put("/update-problem/:id", updateProblem)
router.delete("/delete-problem/:id", deleteProblem)

export default router 
