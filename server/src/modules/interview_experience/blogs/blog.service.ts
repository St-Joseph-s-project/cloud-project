import prisma from "../../../lib/prisma.ts";
import type {
  Blog,
  BlogCreateInput,
  BlogUpdateInput,
  Tag,
  BlogWithDetails,
  BlogWithDetailsAdmin,
  VoteResponse,
  PaginatedResponse,
} from "./blogs.model.ts";

export class BlogService {
  /**
   * Create a new blog with tags and files
   */
  async createBlog(
    input: BlogCreateInput,
    userId: number,
  ): Promise<BlogWithDetails> {
    const { title, description, tags = [], files = [] } = input;

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

    // Add files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        await prisma.blog_files.create({
          data: {
            blog_id: blog.id,
            file_url: file.file_url,
            file_name: file.file_name,
            file_size: file.file_size ? Number(file.file_size) : 0,
            file_mime_type: file.file_mime_type || "application/octet-stream",
          },
        });
      }
    }

    // Get user name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Get tags
    const blogTags = await prisma.blog_tags_mapping.findMany({
      where: { blog_id: blog.id },
      include: { tags: true },
    });

    // Get files
    const blogFiles = await prisma.blog_files.findMany({
      where: { blog_id: blog.id },
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
      files: blogFiles.map((f) => ({
        id: f.id,
        file_url: f.file_url,
        file_name: f.file_name,
        file_size: f.file_size ? Number(f.file_size) : undefined,
        file_mime_type: f.file_mime_type || undefined,
        created_at: f.created_at || undefined,
      })),
      user_vote: null,
      user_reaction: null,
      reactions: [],
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
    userId?: number,
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
        blog_files: true,
        blog_reactions: true,
        _count: {
          select: {
            comments: true,
          },
        },
        ...(userId && {
          vote_user_mapping: {
            where: { user_id: userId },
            select: { is_up_vote: true, is_down_vote: true },
          },
          // Optimization: fetch user specific reaction in a separate query or map later?
          // Prisma doesn't support filtering inside include for has-many relation easily for "currentUserReaction"
          // We will fetch all reactions and map, or use a separate query.
          // For list view, fetching all reactions for each blog might be heavy if not careful.
          // But blog_reactions table is small per blog usually.
        }),
      },
    });

    // Map to response format
    const data: BlogWithDetails[] = blogs.map((blog) => {
      let user_vote: "up" | "down" | null = null;
      if (
        userId &&
        blog.vote_user_mapping &&
        (blog.vote_user_mapping as any).length > 0
      ) {
        const userVote = (blog.vote_user_mapping as any)[0];
        if (userVote.is_up_vote) {
          user_vote = "up";
        } else if (userVote.is_down_vote) {
          user_vote = "down";
        }
      }

      // Group reactions
      const reactionsMap = new Map<number, number>();
      let user_reaction: number | null = null;

      blog.blog_reactions.forEach((r) => {
        reactionsMap.set(
          r.reaction_id,
          (reactionsMap.get(r.reaction_id) || 0) + 1,
        );
        if (userId && r.user_id === userId) {
          user_reaction = r.reaction_id;
        }
      });

      const reactions = Array.from(reactionsMap.entries()).map(
        ([reaction_id, count]) => ({
          reaction_id,
          count,
        }),
      );

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
        files: blog.blog_files.map((f) => ({
          id: f.id,
          file_url: f.file_url,
          file_name: f.file_name,
          file_size: f.file_size ? Number(f.file_size) : undefined,
          file_mime_type: f.file_mime_type || undefined,
          created_at: f.created_at || undefined,
        })),
        user_vote,
        user_reaction,
        reactions,
        comment_count: blog._count.comments,
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
   * Get blog by ID with full details
   */
  async getBlogById(
    id: number,
    userId?: number,
  ): Promise<BlogWithDetails | null> {
    const blog = await prisma.blogs.findUnique({
      where: { id, is_deleted: false },
      include: {
        users: { select: { name: true } },
        blog_tags_mapping: { include: { tags: true } },
        blog_files: true,
        blog_reactions: true,
        _count: {
          select: {
            comments: true,
          },
        },
        ...(userId && {
          vote_user_mapping: {
            where: { user_id: userId },
            select: { is_up_vote: true, is_down_vote: true },
          },
        }),
      },
    });

    if (!blog) {
      return null;
    }

    let user_vote: "up" | "down" | null = null;
    if (
      userId &&
      blog.vote_user_mapping &&
      (blog.vote_user_mapping as any).length > 0
    ) {
      const userVote = (blog.vote_user_mapping as any)[0];
      if (userVote.is_up_vote) {
        user_vote = "up";
      } else if (userVote.is_down_vote) {
        user_vote = "down";
      }
    }

    // Group reactions
    const reactionsMap = new Map<number, number>();
    let user_reaction: number | null = null;

    blog.blog_reactions.forEach((r) => {
      reactionsMap.set(
        r.reaction_id,
        (reactionsMap.get(r.reaction_id) || 0) + 1,
      );
      if (userId && r.user_id === userId) {
        user_reaction = r.reaction_id;
      }
    });

    const reactions = Array.from(reactionsMap.entries()).map(
      ([reaction_id, count]) => ({
        reaction_id,
        count,
      }),
    );

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
      files: blog.blog_files.map((f) => ({
        id: f.id,
        file_url: f.file_url,
        file_name: f.file_name,
        file_size: f.file_size ? Number(f.file_size) : undefined,
        file_mime_type: f.file_mime_type || undefined,
        created_at: f.created_at || undefined,
      })),
      user_vote,
      user_reaction,
      reactions,
      comment_count: blog._count.comments,
    };
  }

  /**
   * Update a blog (user can only update their own)
   */
  async updateBlog(
    id: number,
    input: BlogUpdateInput,
    userId: number,
  ): Promise<Blog> {
    const { title, description, is_deleted, tags, files = [] } = input;

    const blog = await prisma.blogs.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Only allow owner to update (unless is_deleted is being set by admin, validation done in controller)
    if (blog.user_id !== userId && is_deleted === undefined) {
      throw new Error("You can only update your own blogs");
    }

    const updatedBlog = await prisma.blogs.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(is_deleted !== undefined && { is_deleted }),
      },
    });

    // Handle tag updates if provided
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.blog_tags_mapping.deleteMany({
        where: { blog_id: id },
      });

      // Add new tags
      if (tags.length > 0) {
        for (const tag_id of tags) {
          await prisma.blog_tags_mapping.create({
            data: {
              blog_id: id,
              tag_id,
            },
          });
        }
      }
    }

    // Handle file updates if provided
    if (files && files.length > 0) {
      for (const file of files) {
        const existingFile = await prisma.blog_files.findFirst({
          where: {
            blog_id: id,
            file_url: file.file_url,
          },
        });

        if (existingFile) {
          await prisma.blog_files.update({
            where: { id: existingFile.id },
            data: {
              file_name: file.file_name,
              file_size: file.file_size ? Number(file.file_size) : 0,
              file_mime_type: file.file_mime_type || "application/octet-stream",
            },
          });
        } else {
          await prisma.blog_files.create({
            data: {
              blog_id: id,
              file_url: file.file_url,
              file_name: file.file_name,
              file_size: file.file_size ? Number(file.file_size) : 0,
              file_mime_type: file.file_mime_type || "application/octet-stream",
            },
          });
        }
      }
    }

    return updatedBlog as Blog;
  }

  /**
   * Soft delete a blog (user can only delete their own)
   */
  async deleteBlog(id: number, userId: number, userRole?: string): Promise<void> {
    const blog = await prisma.blogs.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (
      blog.user_id !== userId &&
      userRole !== "ADMIN" &&
      userRole !== "FACULTY" &&
      userRole !== "SUPER_ADMIN"
    ) {
      throw new Error("You can only delete your own blogs");
    }

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
  async voteBlog(
    blog_id: number,
    user_id: number,
    is_up_vote: boolean,
  ): Promise<VoteResponse> {
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
      } else {
        // No active vote (both false) - treat as new vote
        if (is_up_vote) {
          new_is_up_vote = true;
          upVoteChange = 1;
        } else {
          new_is_down_vote = true;
          downVoteChange = 1;
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

  /**
   * React to a blog
   */
  async reactBlog(
    blog_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<void> {
    const existingReaction = await prisma.blog_reactions.findFirst({
      where: {
        blog_id,
        user_id,
      },
    });

    if (existingReaction) {
      if (existingReaction.reaction_id === reaction_id) {
        // Toggle off if same reaction
        await prisma.blog_reactions.delete({
          where: { id: existingReaction.id },
        });
      } else {
        // Update if different reaction
        await prisma.blog_reactions.update({
          where: { id: existingReaction.id },
          data: { reaction_id },
        });
      }
    } else {
      // Create new reaction
      await prisma.blog_reactions.create({
        data: {
          blog_id,
          user_id,
          reaction_id,
        },
      });
    }
  }

  /**
   * Get all blogs for admin with email search capability
   */
  async getAdminBlogs(
    page: number = 1,
    limit: number = 10,
    search_email?: string,
    sort_by: "latest" | "oldest" = "latest",
  ): Promise<PaginatedResponse<BlogWithDetailsAdmin>> {
    const offset = (page - 1) * limit;

    // Build where clause
    let where: any = { is_deleted: false };

    if (search_email) {
      where = {
        ...where,
        users: {
          email: { contains: search_email, mode: "insensitive" },
        },
      };
    }

    // Build order clause
    const orderBy: any =
      sort_by === "oldest" ? { created_at: "asc" } : { created_at: "desc" };

    // Get total count
    const total = await prisma.blogs.count({ where });

    // Get blogs with user details including email
    const blogs = await prisma.blogs.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        users: { select: { name: true, email: true } },
        blog_tags_mapping: { include: { tags: true } },
        blog_files: true,
        blog_reactions: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Map to admin response format
    const data: BlogWithDetailsAdmin[] = blogs.map((blog) => {
      // Group reactions
      const reactionsMap = new Map<number, number>();
      blog.blog_reactions.forEach((r) => {
        reactionsMap.set(
          r.reaction_id,
          (reactionsMap.get(r.reaction_id) || 0) + 1,
        );
      });
      const reactions = Array.from(reactionsMap.entries()).map(
        ([reaction_id, count]) => ({
          reaction_id,
          count,
        }),
      );

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
        user_email: blog.users.email,
        tags: (blog.blog_tags_mapping as any[]).map((mapping) => ({
          id: mapping.tags.id,
          name: mapping.tags.name,
        })),
        files: blog.blog_files.map((f) => ({
          id: f.id,
          file_url: f.file_url,
          file_name: f.file_name,
          file_size: f.file_size ? Number(f.file_size) : undefined,
          file_mime_type: f.file_mime_type || undefined,
          created_at: f.created_at || undefined,
        })),
        user_vote: null,
        user_reaction: null,
        reactions,
        comment_count: blog._count.comments,
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
   * Admin delete blog - can delete any blog regardless of ownership
   */
  async adminDeleteBlog(id: number): Promise<void> {
    const blog = await prisma.blogs.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    await prisma.blogs.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });
  }
}

export const blogService = new BlogService();
