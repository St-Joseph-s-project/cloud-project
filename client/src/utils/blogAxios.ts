import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});




