
import { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import {  GiRunningShoe } from 'react-icons/gi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { fetchMonthlyLeaderboard } from '../api/runApi';
import { resolveFileUrl, formatDistance, formatPace } from '../utils/formatters';

const medalFor = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const Avatar = ({ name, profileImage, size = 'sm' }) => {
  const initials = (name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClass = size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-9 w-9 text-xs';

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light font-semibold text-primary ${sizeClass}`}
    >
      {profileImage ? (
        <img src={resolveFileUrl(profileImage)} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials || '?'
      )}
    </span>
  );
};

// Big standalone card for #1 — golden boot above the photo, stats below.
const ChampionCard = ({ entry, highlight }) => (
  <div
    className={`mb-6 flex items-center gap-6 rounded-2xl border bg-gradient-to-r from-primary-light to-surface px-6 py-6 ${
      highlight ? 'border-primary' : 'border-border'
    }`}
  >
    {/* Left: photo */}
    <div className="relative flex-shrink-0">
      <Avatar name={entry.name} profileImage={entry.profileImage} size="lg" />
      <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-yellow-400 text-xs font-bold text-slate-900">
        1
      </span>
    </div>

    {/* Right: details */}
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-center gap-2">
        <GiRunningShoe className="text-xl text-yellow-400" title="Golden Boot — #1 this month" />
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
          Runner of the Month
        </p>
      </div>
      <p className="truncate text-lg font-semibold text-white">{entry.name}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div>
          <p className="text-base font-bold text-white">{formatDistance(entry.totalDistance)}</p>
          <p className="text-xs text-slate-400">Distance</p>
        </div>
        <div>
          <p className="text-base font-bold text-white">{entry.totalRuns}</p>
          <p className="text-xs text-slate-400">Runs</p>
        </div>
        <div>
          <p className="text-base font-bold text-white">{formatPace(entry.averagePace)}</p>
          <p className="text-xs text-slate-400">Avg Pace</p>
        </div>
      </div>
    </div>
  </div>
);

const Row = ({ entry, highlight }) => (
  <div
    className={`grid grid-cols-[2.5rem_1fr_5rem_4rem_5rem] items-center gap-3 rounded-lg px-3 py-3 sm:grid-cols-[3rem_1fr_6rem_5rem_6rem] ${
      highlight ? 'border border-primary bg-primary-light' : 'border border-transparent'
    }`}
  >
    <span className="text-sm font-semibold text-slate-300">
      {medalFor(entry.rank) || `#${entry.rank}`}
    </span>
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={entry.name} profileImage={entry.profileImage} />
      <span className="truncate text-sm font-medium text-white">{entry.name}</span>
    </span>
    <span className="text-right text-sm font-semibold text-white sm:text-left">
      {formatDistance(entry.totalDistance)}
    </span>
    <span className="text-right text-sm text-slate-400 sm:text-left">{entry.totalRuns}</span>
    <span className="text-right text-sm text-slate-400 sm:text-left">{formatPace(entry.averagePace)}</span>
  </div>
);

const ColumnHeader = () => (
  <div className="grid grid-cols-[2.5rem_1fr_5rem_4rem_5rem] gap-3 px-3 pb-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid-cols-[3rem_1fr_6rem_5rem_6rem]">
    <span>Rank</span>
    <span>Runner</span>
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
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentUserInTopTen = currentUser && topTen.some((entry) => entry.userId === currentUser.userId);
  const champion = topTen[0] || null;
  const rest = topTen.slice(1);

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
        <EmptyState
          icon={<FiAward />}
          title="No runs logged this month yet"
          description="Be the first to start a run this month and claim the top spot!"
        />
      ) : (
        <>
          <ChampionCard entry={champion} highlight={champion.userId === currentUser?.userId} />

          {(rest.length > 0 || (currentUser && !currentUserInTopTen)) && (
            <div className="rounded-xl border border-border bg-surface p-3">
              <ColumnHeader />
              <div className="flex flex-col gap-1">
                {rest.map((entry) => (
                  <Row key={entry.userId} entry={entry} highlight={entry.userId === currentUser?.userId} />
                ))}
              </div>

              {currentUser && !currentUserInTopTen && (
                <>
                  <div className="my-3 border-t border-dashed border-border" />
                  <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Your rank
                  </p>
                  <Row entry={currentUser} highlight />
                </>
              )}
            </div>
          )}

          {!currentUser && (
            <p className="mt-4 px-3 text-sm text-slate-500">
              You haven&apos;t logged a completed run this month yet — start one to appear on the board!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default MonthlyLeaderboard;