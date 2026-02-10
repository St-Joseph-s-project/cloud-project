import prisma from "../../../lib/prisma.ts";

export interface ReactionResponse {
  id: number;
  reaction_id: number;
  user_id: number;
  created_at?: Date;
}

export interface ReactionCountResponse {
  reaction_id: number;
  reaction_name: string;
  count: number;
  user_reacted: boolean;
}

export class ReactionService {
  /**
   * Add or toggle a reaction to a blog
   */
  async addBlogReaction(
    blog_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<ReactionResponse> {
    // Check if reaction exists
    const reaction = await prisma.reactions.findUnique({
      where: { id: reaction_id },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    // Check if blog exists
    const blog = await prisma.blogs.findUnique({
      where: { id: blog_id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if user already has this reaction on this blog
    const existingReaction = await prisma.blog_reactions.findFirst({
      where: {
        blog_id,
        user_id,
        reaction_id,
      },
    });

    if (existingReaction) {
      throw new Error("User already reacted with this reaction");
    }

    // Create reaction
    const blogReaction = await prisma.blog_reactions.create({
      data: {
        blog_id,
        user_id,
        reaction_id,
      },
    });

    return {
      id: blogReaction.id,
      reaction_id: blogReaction.reaction_id,
      user_id: blogReaction.user_id,
      created_at: blogReaction.created_at || undefined,
    };
  }

  /**
   * Remove a reaction from a blog
   */
  async removeBlogReaction(
    blog_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<void> {
    const reaction = await prisma.blog_reactions.findFirst({
      where: {
        blog_id,
        user_id,
        reaction_id,
      },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    await prisma.blog_reactions.delete({
      where: { id: reaction.id },
    });
  }

  /**
   * Get all reactions for a blog
   */
  async getBlogReactions(
    blog_id: number,
    user_id?: number,
  ): Promise<ReactionCountResponse[]> {
    // Check if blog exists
    const blog = await prisma.blogs.findUnique({
      where: { id: blog_id },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Get all reactions with counts
    const reactions = await prisma.reactions.findMany({
      include: {
        _count: {
          select: {
            blog_reactions: {
              where: { blog_id },
            },
          },
        },
      },
    });

    // Get user's reactions if user_id provided
    const userReactions = user_id
      ? await prisma.blog_reactions.findMany({
          where: {
            blog_id,
            user_id,
          },
          select: { reaction_id: true },
        })
      : [];

    const userReactionIds = new Set(userReactions.map((r) => r.reaction_id));

    return reactions.map((reaction) => ({
      reaction_id: reaction.id,
      reaction_name: reaction.reaction,
      count: reaction._count.blog_reactions,
      user_reacted: userReactionIds.has(reaction.id),
    }));
  }

  /**
   * Add a reaction to a comment
   */
  async addCommentReaction(
    comment_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<ReactionResponse> {
    // Check if reaction exists
    const reaction = await prisma.reactions.findUnique({
      where: { id: reaction_id },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    // Check if comment exists
    const comment = await prisma.comments.findUnique({
      where: { id: comment_id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user already has this reaction on this comment
    const existingReaction = await prisma.comment_reactions.findFirst({
      where: {
        comment_id,
        user_id,
        reaction_id,
      },
    });

    if (existingReaction) {
      throw new Error("User already reacted with this reaction");
    }

    // Create reaction
    const commentReaction = await prisma.comment_reactions.create({
      data: {
        comment_id,
        user_id,
        reaction_id,
      },
    });

    return {
      id: commentReaction.id,
      reaction_id: commentReaction.reaction_id,
      user_id: commentReaction.user_id,
      created_at: commentReaction.created_at || undefined,
    };
  }

  /**
   * Remove a reaction from a comment
   */
  async removeCommentReaction(
    comment_id: number,
    user_id: number,
    reaction_id: number,
  ): Promise<void> {
    const reaction = await prisma.comment_reactions.findFirst({
      where: {
        comment_id,
        user_id,
        reaction_id,
      },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    await prisma.comment_reactions.delete({
      where: { id: reaction.id },
    });
  }

  /**
   * Get all reactions for a comment
   */
  async getCommentReactions(
    comment_id: number,
    user_id?: number,
  ): Promise<ReactionCountResponse[]> {
    // Check if comment exists
    const comment = await prisma.comments.findUnique({
      where: { id: comment_id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Get all reactions with counts
    const reactions = await prisma.reactions.findMany({
      include: {
        _count: {
          select: {
            comment_reactions: {
              where: { comment_id },
            },
          },
        },
      },
    });

    // Get user's reactions if user_id provided
    const userReactions = user_id
      ? await prisma.comment_reactions.findMany({
          where: {
            comment_id,
            user_id,
          },
          select: { reaction_id: true },
        })
      : [];

    const userReactionIds = new Set(userReactions.map((r) => r.reaction_id));

    return reactions.map((reaction) => ({
      reaction_id: reaction.id,
      reaction_name: reaction.reaction,
      count: reaction._count.comment_reactions,
      user_reacted: userReactionIds.has(reaction.id),
    }));
  }
}

export const reactionService = new ReactionService();
