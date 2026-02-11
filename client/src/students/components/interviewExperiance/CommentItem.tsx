import React, { useState } from "react";
import type { CommentType } from "../../../types/pages/interviewExperiance/apiTypes";
import { commentsAPI, reactionsAPI } from "../../../utils/axios";
import { AiOutlineEdit } from "react-icons/ai";
import ReactionSelector from "./ReactionSelector";
import toast from "react-hot-toast";

interface CommentItemProps {
    comment: CommentType;
    userId?: number;
    isAdmin?: boolean;
    onDelete: (commentId: number) => Promise<void>;
    onReactionUpdate?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    userId,
    isAdmin,
    onDelete,
    onReactionUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.comment);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<CommentType[]>(comment.replies || []);
    const [replyPage, setReplyPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [isReplying, setIsReplying] = useState(false);


    const [localReaction, setLocalReaction] = useState({
        user_reaction: comment.user_reaction,
        reactionCount: comment.reactionCount || 0,
        isUserReacted: comment.isUserReacted,
    });

    React.useEffect(() => {
        setLocalReaction({
            user_reaction: comment.user_reaction,
            reactionCount: comment.reactionCount || 0,
            isUserReacted: comment.isUserReacted,
        });
    }, [comment]);

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

    const handleUpdate = async () => {
        if (!editText.trim()) return;
        setSavingEdit(true);
        try {
            await commentsAPI.update(comment.id, { comment: editText.trim() });
            toast.success("Comment updated");
            setIsEditing(false);
            if (onReactionUpdate) onReactionUpdate();
        } catch {
            toast.error("Failed to update comment");
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        setDeleting(true);
        try {
            await onDelete(comment.id);
        } finally {
            setDeleting(false);
        }
    };

    const handleReaction = async (reactionId: number) => {
        const isSameReaction = localReaction.user_reaction === reactionId;

        setLocalReaction(prev => {
            let newCount = prev.reactionCount;
            if (isSameReaction) {
                newCount = Math.max(0, newCount - 1);
            } else if (!prev.user_reaction) {
                newCount = newCount + 1;
            }
            return {
                isUserReacted: !isSameReaction,
                user_reaction: isSameReaction ? null : reactionId,
                reactionCount: newCount
            };
        });

        try {
            if (isSameReaction) {
                await reactionsAPI.removeCommentReaction({
                    comment_id: comment.id,
                    reaction_id: reactionId,
                });
            } else {
                await reactionsAPI.addCommentReaction({
                    comment_id: comment.id,
                    reaction_id: reactionId,
                });
            }
        } catch (err) {
            console.error("Failed to react", err);
            if (onReactionUpdate) onReactionUpdate();
        }
    };

    const processCommentRecursively = (c: any): CommentType => {
        const reactionCount = (c.reactions || []).reduce(
            (acc: number, r: any) => acc + r.count,
            0,
        );
        const isUserReacted = !!c.user_reaction;

        // Recursively process nested replies if they exist
        const processedReplies = c.replies ? c.replies.map((reply: any) => processCommentRecursively(reply)) : [];

        return {
            ...c,
            reactionCount,
            isUserReacted,
            replies: processedReplies,
        };
    };

    const fetchReplies = async (page: number) => {
        setLoadingReplies(true);
        try {
            const res = await commentsAPI.getReplies(comment.id, { page, limit: 3 });
            const fetched = res.data.data || [];
            const processed = fetched.map((c: any) => processCommentRecursively(c));

            if (page === 1) {
                setReplies(processed);
            } else {
                setReplies(prev => [...prev, ...processed]);
            }
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch replies", err);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleLoadReplies = () => {
        if (!showReplies) {
            setShowReplies(true);
            fetchReplies(1);
        } else {
            if (replyPage < totalPages) {
                const nextPage = replyPage + 1;
                setReplyPage(nextPage);
                fetchReplies(nextPage);
            } else {
                setShowReplies(false);
                setReplyPage(1);
            }
        }
    };

    const handleSubmitReply = async () => {
        if (!userId || !replyText.trim()) return;
        setSubmittingReply(true);
        try {
            await commentsAPI.create({
                blog_id: comment.blog_id,
                comment: replyText.trim(),
                parent_id: comment.id
            });
            toast.success("Reply added");
            setReplyText("");
            setIsReplying(false);
            if (!showReplies) setShowReplies(true);
            setReplyPage(1);
            fetchReplies(1);
        } catch {
            toast.error("Failed to add reply");
        } finally {
            setSubmittingReply(false);
        }
    };

    return (
        <div className="flex gap-3 group">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                {comment.user_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                        {comment.user_name}
                    </span>
                    <span className="text-xs text-gray-400">
                        {timeAgo(comment.created_at)}
                    </span>

                    <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {userId && userId === comment.user_id && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-all"
                                title="Edit"
                            >
                                <AiOutlineEdit className="w-4 h-4" />
                            </button>
                        )}

                        {(isAdmin || (userId && userId === comment.user_id)) && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                                title="Delete"
                            >
                                {deleting ? (
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

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                disabled={savingEdit || !editText.trim()}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {savingEdit ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(comment.comment);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {comment.comment}
                    </p>
                )}

                <div className="flex items-center gap-4 mt-2">
                    <ReactionSelector
                        currentReaction={localReaction.user_reaction as any}
                        reactionCount={localReaction.reactionCount}
                        onSelect={handleReaction}
                    />

                    {userId && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            Reply
                        </button>
                    )}

                    {((comment.reply_count && comment.reply_count > 0) || replies.length > 0) && (
                        <button
                            onClick={handleLoadReplies}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                        >
                            {showReplies && replies.length > 0 ? (
                                (replyPage < totalPages) ? `Load more replies` : (loadingReplies ? "Loading..." : "Hide replies")
                            ) : (
                                `${comment.reply_count || ""} replies`
                            )}
                        </button>
                    )}
                </div>

                {isReplying && (
                    <div className="mt-3 flex gap-2">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            rows={1}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <button
                            onClick={handleSubmitReply}
                            disabled={submittingReply || !replyText.trim()}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            Reply
                        </button>
                    </div>
                )}

                {showReplies && replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-4">
                        {replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                userId={userId}
                                isAdmin={isAdmin}
                                onDelete={async (id) => {
                                    if (userId === reply.user_id || isAdmin) {
                                        await commentsAPI.delete(id);
                                        setReplies(prev => prev.filter(r => r.id !== id));
                                        toast.success("Reply deleted");
                                    }
                                }}
                            />
                        ))}
                        {loadingReplies && <div className="text-xs text-center text-gray-400 py-1">Loading...</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
