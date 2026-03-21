import axios from "axios";

import.meta.env.NODE_ENV === "development"
  ? console.log("Running in development mode")
  : console.log("Running in production mode");
export const axiosInstance = axios.create({
  baseURL: import.meta.env.NODE_ENV === "development" 
    ? "http://localhost:5000/api" 
    : "https://chatifyprivv.vercel.app/api",
  // lets include the cookies in the request to the backend for authentication
  withCredentials: true,
});