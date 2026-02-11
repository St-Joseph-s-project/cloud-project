import { Router } from "express";
import { getAllTags, createTags, createTag } from "./tag.controller.ts";

const router = Router();

// Get all tags (public)
router.get("/", getAllTags);

// Create tags from constants
router.post("/create-tags", createTags);

// Create a single tag
router.post("/create", createTag);

export default router;
