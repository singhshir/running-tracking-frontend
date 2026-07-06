// components/RunControls.jsx
//
// WHAT: The information panel + action buttons for the Start Running page —
//       shows live distance/duration/speed/pace/calories, and Start, Pause,
//       Resume, Stop, Reset buttons depending on the current run status.
// WHY: Separates the "controls and numbers" UI from the map and page-level
//      logic in StartRun.jsx.

import { FiPlay, FiPause, FiSquare, FiRotateCcw, FiMapPin, FiClock, FiZap, FiActivity } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import Button from './Button';
import { formatDistance, formatDuration, formatPace, formatSpeed, formatCalories } from '../utils/formatters';

const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between border-b border-border py-3 last:border-none">
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span className="text-slate-500">{icon}</span>
      {label}
    </div>
    <span className="text-base font-semibold text-white">{value}</span>
  </div>
);

const RunControls = ({
  status,
  distanceKm,
  durationSeconds,
  speedKmh,
  paceMinPerKm,
  calories,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}) => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-base font-semibold text-white">Run stats</h2>
        {status === 'active' && (
          <span className="flex items-center gap-1 rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent-dark">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Live
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-slate-400">Updates live as you move</p>

      <div>
        <StatRow icon={<FiMapPin />} label="Distance" value={formatDistance(distanceKm)} />
        <StatRow icon={<FiClock />} label="Duration" value={formatDuration(durationSeconds)} />
        <StatRow icon={<FiZap />} label="Avg Speed" value={formatSpeed(speedKmh)} />
        <StatRow icon={<FiActivity />} label="Avg Pace" value={formatPace(paceMinPerKm)} />
        <StatRow icon={<FaFire />} label="Calories" value={formatCalories(calories)} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {status === 'idle' && (
          <Button onClick={onStart} size="lg">
            <FiPlay /> Start
          </Button>
        )}

        {status === 'active' && (
          <>
            <Button onClick={onPause} size="lg" variant="secondary">
              <FiPause /> Pause
            </Button>
            <Button onClick={onStop} size="lg" variant="danger">
              <FiSquare /> Stop
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button onClick={onResume} size="lg">
              <FiPlay /> Resume
            </Button>
            <Button onClick={onStop} size="lg" variant="danger">
              <FiSquare /> Stop
            </Button>
          </>
        )}

        {status === 'stopped' && (
          <Button onClick={onReset} size="lg" variant="secondary">
            <FiRotateCcw /> Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default RunControls;
