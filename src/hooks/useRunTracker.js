// hooks/useRunTracker.js
//
// WHAT: The core state machine for a running session — start, pause,
//       resume, stop, reset — combining live geolocation (useLocation),
//       an elapsed-time timer, and calls to the run API.
// WHY: The "Start Running" page is the most complex page in the app.
//      Pulling all of this logic into one hook keeps StartRun.jsx focused
//      on layout/rendering rather than state management.
//
// NOTE ON PAUSE: The backend only models a run as 'active' or 'completed'
// (see backend/models/Run.js). There is no server-side "paused" status, so
// pausing is handled entirely on the frontend: we simply stop the timer and
// stop sending new GPS points to the backend, without ending the run.
// Resuming just starts both again. Only Stop actually calls POST /runs/stop.

import { useCallback, useEffect, useRef, useState } from 'react';
import { addLocation, startRun as startRunApi, stopRun as stopRunApi } from '../api/runApi';
import { useLocation } from './useLocation';
import { calcCalories, calcPace, calcSpeed, totalRouteDistance } from '../utils/geo';

// idle -> active -> paused <-> active -> stopped
export const useRunTracker = (userWeightKg) => {
  const [status, setStatus] = useState('idle');
  const [runId, setRunId] = useState(null);
  const [route, setRoute] = useState([]); // [{ latitude, longitude, timestamp }]
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState(null);
  const [finalRun, setFinalRun] = useState(null);

  const timerRef = useRef(null);
  const lastSentAtRef = useRef(0);

  const { position, error: geoError, getCurrentPosition, startWatching, stopWatching } = useLocation();

  // Auto-relocate the map to the device's current location as soon as this
  // page/hook mounts, instead of waiting for the user to press Start. This
  // only grabs a single fix (not a continuous watch) so it doesn't drain
  // battery before a run has actually begun.
  useEffect(() => {
    getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Timer ----------------------------------------------------------
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- React to new GPS positions while active -------------------------
  useEffect(() => {
    if (status !== 'active' || !position) return;

    setRoute((prev) => [...prev, position]);

    // Throttle backend writes to roughly once every 5 seconds so we don't
    // spam POST /api/runs/location on every single GPS tick.
    const now = Date.now();
    if (runId && now - lastSentAtRef.current > 5000) {
      lastSentAtRef.current = now;
      addLocation({
        runId,
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: new Date().toISOString(),
      }).catch(() => {
        // Non-fatal: a missed point doesn't stop the run. The full
        // route is still recalculated locally for the live UI, and
        // the backend recalculates distance from whatever points it
        // did receive when the run is stopped.
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, status]);

  const start = useCallback(async () => {
    try {
      setError(null);
      const { data } = await startRunApi();
      setRunId(data.data.runId);
      setRoute([]);
      setElapsedSeconds(0);
      setFinalRun(null);
      setStatus('active');
      startWatching();
      startTimer();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not start run. Please try again.');
    }
  }, [startWatching]);

  const pause = useCallback(() => {
    setStatus('paused');
    stopTimer();
    stopWatching();
  }, [stopWatching]);

  const resume = useCallback(() => {
    setStatus('active');
    startWatching();
    startTimer();
  }, [startWatching]);

  const stop = useCallback(async () => {
    stopTimer();
    stopWatching();

    if (!runId) {
      setStatus('idle');
      return null;
    }

    try {
      const { data } = await stopRunApi({ runId });
      setFinalRun(data.data);
      setStatus('stopped');
      return data.data;
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not stop run. Please try again.');
      setStatus('stopped');
      return null;
    }
  }, [runId, stopWatching]);

  const reset = useCallback(() => {
    stopTimer();
    stopWatching();
    setStatus('idle');
    setRunId(null);
    setRoute([]);
    setElapsedSeconds(0);
    setFinalRun(null);
    setError(null);
  }, [stopWatching]);

  // Clean up timer on unmount
  useEffect(() => stopTimer, []);

  // --- Derived live stats -----------------------------------------------
  const liveDistanceKm = totalRouteDistance(route);
  const livePace = calcPace(liveDistanceKm, elapsedSeconds);
  const liveSpeed = calcSpeed(liveDistanceKm, elapsedSeconds);
  const liveCalories = calcCalories(userWeightKg, liveDistanceKm, elapsedSeconds);

  return {
    status,
    route,
    elapsedSeconds,
    liveDistanceKm,
    livePace,
    liveSpeed,
    liveCalories,
    currentPosition: position,
    error: error || geoError,
    finalRun,
    start,
    pause,
    resume,
    stop,
    reset,
  };
};
