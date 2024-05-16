import axios from 'axios';
import { Navigate } from 'react-router-dom';

let user = null;

export function isAuthenticated() {
  return localStorage.getItem('access' !== null);
}


export function setAccessToken(access) {
  localStorage.setItem('access', access);
}

export function setRefreshToken(refresh) {
  localStorage.setItem('refresh', refresh);
}

export function logout() {
  if (!localStorage.getItem('access') || !localStorage.getItem('refresh')) {
    return;
  }
  localStorage.removeItem('refresh');
  localStorage.removeItem('access');
  return <Navigate to="./pages/Login" replace />;
}

// Function to perform refresh token API call
export async function refreshToken() {
  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/');
    setAccessToken(response.data.access)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Refresh token failed: The refresh token is invlaid or expired');
      throw error;
    } else {
      console.error('Refresh token failed:', error);
      throw error; // Propagate the error for interceptor to handle
    }
  }
}

