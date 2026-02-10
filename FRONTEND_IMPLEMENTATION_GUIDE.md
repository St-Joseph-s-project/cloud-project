# Frontend Implementation Guide

## Overview
This guide provides code snippets and instructions to complete the frontend implementation for:
1. Reactions System (Like button)
2. File Upload UI
3. Edit Functionality for Blogs and Comments
4. Move Voting UI from Modal to Blog Card

---

## 1. Blog Card Component Changes

Move voting and add reactions to the blog card. Update the blog card in `InterviewExperiance.tsx`:

```tsx
// Inside the blog card JSX (around line 257-280)

{/* Footer: votes & reactions */}
<div className="flex items-center gap-3 pt-3 border-t border-gray-100">
  {/* Like/Reaction Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleReaction(blog.id, 1); // reaction_id=1 for Like
    }}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      blog.isUserReacted ? "bg-red-100 text-red-600" : "bg-gray-50 text-gray-600 hover:bg-red-50"
    }`}
  >
    <svg className="w-4 h-4" fill={blog.isUserReacted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <span>{blog.reactionCount || 0}</span>
  </button>

  {/* Upvote Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleVote(blog.id, true);
    }}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      blog.user_vote === "up"
        ? "bg-green-100 text-green-700"
        : "bg-gray-50 text-gray-600 hover:bg-green-50"
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
    <span>{blog.up_vote}</span>
  </button>

  {/* Downvote Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleVote(blog.id, false);
    }}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      blog.user_vote === "down"
        ? "bg-red-100 text-red-700"
        : "bg-gray-50 text-gray-600 hover:bg-red-50"
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
    <span>{blog.down_vote}</span>
  </button>

  {/* Edit Button */}
  {blog.user_id === currentUserId && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openEditBlog(blog);
      }}
      className="ml-auto p-1.5 rounded-md hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors"
      title="Edit blog"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  )}
</div>
```

### Add State and Handlers in InterviewExperiance.tsx

```tsx
import { useState } from "react";
import { blogsAPI, reactionsAPI } from "../../utils/axios";

// Inside component state
const [blogs, setBlogs] = useState<BlogType[]>([]);
const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
const [editModalOpen, setEditModalOpen] = useState(false);
const [currentUserId, setCurrentUserId] = useState<number | null>(null);

// Get current user ID from auth context/localStorage
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) setCurrentUserId(Number(userId));
}, []);

// Handle Reaction
const handleReaction = async (blogId: number, reactionId: number) => {
  try {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;

    // Optimistic update
    setBlogs(prev =>
      prev.map(b =>
        b.id === blogId
          ? {
              ...b,
              isUserReacted: !b.isUserReacted,
              reactionCount: b.isUserReacted ? (b.reactionCount || 0) - 1 : (b.reactionCount || 0) + 1
            }
          : b
      )
    );

    // API call
    if (blog.isUserReacted) {
      await reactionsAPI.removeBlogReaction({ blog_id: blogId, reaction_id: reactionId });
    } else {
      await reactionsAPI.addBlogReaction({ blog_id: blogId, reaction_id: reactionId });
    }
  } catch (error) {
    console.error("Failed to toggle reaction", error);
    // Refresh blogs to sync state
    fetchBlogs();
  }
};

// Handle Vote (from blog card)
const handleVote = async (blogId: number, isUpVote: boolean) => {
  try {
    const res = await blogsAPI.vote({ blog_id: blogId, is_up_vote: isUpVote });
    handleVoteUpdate(blogId, res.up_vote, res.down_vote, res.user_vote);
  } catch (error) {
    console.error("Failed to vote", error);
  }
};

// Open edit blog
const openEditBlog = (blog: BlogType) => {
  setEditingBlog(blog);
  setEditModalOpen(true);
};
```

---

## 2. Update Blog Card to Load Reactions

Fetch reactions when blog loads or card renders:

```tsx
// Inside getBlogs useEffect or card component
useEffect(() => {
  const loadReactions = async () => {
    try {
      const blogsWithReactions = await Promise.all(
        blogs.map(async (blog) => {
          const reactions = await reactionsAPI.getBlogReactions(blog.id);
          const likeReaction = reactions.find((r: any) => r.reaction_id === 1);
          return {
            ...blog,
            reactionCount: likeReaction?.count || 0,
            isUserReacted: likeReaction?.user_reacted || false,
          };
        })
      );
      setBlogs(blogsWithReactions);
    } catch (error) {
      console.error("Failed to load reactions", error);
    }
  };

  if (blogs.length > 0) {
    loadReactions();
  }
}, [page, debouncedSearch, selectedTagId, sortBy]);
```

---

## 3. Update Add Blog Modal with File Upload

Update `AddBlogModel.tsx`:

```tsx
import { canUpload } from "../../../types/pages/interviewExperiance/apiTypes";

interface AddBlogModelProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogAdded: () => void;
  canUpload: boolean; // Pass from parent
}

const AddBlogModel: React.FC<AddBlogModelProps> = ({
  isOpen,
  onClose,
  onBlogAdded,
  canUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files).slice(0, 5)); // Max 5 files
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use FormData for multipart upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    selectedTags.forEach((tagId) => {
      formData.append("tags", String(tagId));
    });
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await blogsAPI.create(formData);
      toast.success("Blog created successfully!");
      onBlogAdded();
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to create blog");
    }
  };

  return (
    <div className="..." onClick={handleOverlayClick}>
      <div className="...">
        {/* ... existing fields ... */}

        {/* File Upload Section - Only if canUpload */}
        {canUpload && (
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files (Optional)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max 5 files, formats: PDF, DOC, DOCX, TXT, JPG, PNG
            </p>

            {/* File List */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={() =>
                        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ... existing buttons ... */}
      </div>
    </div>
  );
};
```

---

## 4. Add Edit Blog Modal

Create a new component `EditBlogModal.tsx`:

```tsx
import React, { useState, useEffect } from "react";
import type { BlogType } from "../../../types/pages/interviewExperiance/apiTypes";
import { blogsAPI, tagsAPI } from "../../../utils/axios";
import toast from "react-hot-toast";

interface EditBlogModalProps {
  blog: BlogType | null;
  isOpen: boolean;
  onClose: () => void;
  onBlogUpdated: () => void;
  canUpload: boolean;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  blog,
  isOpen,
  onClose,
  onBlogUpdated,
  canUpload,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setSelectedTags(blog.tags?.map((t) => t.id) || []);
      setSelectedFiles([]);
    }
  }, [blog]);

  useEffect(() => {
    tagsAPI
      .getAll()
      .then((res) => setAllTags(res || []))
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !title.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      selectedTags.forEach((tagId) => {
        formData.append("tags", String(tagId));
      });
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      await blogsAPI.update(blog.id, formData);
      toast.success("Blog updated successfully!");
      onBlogUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !blog) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Edit Blog</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Files */}
          {canUpload && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add More Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
```

---

## 5. Update Blog Modal for Comments with Edit Support

Update `BlogModel.tsx` to include edit capabilities:

```tsx
const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
const [editingCommentText, setEditingCommentText] = useState("");

const handleEditComment = (comment: CommentType) => {
  setEditingCommentId(comment.id);
  setEditingCommentText(comment.comment);
};

const handleSaveComment = async (commentId: number) => {
  try {
    await commentsAPI.update(commentId, {
      comment: editingCommentText,
    });
    toast.success("Comment updated!");
    setEditingCommentId(null);
    fetchComments(commentPage);
  } catch (error) {
    toast.error("Failed to update comment");
  }
};

// In the comment list rendering:
{comments.map((c) => (
  <div key={c.id} className="flex gap-3 group">
    {/* ... user info ... */}
    {editingCommentId === c.id ? (
      <div className="flex-1">
        <textarea
          value={editingCommentText}
          onChange={(e) => setEditingCommentText(e.target.value)}
          className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          rows={2}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSaveComment(c.id)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => setEditingCommentId(null)}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-800">{c.user_name}</span>
          <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
          {isAdmin && onDeleteComment && (
            <button onClick={() => handleDeleteComment(c.id)} className="...">
              {/* Delete button */}
            </button>
          )}
          {c.user_id === currentUserId && (
            <button
              onClick={() => handleEditComment(c)}
              className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-blue-500 hover:text-blue-700"
            >
              ✏️
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">{c.comment}</p>
      </div>
    )}
  </div>
))}
```

---

## 6. Add Reactions to Comment Modal

Add reactions display in the BlogModel comment section:

```tsx
import { reactionsAPI } from "../../../utils/axios";

const [commentReactions, setCommentReactions] = useState<Record<number, any>>({});

const loadCommentReactions = async (commentId: number) => {
  try {
    const reactions = await reactionsAPI.getCommentReactions(commentId);
    setCommentReactions((prev) => ({
      ...prev,
      [commentId]: reactions,
    }));
  } catch (error) {
    console.error("Failed to load comment reactions", error);
  }
};

const handleCommentReaction = async (commentId: number) => {
  try {
    const likeReaction = commentReactions[commentId]?.find(
      (r: any) => r.reaction_id === 1
    );

    if (likeReaction?.user_reacted) {
      await reactionsAPI.removeCommentReaction({
        comment_id: commentId,
        reaction_id: 1,
      });
    } else {
      await reactionsAPI.addCommentReaction({
        comment_id: commentId,
        reaction_id: 1,
      });
    }

    // Reload reactions
    loadCommentReactions(commentId);
  } catch (error) {
    console.error("Failed to toggle reaction", error);
  }
};

// In comment rendering, add reaction button:
<div className="mt-2 flex items-center gap-2">
  <button
    onClick={() => handleCommentReaction(c.id)}
    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
      commentReactions[c.id]?.[0]?.user_reacted
        ? "bg-red-100 text-red-600"
        : "bg-gray-100 text-gray-600 hover:bg-red-100"
    }`}
  >
    ❤️ {commentReactions[c.id]?.[0]?.count || 0}
  </button>
</div>
```

---

## 7. Update InterviewExperiance.tsx to Pass canUpload

```tsx
import { useAuth } from "../../context/AuthContext"; // Or where you manage auth

const { user, can_upload } = useAuth(); // Get canUpload from auth context

return (
  <>
    <AddBlogModel
      isOpen={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onBlogAdded={fetchBlogs}
      canUpload={can_upload || false}
    />

    <EditBlogModal
      blog={editingBlog}
      isOpen={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      onBlogUpdated={fetchBlogs}
      canUpload={can_upload || false}
    />
  </>
);
```

---

## Implementation Checklist

- [ ] Update Blog Card with reactions and voting
- [ ] Add reaction handlers in InterviewExperiance
- [ ] Update AddBlogModel with file upload
- [ ] Create EditBlogModal component
- [ ] Update BlogModel for comment editing
- [ ] Add comment reactions to BlogModel
- [ ] Load reactions when blogs/comments fetch
- [ ] Get `can_upload` from auth context and pass to modals
- [ ] Handle FormData for file uploads
- [ ] Test all reactions functionality
- [ ] Test file uploads (only for mentors)
- [ ] Test blog edit (only for own blogs)
- [ ] Test comment edit (only for own comments)
- [ ] Optimistic UI updates for reactions

---

## Notes

- Always use `e.stopPropagation()` on card buttons to prevent opening the blog
- Wrap file operations in FormData when files are present
- Use optimistic UI updates for better UX
- Handle errors gracefully with toast notifications
- The `can_upload` attribute comes from `req.user` in backend
- Store `userId` in localStorage during login for ownership checks
- Reaction ID 1 is for "Like" - use this in all reaction calls

