import { useState, useEffect, useCallback } from "react";
import { adminBlogsAPI, adminCommentsAPI } from "../../utils/axios";
import type { AdminBlogType } from "../../types/pages/interviewExperiance/apiTypes";
import BlogModel from "../../students/components/interviewExperiance/BlogModel";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ITEMS_PER_PAGE = 10;

export default function InterviewExperianceAdmin() {
  const [blogs, setBlogs] = useState<AdminBlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [selectedBlog, setSelectedBlog] = useState<AdminBlogType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchEmail);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchEmail]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminBlogsAPI.getAll({
        page,
        limit: ITEMS_PER_PAGE,
        search_email: debouncedSearch || undefined,
        sort_by: sortBy,
      });

      setBlogs(res.data.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotal(res.data.pagination?.total || 0);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blogId: number) => {
    try {
      await adminBlogsAPI.delete(blogId);
      toast.success("Blog deleted successfully");
      setIsModalOpen(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    await adminCommentsAPI.delete(commentId);
  };

  const handleRowClick = (blog: AdminBlogType) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleVoteUpdate = (
    blogId: number,
    upVote: number,
    downVote: number,
    userVote: "up" | "down" | null
  ) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? { ...b, up_vote: upVote, down_vote: downVote, user_vote: userVote }
          : b
      )
    );
    if (selectedBlog && selectedBlog.id === blogId) {
      setSelectedBlog((prev) =>
        prev ? { ...prev, up_vote: upVote, down_vote: downVote, user_vote: userVote } : null
      );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSort = () => {
    setSortBy((prev) => (prev === "latest" ? "oldest" : "latest"));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Interview Experiences
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all interview experience blogs posted by users
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-700">{total}</span> blogs
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronUpDownIcon className="h-5 w-5" />
          Sort: {sortBy === "latest" ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Votes
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    onClick={() => handleRowClick(blog)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                          {blog.user_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {blog.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {blog.user_email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium line-clamp-1 max-w-xs">
                        {blog.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(blog.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-600">↑ {blog.up_vote}</span>
                        <span className="text-red-500">↓ {blog.down_vote}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this blog?")) {
                            handleDelete(blog.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete blog"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogModel
        blog={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlog(null);
        }}
        onVoteUpdate={handleVoteUpdate}
        onDelete={handleDelete}
        onDeleteComment={handleDeleteComment}
        isAdmin={true}
      />
    </div>
  );
}