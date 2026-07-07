import { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { fetchMonthlyLeaderboard } from '../api/runApi';
import { resolveFileUrl, formatDistance, formatPace } from '../utils/formatters';

const medalFor = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null);
const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const Avatar = ({ name, profileImage }) => {
  const initials = (name || '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-xs font-semibold text-primary">
      {profileImage ? (
        <img src={resolveFileUrl(profileImage)} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials || '?'
      )}
    </span>
  );
};

const Row = ({ entry, highlight }) => (
  <div
    className={`grid grid-cols-[2.5rem_1fr_5rem_4rem_5rem] items-center gap-3 rounded-lg px-3 py-3 sm:grid-cols-[3rem_1fr_6rem_5rem_6rem] ${
      highlight ? 'border border-primary bg-primary-light' : 'border border-transparent'
    }`}
  >
    <span className="text-sm font-semibold text-slate-300">{medalFor(entry.rank) || `#${entry.rank}`}</span>
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={entry.name} profileImage={entry.profileImage} />
      <span className="truncate text-sm font-medium text-white">{entry.name}</span>
    </span>
    <span className="text-right text-sm font-semibold text-white sm:text-left">{formatDistance(entry.totalDistance)}</span>
    <span className="text-right text-sm text-slate-400 sm:text-left">{entry.totalRuns}</span>
    <span className="text-right text-sm text-slate-400 sm:text-left">{formatPace(entry.averagePace)}</span>
  </div>
);

const ColumnHeader = () => (
  <div className="grid grid-cols-[2.5rem_1fr_5rem_4rem_5rem] gap-3 px-3 pb-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid-cols-[3rem_1fr_6rem_5rem_6rem]">
    <span>Rank</span><span>Runner</span>
    <span className="text-right sm:text-left">Distance</span>
    <span className="text-right sm:text-left">Runs</span>
    <span className="text-right sm:text-left">Avg Pace</span>
  </div>
);

const MonthlyLeaderboard = () => {
  const [topTen, setTopTen] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMonthlyLeaderboard()
      .then(({ data }) => {
        if (cancelled) return;
        setTopTen(data.data.topTen || []);
        setCurrentUser(data.data.currentUser || null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const currentUserInTopTen = currentUser && topTen.some((e) => e.userId === currentUser.userId);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <FiAward className="text-xl text-primary" />
        <div>
          <h1 className="text-xl font-semibold text-white">Monthly Leaderboard</h1>
          <p className="text-sm text-slate-400">Ranked by total distance — {monthName}</p>
        </div>
      </div>

      {loading ? (
        <Loader fullPage label="Loading leaderboard..." />
      ) : topTen.length === 0 ? (
        <EmptyState icon={<FiAward />} title="No runs logged this month yet"
          description="Be the first to start a run this month and claim the top spot!" />
      ) : (
        <div className="rounded-xl border border-border bg-surface p-3">
          <ColumnHeader />
          <div className="flex flex-col gap-1">
            {topTen.map((entry) => (
              <Row key={entry.userId} entry={entry} highlight={entry.userId === currentUser?.userId} />
            ))}
          </div>
          {currentUser && !currentUserInTopTen && (
            <>
              <div className="my-3 border-t border-dashed border-border" />
              <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-slate-500">Your rank</p>
              <Row entry={currentUser} highlight />
            </>
          )}
          {!currentUser && (
            <p className="mt-4 px-3 text-sm text-slate-500">
              You haven&apos;t logged a completed run this month yet — start one to appear on the board!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyLeaderboard;