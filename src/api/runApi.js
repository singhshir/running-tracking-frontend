// api/runApi.js
//
// WHAT: All network calls related to running sessions, matching
//       backend/routes/runRoutes.js exactly.
// WHY: Keeps the useRunTracker hook and pages free of raw axios calls.

import axiosInstance from './axiosInstance';

// POST /api/runs/start
export const startRun = () => axiosInstance.post('/runs/start');

// POST /api/runs/location  body: { runId, latitude, longitude, timestamp }
export const addLocation = (payload) => axiosInstance.post('/runs/location', payload);

// POST /api/runs/stop  body: { runId, notes?, weather? }
export const stopRun = (payload) => axiosInstance.post('/runs/stop', payload);

// GET /api/runs/statistics
export const fetchStatistics = () => axiosInstance.get('/runs/statistics');

// GET /api/runs
export const fetchRuns = () => axiosInstance.get('/runs');

// GET /api/runs/:id
export const fetchRunById = (id) => axiosInstance.get(`/runs/${id}`);

// DELETE /api/runs/:id
export const deleteRun = (id) => axiosInstance.delete(`/runs/${id}`);
