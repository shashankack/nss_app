import axios from 'axios';


let user = null;

export function isAuthenticated() {
  return localStorage.getItem('accessToken' !== null);
}

export function setAccessToken(access) {
  localStorage.setItem('accessToken', access);
}

export function setRefreshToken(refresh) {
  localStorage.setItem('refreshToken', refresh);
}

export function clearTokens() {
  if (localStorage.getItem('accessToken')) {
    localStorage.removeItem('accessToken');
  }
  if (localStorage.getItem('refreshToken')) {
    localStorage.removeItem('refreshToken');
  }

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

