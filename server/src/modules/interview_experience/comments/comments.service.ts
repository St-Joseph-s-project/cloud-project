import prisma from "../../../lib/prisma.ts";
import type {
  Comment,
  CommentCreateInput,
  CommentUpdateInput,
  PaginatedResponse,
} from "../blogs/blogs.model.ts";

export class CommentService {
  /**
   * Add a comment to a blog
   */
  async addComment(
    input: CommentCreateInput,
    userId: number,
  ): Promise<Comment> {
    const { blog_id, comment } = input;

    if (!blog_id || !comment) {
      throw new Error("blog_id and comment are required");
    }

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
      user_reaction: null,
      reactions: [],
    };
  }

  /**
   * Get comments for a blog with pagination
   */
  async getComments(
    blog_id: number,
    page: number = 1,
    limit: number = 5,
    userId?: number,
  ): Promise<PaginatedResponse<Comment>> {
    const offset = (page - 1) * limit;

    const blog = await prisma.blogs.findUnique({
      where: { id: blog_id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    const total = await prisma.comments.count({
      where: { blog_id },
    });

    const comments = await prisma.comments.findMany({
      where: { blog_id },
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit,
      include: {
        users: { select: { name: true } },
        comment_reactions: true,
      },
    });

    // Map to response format
    const data: Comment[] = comments.map((comment) => {
      const reactionsMap = new Map<number, number>();
      let user_reaction: number | null = null;

      comment.comment_reactions.forEach((r) => {
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
        id: comment.id,
        user_id: comment.user_id,
        blog_id: comment.blog_id,
        comment: comment.comment,
        created_at: comment.created_at || undefined,
        user_name: comment.users.name,
        user_reaction,
        reactions,
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

  // Maintaining signature for backward compatibility but redirecting to new logic if needed
  // Or simply replace the old method with the new one if we update the controller too.
  // Let's update the original getComments signature to include userId optional.

  /**
   * Update a comment (user can only update their own)
   */
  async updateComment(
    comment_id: number,
    input: CommentUpdateInput,
    userId: number,
  ): Promise<Comment> {
    const { comment } = input;

    if (!comment || !comment.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    const existingComment = await prisma.comments.findUnique({
      where: { id: comment_id },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.user_id !== userId) {
      throw new Error("You can only update your own comments");
    }

    const updatedComment = await prisma.comments.update({
      where: { id: comment_id },
      data: {
        comment,
      },
      include: {
        users: { select: { name: true } },
        comment_reactions: true,
      },
    });

    return {
      id: updatedComment.id,
      user_id: updatedComment.user_id,
      blog_id: updatedComment.blog_id,
      comment: updatedComment.comment,
      created_at: updatedComment.created_at || undefined,
      user_name: updatedComment.users.name,
      user_reaction: null,
      reactions: [],
    };

  }

  /**
   * Delete a comment (user can only delete their own)
   */
  async deleteComment(
    commentId: number,
    userId: number,
    userRole?: string,
  ): Promise<void> {
    const comment = await prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (
      comment.user_id !== userId &&
      userRole !== "ADMIN" &&
      userRole !== "FACULTY" &&
      userRole !== "SUPER_ADMIN"
    ) {
      throw new Error("You can only delete your own comments");
    }

    await prisma.comments.delete({
      where: { id: commentId },
    });
  }

  /**
   * Admin delete comment - can delete any comment
   */
  async adminDeleteComment(commentId: number): Promise<void> {
    const comment = await prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    await prisma.comments.delete({
      where: { id: commentId },
    });
  }

  /**
   * React to a comment
   */
  async reactComment(
    comment_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<void> {
    const existingReaction = await prisma.comment_reactions.findFirst({
      where: {
        comment_id,
        user_id,
      },
    });

    if (existingReaction) {
      if (existingReaction.reaction_id === reaction_id) {
        // Toggle off if same reaction
        await prisma.comment_reactions.delete({
          where: { id: existingReaction.id },
        });
      } else {
        // Update if different reaction
        await prisma.comment_reactions.update({
          where: { id: existingReaction.id },
          data: { reaction_id },
        });
      }
    } else {
      // Create new reaction
      await prisma.comment_reactions.create({
        data: {
          comment_id,
          user_id,
          reaction_id,
        },
      });
    }
  }
}

export const commentService = new CommentService();

