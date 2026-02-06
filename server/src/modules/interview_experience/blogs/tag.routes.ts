import { Router } from "express";
import { getAllTags } from "./tag.controller.ts";

const router = Router();

// Get all tags (public)
router.get("/", getAllTags);

export default router;
