// api/axiosInstance.js
//
// WHAT: A single, pre-configured Axios instance used by every API file
//       (authApi, runApi, userApi) instead of importing axios directly.
// WHY: Keeps base URL, headers, and auth behaviour in one place. If the
//      backend URL or auth scheme ever changes, this is the only file
//      that needs to be touched.
//
// AUTH STRATEGY: The backend supports both an httpOnly cookie AND a Bearer
// token in the Authorization header (see backend/middleware/authMiddleware.js).
// We use the Bearer header approach here because it's simpler to reason
// about from the frontend and works the same in dev and production
// regardless of cookie/CORS settings. The token is kept in localStorage.

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // still send the cookie as a fallback
});

// --- Request interceptor: attach the JWT to every outgoing request -------
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: auto-logout if the token is invalid/expired ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const hadToken = Boolean(localStorage.getItem('token'));
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only force a redirect if we actually thought we were logged in.
      // This avoids bouncing the login page itself when credentials are wrong.
      if (hadToken && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
