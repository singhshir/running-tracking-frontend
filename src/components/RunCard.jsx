// components/RunCard.jsx
//
// WHAT: One row/card in the Run History list — date, distance, duration,
//       pace, calories, and View/Delete actions.
// WHY: Used in a loop on the History page; keeping it separate keeps
//      RunHistory.jsx focused on filtering/sorting/pagination logic.

import { FiTrash2, FiEye, FiClock } from 'react-icons/fi';
import Button from './Button';
import { formatDate, formatDistance, formatDuration, formatPace, formatCalories } from '../utils/formatters';

const RunCard = ({ run, onView, onDelete }) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FiClock className="text-slate-500" />
          {formatDate(run.createdAt)}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">{formatDistance(run.distance)}</p>
            <p className="text-xs text-slate-400">Distance</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{formatDuration(run.duration)}</p>
            <p className="text-xs text-slate-400">Duration</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{formatPace(run.averagePace)}</p>
            <p className="text-xs text-slate-400">Avg Pace</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{formatCalories(run.calories)}</p>
            <p className="text-xs text-slate-400">Calories</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button variant="secondary" size="sm" onClick={() => onView(run._id)}>
          <FiEye /> View
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(run._id)}>
          <FiTrash2 /> Delete
        </Button>
      </div>
    </div>
  );
};

export default RunCard;
