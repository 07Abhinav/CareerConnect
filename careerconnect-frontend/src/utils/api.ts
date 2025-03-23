import axios from "axios";

// Dynamically set API URL from .env or fallback to localhost
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://35.193.73.53:5000/api" ||"http://localhost:8000/api",
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;