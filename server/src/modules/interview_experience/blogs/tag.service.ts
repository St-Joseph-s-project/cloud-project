import prisma from "../../../lib/prisma.ts";
import type { Tag } from "./blogs.model.ts";

export class TagService {
  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    const tags = await prisma.tags.findMany({
      orderBy: { id: "asc" },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));
  }
}

export const tagService = new TagService();
