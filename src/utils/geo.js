// utils/geo.js
//
// WHAT: Small geo-math helpers used for LIVE stats while a run is in
//       progress (distance so far, current pace/speed/calories).
// WHY: The backend only calculates final stats when a run is stopped
//      (see backend/controllers/runController.js -> stopRun), but the
//      "Start Running" page needs numbers updating in real time as the
//      user runs. These functions are deliberately a 1:1 mirror of
//      backend/utils/calculateDistance.js, calculatePace.js, and
//      calculateCalories.js so the live numbers match the final saved
//      numbers exactly once the run is stopped.

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Haversine distance (km) between two { latitude, longitude } points.
export const haversineDistance = (a, b) => {
  if (!a || !b) return 0;

  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(a.latitude)) *
      Math.cos(toRadians(b.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
};

// Total distance (km) along an array of { latitude, longitude } points.
export const totalRouteDistance = (points = []) => {
  if (points.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return Math.round(total * 100) / 100;
};

// Pace in minutes-per-km given distance (km) and duration (seconds).
export const calcPace = (distanceKm, durationSeconds) => {
  if (!distanceKm || distanceKm <= 0) return 0;
  const durationMinutes = durationSeconds / 60;
  return Math.round((durationMinutes / distanceKm) * 100) / 100;
};

// Average speed in km/h given distance (km) and duration (seconds).
export const calcSpeed = (distanceKm, durationSeconds) => {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  const durationHours = durationSeconds / 3600;
  return Math.round((distanceKm / durationHours) * 100) / 100;
};

// MET value lookup by speed (km/h) — mirrors backend getMetValue().
const getMetValue = (speedKmh) => {
  if (speedKmh < 6) return 6;
  if (speedKmh < 8) return 8.3;
  if (speedKmh < 9.7) return 9.8;
  if (speedKmh < 11.3) return 11;
  if (speedKmh < 12.9) return 11.8;
  if (speedKmh < 16) return 12.8;
  return 14.5;
};

// Live calorie estimate — mirrors backend calculateCalories().
export const calcCalories = (weightKg, distanceKm, durationSeconds) => {
  if (!durationSeconds || durationSeconds <= 0 || !distanceKm || distanceKm <= 0) {
    return 0;
  }

  const weight = weightKg && weightKg > 0 ? weightKg : 70;
  const durationHours = durationSeconds / 3600;
  const speedKmh = distanceKm / durationHours;
  const met = getMetValue(speedKmh);

  return Math.round(met * weight * durationHours);
};
