import axios from "axios";

export const axiosInstance = axios.create({
  // the baseUrl is point to the backend server api
  // use the same host in production via relative path so Vercel routes /api to the backend function
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api" 
    : "/api",
  // lets include the cookies in the request to the backend for authentication
  withCredentials: true,
});