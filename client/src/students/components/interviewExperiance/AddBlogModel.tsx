import React, { useState, useEffect } from "react";
import type { Tag, AddBlogPayload } from "../../../types/pages/interviewExperiance/apiTypes";
import { blogsAPI, tagsAPI } from "../../../utils/axios";
import toast from "react-hot-toast";

interface AddBlogModelProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogAdded: () => void;
}

const AddBlogModel: React.FC<AddBlogModelProps> = ({ isOpen, onClose, onBlogAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const res = await tagsAPI.getAll();
      setAllTags(res.data || []);
    } catch {
      console.error("Failed to fetch tags");
    } finally {
      setLoadingTags(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload: AddBlogPayload = {
        title: title.trim(),
        description: description.trim(),
        tags: selectedTags,
      };
      await blogsAPI.create(payload);
      toast.success("Blog posted successfully!");
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setTagSearch("");
      onBlogAdded();
      onClose();
    } catch {
      toast.error("Failed to post blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Share Your Interview Experience</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Google SDE Interview Experience"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share the details of your interview experience..."
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {loadingTags ? (
                <p className="text-sm text-gray-400">Loading tags...</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {allTags
                    .filter((tag) => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                          }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  {allTags.filter((tag) => tag.name.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
                    <p className="text-sm text-gray-400">{allTags.length === 0 ? "No tags available" : "No matching tags"}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Posting..." : "Post Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModel;