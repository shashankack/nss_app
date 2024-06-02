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

    // Check if error response status is 401 (Unauthorized)
    // and if the original request has not been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken(); // Call your refresh token function
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        await logout(); // Call your logout function
        window.location.href = '/login'; // Redirect to login page
      }
    }

    // If the error is not a 401 or the refresh attempt fails, reject the promise
    return Promise.reject(error);
  }
);

export default api;
