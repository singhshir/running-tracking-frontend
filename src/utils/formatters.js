// utils/formatters.js
//
// WHAT: Small, pure formatting helpers used across pages/components so
//       numbers are displayed consistently (e.g. "12:04" not "12.066667").
// WHY: Keeps formatting logic out of JSX and in one testable place.

// Formats a duration given in seconds as HH:MM:SS (or MM:SS if under an hour)
export const formatDuration = (totalSeconds = 0) => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

// Distance in km -> "3.42 km"
export const formatDistance = (km = 0) => `${Number(km || 0).toFixed(2)} km`;

// Pace stored as minutes-per-km (decimal) -> "5:12 /km"
export const formatPace = (paceMinPerKm) => {
  if (!paceMinPerKm || !Number.isFinite(paceMinPerKm) || paceMinPerKm <= 0) {
    return '--:-- /km';
  }
  const mins = Math.floor(paceMinPerKm);
  const secs = Math.round((paceMinPerKm - mins) * 60);
  return `${mins}:${String(secs).padStart(2, '0')} /km`;
};

export const formatSpeed = (kmh = 0) => `${Number(kmh || 0).toFixed(1)} km/h`;

export const formatCalories = (cal = 0) => `${Math.round(cal || 0)} kcal`;

export const formatDate = (dateString) => {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Resolves a stored file path (e.g. "/uploads/photo-123.jpg") into a full
// URL the <img> tag can load. In dev, Vite proxies /uploads to the backend
// (see vite.config.js) so a relative path works as-is. In production, the
// API base URL usually points at ".../api", so we strip that suffix to get
// the backend's origin and prefix the path with it.
export const resolveFileUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const origin = apiBase.replace(/\/?api\/?$/, '');
  return `${origin}${path}`;
};

// Counts consecutive days (ending today, or yesterday if no run logged yet
// today) that have at least one completed run — a simple "current streak".
export const calcStreakDays = (runs = []) => {
  const dateSet = new Set(
    runs
      .filter((r) => r.endTime || r.status === 'completed')
      .map((r) => new Date(r.endTime || r.startTime).toDateString())
  );
  if (!dateSet.size) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!dateSet.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dateSet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};
