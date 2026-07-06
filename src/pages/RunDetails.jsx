// pages/RunDetails.jsx
//
// WHAT: Shows the full details of a single completed run — large map with
//       the complete route, final stats, and a coordinate summary.
// WHY: Reached from "View" on a RunCard (History or Dashboard), or right
//      after finishing a run on the Start Run page.

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiClock, FiZap, FiActivity } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { fetchRunById } from '../api/runApi';
import MapView from '../components/MapView';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import {
  formatDate,
  formatTime,
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
  formatCalories,
} from '../utils/formatters';

const StatBlock = ({ icon, label, value }) => (
  <div className="rounded-xl border border-border bg-surface p-4">
    <div className="mb-2 text-slate-500">{icon}</div>
    <p className="text-lg font-semibold text-white">{value}</p>
    <p className="text-xs text-slate-400">{label}</p>
  </div>
);

const RunDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchRunById(id);
        setRun(data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load this run.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader fullPage label="Loading run details..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorMessage message={error} />
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/history')}>
          <FiArrowLeft /> Back to history
        </Button>
      </div>
    );
  }

  const route = run.routeCoordinates || [];

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => navigate('/history')}
        className="mb-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary"
      >
        <FiArrowLeft /> Back to history
      </button>

      <div className="mb-5">
        <h1 className="text-xl font-semibold text-white">{formatDate(run.createdAt)}</h1>
        <p className="text-sm text-slate-400">
          Started at {formatTime(run.startTime)}
          {run.endTime && ` — finished at ${formatTime(run.endTime)}`}
        </p>
      </div>

      <div className="mb-5 h-[420px] w-full">
        <MapView currentPosition={null} route={route} follow={false} className="h-full" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatBlock icon={<FiMapPin />} label="Distance" value={formatDistance(run.distance)} />
        <StatBlock icon={<FiClock />} label="Duration" value={formatDuration(run.duration)} />
        <StatBlock icon={<FiZap />} label="Avg Speed" value={formatSpeed(run.averageSpeed)} />
        <StatBlock icon={<FiActivity />} label="Avg Pace" value={formatPace(run.averagePace)} />
        <StatBlock icon={<FaFire />} label="Calories" value={formatCalories(run.calories)} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Coordinate summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-slate-400">GPS points recorded</p>
            <p className="font-medium text-white">{route.length}</p>
          </div>
          {route.length > 0 && (
            <>
              <div>
                <p className="text-slate-400">Start point</p>
                <p className="font-medium text-white">
                  {route[0].latitude.toFixed(5)}, {route[0].longitude.toFixed(5)}
                </p>
              </div>
              <div>
                <p className="text-slate-400">End point</p>
                <p className="font-medium text-white">
                  {route[route.length - 1].latitude.toFixed(5)}, {route[route.length - 1].longitude.toFixed(5)}
                </p>
              </div>
            </>
          )}
          {run.notes && (
            <div className="col-span-2">
              <p className="text-slate-400">Notes</p>
              <p className="font-medium text-white">{run.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunDetails;
