// api/authApi.js
//
// WHAT: All network calls related to authentication and the user's own
//       profile, matching backend/routes/authRoutes.js exactly.
// WHY: Keeps components free of raw axios calls (service layer pattern).

import axiosInstance from './axiosInstance';

// POST /api/auth/register
export const registerUser = (payload) => axiosInstance.post('/auth/register', payload);

// POST /api/auth/login
export const loginUser = (payload) => axiosInstance.post('/auth/login', payload);

// GET /api/auth/profile
export const fetchProfile = () => axiosInstance.get('/auth/profile');

// PUT /api/auth/profile
export const updateProfile = (payload) => axiosInstance.put('/auth/profile', payload);

// POST /api/auth/profile/photo (multipart/form-data)
export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  return axiosInstance.post('/auth/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

//  POST /api/auth/forgot-password
export const forgotPassword = (email) => axiosInstance.post('/auth/forgot-password', { email });

// PUT /api/auth/reset-password/:token
export const resetPassword = (token, password) =>
  axiosInstance.put(`/auth/reset-password/${token}`, { password });

// POST /api/auth/logout
export const logoutUser = () => axiosInstance.post('/auth/logout');


