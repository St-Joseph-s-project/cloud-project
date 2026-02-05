import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});

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
    const response = await axiosInstance.get(`/problem/get-problem-by-id/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post("/problem/create-problem", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/problem/update-problem/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/problem/delete-problem/${id}`);
    return response.data;
  },
};

export const leaderboardAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/leaderboard");
    return response.data;
  },
};
