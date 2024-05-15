import axios from 'axios';
import { refreshToken, logout } from './auth'; // Import your authentication functions

const BASE_URL = 'http://localhost:8000/api'; // Your API base URL

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Adjust as needed
});

// Request interceptor to attach the access token to each request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken(); // Call your refresh token function
        return api(originalRequest);
      } catch (refreshError) {
        logout(); // Call your logout function
        window.location.href = '/login'; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
