import { Router } from "express";
import { upload } from "../../utils/fileUpload.ts";
import { uploadFile } from "./upload.controller.ts";
import { authMiddleware } from "../auth/auth.middleware.ts";

const router = Router();

// Protect upload route. Expects form-data with key "file"
router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;
