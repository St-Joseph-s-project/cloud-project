import { Router } from "express";
import { getAllTags, createTags } from "./tag.controller.ts";

const router = Router();

// Get all tags (public)
router.get("/", getAllTags);

// Create tags from constants
router.post("/create-tag", createTags);

export default router;
