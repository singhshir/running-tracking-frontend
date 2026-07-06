// api/userApi.js
//
// WHAT: Account-level calls that aren't strictly "auth session" concerns,
//       matching backend/routes/userRoutes.js exactly.
// WHY: Kept separate from authApi.js to mirror the backend's own split
//      between "session" (authRoutes) and "account" (userRoutes).

import axiosInstance from './axiosInstance';

// GET /api/users/:id
export const fetchUserById = (id) => axiosInstance.get(`/users/${id}`);

// DELETE /api/users/me
export const deleteMyAccount = () => axiosInstance.delete('/users/me');
