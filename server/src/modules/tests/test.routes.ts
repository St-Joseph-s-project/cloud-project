import { Router } from "express";
import {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest,
    updateTestStatus,
    mapProblemsToTest
} from "./test.controller.ts";

const router = Router();

router.post("/create-test", createTest);
router.post("/map-problems-to-test", mapProblemsToTest);
router.put("/update-test-status/:id", updateTestStatus);
router.get("/get-all-tests", getAllTests);
router.get("/get-test-by-id/:id", getTestById);
router.put("/update-test/:id", updateTest);
router.delete("/delete-test/:id", deleteTest);

export default router;
