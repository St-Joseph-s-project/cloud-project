import { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import AddBlogModel from "../components/interviewExperiance/AddBlogModel";
import BlogModel from "../components/interviewExperiance/BlogModel";
import type { BlogType, Tag } from "../../types/pages/interviewExperiance/apiTypes";
import { blogsAPI, tagsAPI } from "../../utils/axios";

const BLOGS_PER_PAGE = 6;

export default function InterviewExperiance() {
  // Blog list state
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "most_upvoted">("latest");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewBlog, setViewBlog] = useState<BlogType | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch tags once
  useEffect(() => {
    tagsAPI.getAll().then((res) => setAllTags(res.data || [])).catch(() => { });
  }, []);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogsAPI.getAll({
        page,
        limit: BLOGS_PER_PAGE,
        search: debouncedSearch || undefined,
        tag_id: selectedTagId,
        sort_by: sortBy,
      });
      setBlogs(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      console.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedTagId, sortBy]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // When filters change, reset page
  useEffect(() => {
    setPage(1);
  }, [selectedTagId, sortBy]);

  // Handle vote update from BlogModel
  const handleVoteUpdate = (blogId: number, upVote: number, downVote: number, userVote: "up" | "down" | null) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, up_vote: upVote, down_vote: downVote, user_vote: userVote } : b
      )
    );
    if (viewBlog && viewBlog.id === blogId) {
      setViewBlog({ ...viewBlog, up_vote: upVote, down_vote: downVote, user_vote: userVote });
    }
  };

  const openBlog = (blog: BlogType) => {
    setViewBlog(blog);
    setViewModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-0 py-0">
        <PageHeader
          title="Interview Experiences"
          description="Read and share interview experiences with the community"
        />

        {/* Toolbar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="most_upvoted">Most Upvoted</option>
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showFilters || selectedTagId
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {selectedTagId && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Add Blog button */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write Blog
            </button>
          </div>

          {/* Tag Filters */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Filter by Tag</span>
                {selectedTagId && (
                  <button
                    onClick={() => setSelectedTagId(undefined)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTagId(selectedTagId === tag.id ? undefined : tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedTagId === tag.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                      }`}
                  >
                    {tag.name}
                  </button>
                ))}
                {allTags.length === 0 && (
                  <span className="text-sm text-gray-400">No tags available</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Blog Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-600 mb-1">No blogs found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters or be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => openBlog(blog)}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
              >
                {/* Card header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {blog.user_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{blog.user_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(blog.created_at)}</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>

                {/* Description preview */}
                <p className="text-sm text-gray-500 line-clamp-3 mb-3 leading-relaxed">
                  {blog.description}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-500">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer: votes */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{blog.up_vote}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>{blog.down_vote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${page === p
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBlogModel
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onBlogAdded={fetchBlogs}
      />

      <BlogModel
        blog={viewBlog}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onVoteUpdate={handleVoteUpdate}
      />
    </div>
  );
}