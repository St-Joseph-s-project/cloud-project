import prisma from "../../../lib/prisma.ts";
import type { Comment, CommentCreateInput, PaginatedResponse } from "../blogs/blogs.model.ts";

export class CommentService {
  /**
   * Add a comment to a blog
   */
  async addComment(input: CommentCreateInput, userId: number): Promise<Comment> {
    const { blog_id, comment } = input;

    if (!blog_id || !comment) {
      throw new Error("blog_id and comment are required");
    }

    // Verify blog exists
    const blog = await prisma.blogs.findUnique({
      where: { id: blog_id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    const createdComment = await prisma.comments.create({
      data: {
        user_id: userId,
        blog_id,
        comment,
      },
      include: {
        users: { select: { name: true } },
      },
    });

    return {
      id: createdComment.id,
      user_id: createdComment.user_id,
      blog_id: createdComment.blog_id,
      comment: createdComment.comment,
      created_at: createdComment.created_at || undefined,
      user_name: createdComment.users.name,
    };
  }

  /**
   * Get comments for a blog with pagination
   */
  async getComments(
    blog_id: number,
    page: number = 1,
    limit: number = 5
  ): Promise<PaginatedResponse<Comment>> {
    const offset = (page - 1) * limit;

    // Verify blog exists
    const blog = await prisma.blogs.findUnique({
      where: { id: blog_id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Get total count
    const total = await prisma.comments.count({
      where: { blog_id },
    });

    // Get comments
    const comments = await prisma.comments.findMany({
      where: { blog_id },
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit,
      include: {
        users: { select: { name: true } },
      },
    });

    // Map to response format
    const data: Comment[] = comments.map((comment) => ({
      id: comment.id,
      user_id: comment.user_id,
      blog_id: comment.blog_id,
      comment: comment.comment,
      created_at: comment.created_at || undefined,
      user_name: comment.users.name,
    }));

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
}

export const commentService = new CommentService();
