// pages/StartRun.jsx
//
// WHAT: The live run-tracking page — large OpenStreetMap map (via MapView),
//       live route drawing, and an information/controls panel (RunControls)
//       for Start/Pause/Resume/Stop/Reset.
// WHY: The core feature of the whole app. All the real-time logic lives in
//      useRunTracker; this page just wires that hook to the map + controls
//      and handles what happens once a run is stopped (navigate to details).

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MapView from '../components/MapView';
import RunControls from '../components/RunControls';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useRunTracker } from '../hooks/useRunTracker';
import { useAuth } from '../hooks/useAuth';
import { formatDistance, formatDuration } from '../utils/formatters';

const StartRun = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [stopping, setStopping] = useState(false);

  const {
    status,
    route,
    elapsedSeconds,
    liveDistanceKm,
    livePace,
    liveSpeed,
    liveCalories,
    currentPosition,
    error,
    finalRun,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useRunTracker(user?.weight);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const distanceKmLabel = formatDistance(liveDistanceKm);
  const durationLabel = formatDuration(elapsedSeconds);

  const handleStop = async () => {
    setStopping(true);
    try {
      const result = await stop();
      if (result) {
        toast.success('Run saved!');
      }
    } finally {
      setStopping(false);
      setConfirmStopOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Start a run</h1>
          <p className="text-sm text-slate-400">Your route is drawn live as you move.</p>
        </div>
        {status === 'stopped' && finalRun && (
          <Button variant="secondary" onClick={() => navigate(`/history/${finalRun._id}`)}>
            View run summary
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {status === 'idle' && (
        <div className="mb-4 rounded-xl border border-border bg-surface p-4 text-sm text-slate-300">
          Make sure location access is allowed for this site, then hit Start.
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="h-[420px] w-full lg:h-[600px] lg:w-[70%]">
          <MapView currentPosition={currentPosition} route={route} follow={status !== 'stopped'} className="h-full" />
        </div>

        <div className="w-full lg:w-[30%]">
          <RunControls
            status={status}
            distanceKm={liveDistanceKm}
            durationSeconds={elapsedSeconds}
            speedKmh={liveSpeed}
            paceMinPerKm={livePace}
            calories={liveCalories}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={() => setConfirmStopOpen(true)}
            onReset={reset}
          />
        </div>
      </div>

      <Modal
        open={confirmStopOpen}
        title="End this run?"
        confirmLabel={stopping ? 'Saving...' : 'End & Save'}
        danger
        onClose={() => setConfirmStopOpen(false)}
        onConfirm={handleStop}
      >
        This will stop tracking and save {distanceKmLabel} covered in {durationLabel}. You won't be able to resume this run afterwards.
      </Modal>
    </div>
  );
};

export default StartRun;
