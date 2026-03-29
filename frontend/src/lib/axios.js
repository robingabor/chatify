import axios from "axios";

export const axiosInstance = axios.create({
  // the baseUrl is point to the backend server api
  // import.meta.env.MODE is a special variable that is provided by Vite
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api" 
    : "https://chatifyprivv.vercel.app/api",
  // lets include the cookies in the request to the backend for authentication
  withCredentials: true,
});