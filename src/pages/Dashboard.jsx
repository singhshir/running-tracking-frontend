// pages/Dashboard.jsx
//
// WHAT: The landing page after login — welcome message, four stat cards,
//       a weekly distance chart, recent runs, and a quick-start button.
// WHY: Gives the user an at-a-glance summary of their running activity,
//      pulling from GET /api/runs/statistics and GET /api/runs.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiMapPin, FiActivity, FiPlus } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStatistics, fetchRuns, deleteRun } from '../api/runApi';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/StatsCard';
import RunCard from '../components/RunCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { formatDistance, formatPace, formatCalories } from '../utils/formatters';

// Buckets the user's completed runs into the last 7 calendar days for the
// weekly chart. Days with no runs simply show 0km.
const buildWeeklyChartData = (runs) => {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayKey = date.toDateString();

    const distance = runs
      .filter((run) => new Date(run.createdAt).toDateString() === dayKey)
      .reduce((sum, run) => sum + (run.distance || 0), 0);

    days.push({ day: label, km: Math.round(distance * 100) / 100 });
  }
  return days;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, runsRes] = await Promise.all([fetchStatistics(), fetchRuns()]);
        setStats(statsRes.data.data);
        setRecentRuns(runsRes.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load your dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteRun(pendingDeleteId);
      setRecentRuns((prev) => prev.filter((r) => r._id !== pendingDeleteId));
      toast.success('Run deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete run.');
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (loading) return <Loader fullPage label="Loading your dashboard..." />;

  const chartData = buildWeeklyChartData(recentRuns);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-slate-400">Here&apos;s how your training is going.</p>
        </div>
        <Button onClick={() => navigate('/run/start')}>
          <FiPlus /> Quick Start
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard icon={<FiActivity />} label="Total Runs" value={stats?.totalRuns ?? 0} />
        <StatsCard icon={<FiMapPin />} label="Total Distance" value={formatDistance(stats?.totalDistance)} />
        <StatsCard icon={<FiTrendingUp />} label="Average Pace" value={formatPace(stats?.averagePace)} />
        <StatsCard icon={<FaFire />} label="Calories" value={formatCalories(stats?.totalCalories)} color="green" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">This week&apos;s distance (km)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                cursor={{ fill: 'rgba(249,115,22,0.08)' }}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#fff',
                }}
              />
              <Bar dataKey="km" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-white">This week vs this month</h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-2xl font-semibold text-white">{formatDistance(stats?.currentWeekDistance)}</p>
              <p className="text-xs text-slate-400">Distance this week</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{formatDistance(stats?.currentMonthDistance)}</p>
              <p className="text-xs text-slate-400">Distance this month</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent runs</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
            View all
          </Button>
        </div>

        {recentRuns.length === 0 ? (
          <EmptyState
            title="No runs yet"
            description="Start your first run to see it show up here."
            action={<Button onClick={() => navigate('/run/start')}>Start a run</Button>}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentRuns.slice(0, 3).map((run) => (
              <RunCard
                key={run._id}
                run={run}
                onView={(id) => navigate(`/history/${id}`)}
                onDelete={(id) => setPendingDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;
