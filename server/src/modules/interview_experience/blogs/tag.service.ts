import prisma from "../../../lib/prisma.ts";
import type { Tag } from "./blogs.model.ts";
import { COMPANIES } from "../../../constants/companies.ts";

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

  /**
   * Create tags from constants if they don't exist
   */
  async createTags(): Promise<{ created: string[]; existing: string[] }> {
    const created: string[] = [];
    const existing: string[] = [];

    for (const company of COMPANIES) {
      const existingTag = await prisma.tags.findFirst({
        where: { name: company },
      });

      if (existingTag) {
        existing.push(company);
      } else {
        await prisma.tags.create({
          data: { name: company },
        });
        created.push(company);
      }
    }

    return { created, existing };
  }
}

export const tagService = new TagService();
