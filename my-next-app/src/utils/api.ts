import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:5000/api";

interface User {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

// Signup user
export const signupUser = (user: User) =>
  axios.post(`${API_BASE_URL}/auth/signup`, user);

// Login user
export const loginUser = (email: string, password: string) =>
  axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password });

// Upload resume
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);
  return axios.post<{ skills: string[] }>(`${API_BASE_URL}/resume/upload`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Fetch recommended jobs
export const fetchJobs = (): Promise<AxiosResponse<Job[]>> =>
    axios.post<Job[]>(
      `${API_BASE_URL}/jobs/recommend`,
      {}, // Empty body (if no data is required)
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );