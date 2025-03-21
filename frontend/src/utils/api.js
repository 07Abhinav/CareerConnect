import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const loginUser = (email, password) => 
    axios.post(`${API_BASE_URL}/auth/login`, { email, password });

export const uploadResume = (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return axios.post(`${API_BASE_URL}/resume/upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};

export const fetchJobs = () => 
    axios.get(`${API_BASE_URL}/jobs/recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
