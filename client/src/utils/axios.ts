import axios from "axios";
import type {
  AddBlogPayload,
  AddCommentPayload,
  UpdateCommentPayload,
  VotePayload,
  ReactionPayload,
} from "../types/pages/interviewExperiance/apiTypes";

export const BASE_URL = "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: async (loginData: any) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  },
  logout: async () => {
    // Assuming logout endpoint exists or handling client-side only
    // const response = await axiosInstance.post("/auth/logout");
    // return response.data;
  },
};

export const studentsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/students");
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await axiosInstance.get("/dashboard/stats");
    return response.data;
  },
};

export const problemsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/problem/get-all-problems");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(
      `/problem/get-problem-by-id/${id}`,
    );
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post("/problem/create-problem", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await axiosInstance.put(
      `/problem/update-problem/${id}`,
      data,
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(
      `/problem/delete-problem/${id}`,
    );
    return response.data;
  },
};

export const leaderboardAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/leaderboard");
    return response.data;
  },
};

export const blogsAPI = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    tag_id?: number;
    sort_by?: "latest" | "oldest" | "most_upvoted";
  }) => {
    const response = await axiosInstance.get("/blogs", { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data;
  },
  create: async (data: AddBlogPayload | FormData) => {
    const response = await axiosInstance.post("/blogs", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  },
  update: async (id: number, data: any | FormData) => {
    const response = await axiosInstance.put(`/blogs/${id}`, data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },
  vote: async (data: VotePayload) => {
    const response = await axiosInstance.post("/blogs/vote", data);
    return response.data;
  },
};

export const commentsAPI = {
  getByBlogId: async (
    blogId: number,
    params: { page?: number; limit?: number },
  ) => {
    const response = await axiosInstance.get(`/blogs/${blogId}/comments`, {
      params,
    });
    return response.data;
  },
  create: async (data: AddCommentPayload) => {
    const response = await axiosInstance.post("/blogs/comments", data);
    return response.data;
  },
  update: async (id: number, data: UpdateCommentPayload) => {
    const response = await axiosInstance.put(`/blogs/comments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/blogs/comments/${id}`);
    return response.data;
  },
};

export const reactionsAPI = {
  getBlogReactions: async (blogId: number) => {
    const response = await axiosInstance.get(`/reactions/blog/${blogId}`);
    return response.data;
  },
  addBlogReaction: async (data: ReactionPayload) => {
    const response = await axiosInstance.post("/reactions/blog/add", data);
    return response.data;
  },
  removeBlogReaction: async (data: ReactionPayload) => {
    const response = await axiosInstance.post("/reactions/blog/remove", data);
    return response.data;
  },
  getCommentReactions: async (commentId: number) => {
    const response = await axiosInstance.get(`/reactions/comment/${commentId}`);
    return response.data;
  },
  addCommentReaction: async (data: ReactionPayload) => {
    const response = await axiosInstance.post("/reactions/comment/add", data);
    return response.data;
  },
  removeCommentReaction: async (data: ReactionPayload) => {
    const response = await axiosInstance.post(
      "/reactions/comment/remove",
      data,
    );
    return response.data;
  },
};

export const tagsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/tags");
    return response.data;
  },
  create: async (name: string) => {
    const response = await axiosInstance.post("/tags/create", { name });
    return response.data;
  },
};

// Admin APIs for Interview Experience
export const adminBlogsAPI = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    search_email?: string;
    sort_by?: "latest" | "oldest";
  }) => {
    const response = await axiosInstance.get(
      "/interview-experience/admin/blogs",
      { params },
    );
    return response;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(
      `/interview-experience/admin/blogs/${id}`,
    );
    return response.data;
  },
};

export const adminCommentsAPI = {
  delete: async (id: number) => {
    const response = await axiosInstance.delete(
      `/interview-experience/admin/comments/${id}`,
    );
    return response.data;
  },
};
