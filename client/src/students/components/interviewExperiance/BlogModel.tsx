import React, { useState, useEffect, useCallback } from "react";
import type {
  BlogType,
  CommentType,
} from "../../../types/pages/interviewExperiance/apiTypes";
import { commentsAPI, blogsAPI, reactionsAPI } from "../../../utils/axios";
import { AiOutlineLike, AiFillLike, AiOutlineEdit } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../hooks/store";
import AddBlogModel from "./AddBlogModel";

interface BlogModelProps {
  blog: BlogType | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteUpdate: (
    blogId: number,
    upVote: number,
    downVote: number,
    userVote: "up" | "down" | null,
  ) => void;
  onDelete?: (blogId: number) => void;
  onDeleteComment?: (commentId: number) => Promise<void>;
  isAdmin?: boolean;
}

const BlogModel: React.FC<BlogModelProps> = ({
  blog,
  isOpen,
  onClose,
  onVoteUpdate,
  onDelete,
  onDeleteComment,
  isAdmin = false,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  // Edit related state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [submittingEditComment, setSubmittingEditComment] = useState(false);

  const COMMENTS_PER_PAGE = 5;

  const fetchComments = useCallback(
    async (page: number) => {
      if (!blog) return;
      setLoadingComments(true);
      try {
        const res = await commentsAPI.getByBlogId(blog.id, {
          page,
          limit: COMMENTS_PER_PAGE,
        });
        const fetched = res.data.data || [];
        // enrich comments with reaction counts
        const enriched = await Promise.all(
          fetched.map(async (c: any) => {
            try {
              const r = await reactionsAPI.getCommentReactions(c.id);
              const likes = (r.data || []).find(
                (x: any) => x.reaction_id === 1,
              );
              return {
                ...c,
                reactionCount: likes?.count || 0,
                isUserReacted: !!likes?.user_reacted,
              };
            } catch {
              return { ...c, reactionCount: 0, isUserReacted: false };
            }
          }),
        );
        setComments(enriched);
        setCommentTotalPages(res.data.pagination?.totalPages || 1);
      } catch {
        console.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    },
    [blog],
  );

  useEffect(() => {
    if (isOpen && blog) {
      setCommentPage(1);
      setComments([]);
      setNewComment("");
      fetchComments(1);
    }
  }, [isOpen, blog, fetchComments]);

  useEffect(() => {
    if (isOpen && blog) {
      fetchComments(commentPage);
    }
  }, [commentPage, isOpen, blog, fetchComments]);

  // If blog changes while in edit mode, it means it's been updated by AddBlogModel.
  // We should refresh the view, which happens automatically via props.
  // But we need to close the edit modal if it's open.
  const handleBlogUpdated = () => {
    setIsEditingBlog(false);
    // Ideally the parent re-fetches the blog and passes the new prop down.
    // We can also trigger a refresh here if needed, but the parent handles blog list.
    // If the parent updates the 'blog' prop, this component will re-render.
  };

  const handleAddComment = async () => {
    if (!blog || !newComment.trim()) return;
    setSubmittingComment(true);
    try {
      await commentsAPI.create({
        blog_id: blog.id,
        comment: newComment.trim(),
      });
      toast.success("Comment added");
      setNewComment("");
      setCommentPage(1);
      fetchComments(1);
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVote = async (isUpVote: boolean) => {
    if (!blog || voting) return;
    setVoting(true);
    try {
      const res = await blogsAPI.vote({
        blog_id: blog.id,
        is_up_vote: isUpVote,
      });
      const updated = res.data;
      onVoteUpdate(
        blog.id,
        updated.up_vote,
        updated.down_vote,
        updated.user_vote,
      );
    } catch {
      toast.error("Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!blog || !onDelete || deleting) return;
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setDeleting(true);
    try {
      await onDelete(blog.id);
      onClose();
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!onDeleteComment || deletingCommentId) return;
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    setDeletingCommentId(commentId);
    try {
      await onDeleteComment(commentId);
      toast.success("Comment deleted");
      fetchComments(commentPage);
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const startEditingComment = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editCommentText.trim()) return;
    setSubmittingEditComment(true);
    try {
      await commentsAPI.update(editingCommentId, {
        comment: editCommentText.trim(),
      });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditCommentText("");
      // Refresh current page
      fetchComments(commentPage);
    } catch {
      toast.error("Failed to update comment");
    } finally {
      setSubmittingEditComment(false);
    }
  };

  const handleCommentReaction = async (commentId: number) => {
    const reactionId = 1;
    const c = comments.find((x) => x.id === commentId) as any;
    if (!c) return;

    // optimistic
    setComments((prev) =>
      prev.map((x) =>
        x.id === commentId
          ? {
            ...x,
            isUserReacted: !x.isUserReacted,
            reactionCount: x.isUserReacted
              ? x.reactionCount - 1
              : x.reactionCount + 1,
          }
          : x,
      ),
    );

    try {
      if (c.isUserReacted) {
        await reactionsAPI.removeCommentReaction({
          comment_id: commentId,
          reaction_id: reactionId,
        });
      } else {
        await reactionsAPI.addCommentReaction({
          comment_id: commentId,
          reaction_id: reactionId,
        });
      }
    } catch (err) {
      // rollback
      setComments((prev) =>
        prev.map((x) =>
          x.id === commentId
            ? {
              ...x,
              isUserReacted: c.isUserReacted,
              reactionCount: c.reactionCount,
            }
            : x,
        ),
      );
      console.error("Failed to toggle comment reaction", err);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateStr);
  };

  if (!isOpen || !blog) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                {blog.title}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {blog.user_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium text-gray-700">
                    {blog.user_name}
                  </span>
                </div>
                <span>·</span>
                <span>{formatDate(blog.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* Edit Button for Blog Owner */}
              {user && user.id === blog.user_id && (
                <button
                  onClick={() => setIsEditingBlog(true)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit blog"
                >
                  <AiOutlineEdit className="w-5 h-5" />
                </button>
              )}

              {isAdmin && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  title="Delete blog"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {blog.description}
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-5 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Comments
              </h3>

              {/* Add Comment */}
              <div className="flex gap-3 mb-5">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={submittingComment || !newComment.trim()}
                  className="self-end px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingComment ? "..." : "Post"}
                </button>
              </div>

              {/* Comment List */}
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c: any) => (
                    <div key={c.id} className="flex gap-3 group">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                        {c.user_name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-800">
                            {c.user_name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {timeAgo(c.created_at)}
                          </span>

                          <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Edit Comment Button */}
                            {user &&
                              user.id === c.user_id &&
                              editingCommentId !== c.id && (
                                <button
                                  onClick={() => startEditingComment(c)}
                                  className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                                  title="Edit comment"
                                >
                                  <AiOutlineEdit className="w-4 h-4" />
                                </button>
                              )}

                            {/* Delete Comment Button */}
                            {((isAdmin && onDeleteComment) ||
                              (user &&
                                user.id === c.user_id &&
                                onDeleteComment)) && (
                                <button
                                  onClick={() => handleDeleteComment(c.id)}
                                  disabled={deletingCommentId === c.id}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                                  title="Delete comment"
                                >
                                  {deletingCommentId === c.id ? (
                                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  )}
                                </button>
                              )}
                          </div>
                        </div>

                        {/* Comment Content or Edit Form */}
                        {editingCommentId === c.id ? (
                          <div className="mt-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleUpdateComment}
                                disabled={
                                  submittingEditComment ||
                                  !editCommentText.trim()
                                }
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                              >
                                {submittingEditComment ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEditingComment}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {c.comment}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleCommentReaction(c.id)}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors cursor-pointer ${c.isUserReacted ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-blue-50"}`}
                          >
                            {c.isUserReacted ? (
                              <AiFillLike className="w-4 h-4" />
                            ) : (
                              <AiOutlineLike className="w-4 h-4" />
                            )}
                            <span>{c.reactionCount || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Pagination */}
              {commentTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                  <button
                    onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                    disabled={commentPage <= 1}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {commentPage} of {commentTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCommentPage((p) => Math.min(commentTotalPages, p + 1))
                    }
                    disabled={commentPage >= commentTotalPages}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Blog Modal */}
      {isEditingBlog && (
        <AddBlogModel
          isOpen={isEditingBlog}
          onClose={() => setIsEditingBlog(false)}
          onBlogAdded={handleBlogUpdated}
          initialData={blog}
        />
      )}
    </>
  );
};

export default BlogModel;
