// pages/RunHistory.jsx
//
// WHAT: Lists all of the user's past runs (GET /api/runs) with a search box
//       (by date/notes), a sort control, pagination, and delete confirmation.
// WHY: Lets users browse and manage their run log rather than only seeing
//      the 3 most recent runs on the dashboard.

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';
import { fetchRuns, deleteRun } from '../api/runApi';
import RunCard from '../components/RunCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { formatDate } from '../utils/formatters';

const PAGE_SIZE = 6;

const RunHistory = () => {
  const navigate = useNavigate();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchRuns();
        setRuns(data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load run history.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredSorted = useMemo(() => {
    let result = [...runs];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((run) => {
        const dateLabel = formatDate(run.createdAt).toLowerCase();
        const notes = (run.notes || '').toLowerCase();
        return dateLabel.includes(query) || notes.includes(query);
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'longest':
          return b.distance - a.distance;
        case 'fastest':
          return (a.averagePace || Infinity) - (b.averagePace || Infinity);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [runs, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const pageItems = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteRun(pendingDeleteId);
      setRuns((prev) => prev.filter((r) => r._id !== pendingDeleteId));
      toast.success('Run deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete run.');
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (loading) return <Loader fullPage label="Loading run history..." />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Run history</h1>
        <p className="text-sm text-slate-400">All of your logged runs, newest first.</p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by date or note..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-primary"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="longest">Longest distance</option>
          <option value="fastest">Fastest pace</option>
        </select>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState
          title="No runs found"
          description={runs.length === 0 ? 'You haven\'t logged a run yet.' : 'Try a different search.'}
          action={runs.length === 0 && <Button onClick={() => navigate('/run/start')}>Start a run</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pageItems.map((run) => (
            <RunCard
              key={run._id}
              run={run}
              onView={(id) => navigate(`/history/${id}`)}
              onDelete={(id) => setPendingDeleteId(id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-primary text-white' : 'text-slate-400 hover:bg-surface'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pendingDeleteId)}
        title="Delete this run?"
        danger
        confirmLabel="Delete"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      >
        This can&apos;t be undone.
      </Modal>
    </div>
  );
};

export default RunHistory;
