import prisma from "../../../lib/prisma.ts";
import type {
  Blog,
  BlogCreateInput,
  BlogUpdateInput,
  Tag,
  BlogWithDetails,
  VoteResponse,
  PaginatedResponse,
} from "./blogs.model.ts";

export class BlogService {
  /**
   * Create a new blog with tags
   */
  async createBlog(input: BlogCreateInput, userId: number): Promise<BlogWithDetails> {
    const { title, description, tags = [] } = input;

    if (!title) {
      throw new Error("Title is required");
    }

    const blog = await prisma.blogs.create({
      data: {
        user_id: userId,
        title,
        description: description || null,
        up_vote: 0,
        down_vote: 0,
        is_deleted: false,
      },
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tag_id of tags) {
        await prisma.blog_tags_mapping.create({
          data: {
            blog_id: blog.id,
            tag_id,
          },
        });
      }
    }

    // Get user name
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Get tags
    const blogTags = await prisma.blog_tags_mapping.findMany({
      where: { blog_id: blog.id },
      include: { tags: true },
    });

    return {
      id: blog.id,
      user_id: blog.user_id,
      title: blog.title,
      description: blog.description || undefined,
      up_vote: blog.up_vote || 0,
      down_vote: blog.down_vote || 0,
      created_at: blog.created_at || undefined,
      is_deleted: blog.is_deleted || false,
      user_name: user?.name || "",
      tags: blogTags.map((mapping) => ({
        id: mapping.tags.id,
        name: mapping.tags.name,
      })),
      user_vote: null,
    };
  }

  /**
   * Get all blogs with pagination, filtering, and sorting
   */
  async getBlogs(
    page: number = 1,
    limit: number = 6,
    search?: string,
    tag_id?: number,
    sort_by: "latest" | "oldest" | "most_upvoted" = "latest",
    userId?: number
  ): Promise<PaginatedResponse<BlogWithDetails>> {
    const offset = (page - 1) * limit;

    // Build where clause
    let where: any = { is_deleted: false };

    if (search) {
      where = {
        ...where,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { users: { name: { contains: search, mode: "insensitive" } } },
        ],
      };
    }

    if (tag_id) {
      where = {
        ...where,
        blog_tags_mapping: {
          some: {
            tag_id,
          },
        },
      };
    }

    // Build order clause
    let orderBy: any = { created_at: "desc" };
    if (sort_by === "oldest") {
      orderBy = { created_at: "asc" };
    } else if (sort_by === "most_upvoted") {
      orderBy = { up_vote: "desc" };
    }

    // Get total count
    const total = await prisma.blogs.count({ where });

    // Get blogs
    const blogs = await prisma.blogs.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        users: { select: { name: true } },
        blog_tags_mapping: { include: { tags: true } },
        ...(userId && {
          vote_user_mapping: {
            where: { user_id: userId },
            select: { is_up_vote: true, is_down_vote: true },
          },
        }),
      },
    });

    // Map to response format
    const data: BlogWithDetails[] = blogs.map((blog) => {
      let user_vote: "up" | "down" | null = null;
      if (userId && blog.vote_user_mapping && (blog.vote_user_mapping as any).length > 0) {
        const userVote = (blog.vote_user_mapping as any)[0];
        if (userVote.is_up_vote) {
          user_vote = "up";
        } else if (userVote.is_down_vote) {
          user_vote = "down";
        }
      }

      return {
        id: blog.id,
        user_id: blog.user_id,
        title: blog.title,
        description: blog.description || undefined,
        up_vote: blog.up_vote || 0,
        down_vote: blog.down_vote || 0,
        created_at: blog.created_at || undefined,
        is_deleted: blog.is_deleted || false,
        user_name: blog.users.name,
        tags: (blog.blog_tags_mapping as any[]).map((mapping) => ({
          id: mapping.tags.id,
          name: mapping.tags.name,
        })),
        user_vote,
      };
    });

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get blog by ID
   */
  async getBlogById(id: number): Promise<Blog | null> {
    const blog = await prisma.blogs.findUnique({
      where: { id },
    });

    return blog as Blog | null;
  }

  /**
   * Update a blog
   */
  async updateBlog(id: number, input: BlogUpdateInput): Promise<Blog> {
    const { title, description, is_deleted } = input;

    const blog = await prisma.blogs.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(is_deleted !== undefined && { is_deleted }),
      },
    });

    return blog as Blog;
  }

  /**
   * Soft delete a blog
   */
  async deleteBlog(id: number): Promise<void> {
    await prisma.blogs.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });
  }

  /**
   * Vote on a blog (upvote/downvote)
   * Implements toggle logic
   */
  async voteBlog(blog_id: number, user_id: number, is_up_vote: boolean): Promise<VoteResponse> {
    // Get current vote
    const currentVote = await prisma.vote_user_mapping.findFirst({
      where: { user_id, blog_id },
    });

    let new_is_up_vote = false;
    let new_is_down_vote = false;
    let upVoteChange = 0;
    let downVoteChange = 0;

    if (!currentVote) {
      // No current vote - create new
      if (is_up_vote) {
        new_is_up_vote = true;
        upVoteChange = 1;
      } else {
        new_is_down_vote = true;
        downVoteChange = 1;
      }
      
      await prisma.vote_user_mapping.create({
        data: {
          user_id,
          blog_id,
          is_up_vote: new_is_up_vote,
          is_down_vote: new_is_down_vote,
        },
      });
    } else {
      // Has current vote - apply toggle logic
      if (currentVote.is_up_vote) {
        if (is_up_vote) {
          // Remove upvote
          new_is_up_vote = false;
          new_is_down_vote = false;
          upVoteChange = -1;
        } else {
          // Change from upvote to downvote
          new_is_up_vote = false;
          new_is_down_vote = true;
          upVoteChange = -1;
          downVoteChange = 1;
        }
      } else if (currentVote.is_down_vote) {
        if (is_up_vote) {
          // Change from downvote to upvote
          new_is_up_vote = true;
          new_is_down_vote = false;
          downVoteChange = -1;
          upVoteChange = 1;
        } else {
          // Remove downvote
          new_is_up_vote = false;
          new_is_down_vote = false;
          downVoteChange = -1;
        }
      }

      await prisma.vote_user_mapping.update({
        where: { id: currentVote.id },
        data: {
          is_up_vote: new_is_up_vote,
          is_down_vote: new_is_down_vote,
        },
      });
    }

    // Update blog vote counts
    const blog = await prisma.blogs.update({
      where: { id: blog_id },
      data: {
        up_vote: { increment: upVoteChange },
        down_vote: { increment: downVoteChange },
      },
    });

    // Determine current vote status
    let user_vote: "up" | "down" | null = null;
    if (new_is_up_vote) {
      user_vote = "up";
    } else if (new_is_down_vote) {
      user_vote = "down";
    }

    return {
      up_vote: blog.up_vote || 0,
      down_vote: blog.down_vote || 0,
      user_vote,
    };
  }
}

export const blogService = new BlogService();
