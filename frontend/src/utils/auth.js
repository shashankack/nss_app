
import axios from 'axios';

let user = null;


export function setAccessToken(accessToken) {
  localStorage.setItem('accessToken', accessToken);
}

export function setRefreshToken(refreshToken) {
  localStorage.setItem('refreshToken', refreshToken);
}

export function logout() {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
}

// Function to perform refresh token API call
export async function refreshToken() {
  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/');
    setAccessToken(response.data.accesss)
  } catch (error) {
    console.error('Refresh token failed:', error);
    throw error; // Propagate the error for interceptor to handle
  }
}

