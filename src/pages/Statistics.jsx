// pages/Statistics.jsx
//
// WHAT: A dedicated stats page — weekly & monthly distance charts, plus
//       overall totals (total distance, average pace, longest run,
//       total calories), all sourced from the user's completed runs.
// WHY: The Dashboard only shows a quick snapshot; this page gives a
//      fuller picture for someone who wants to review their training.

import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiMapPin, FiTrendingUp, FiAward } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { fetchRuns, fetchStatistics } from '../api/runApi';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { formatDistance, formatPace, formatCalories } from '../utils/formatters';

// Groups completed runs by ISO week-start-date, for the last 7 weeks.
const buildWeeklySeries = (runs) => {
  const weeks = [];
  for (let i = 6; i >= 0; i -= 1) {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const distance = runs
      .filter((r) => new Date(r.createdAt) >= start && new Date(r.createdAt) < end)
      .reduce((sum, r) => sum + (r.distance || 0), 0);

    weeks.push({
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      km: Math.round(distance * 100) / 100,
    });
  }
  return weeks;
};

// Groups completed runs by calendar month, for the last 6 months.
const buildMonthlySeries = (runs) => {
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString('en-US', { month: 'short' });

    const distance = runs
      .filter((r) => {
        const rd = new Date(r.createdAt);
        return `${rd.getFullYear()}-${rd.getMonth()}` === monthKey;
      })
      .reduce((sum, r) => sum + (r.distance || 0), 0);

    months.push({ label, km: Math.round(distance * 100) / 100 });
  }
  return months;
};

const Statistics = () => {
  const [runs, setRuns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [runsRes, statsRes] = await Promise.all([fetchRuns(), fetchStatistics()]);
        setRuns(runsRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load statistics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const weeklyData = useMemo(() => buildWeeklySeries(runs), [runs]);
  const monthlyData = useMemo(() => buildMonthlySeries(runs), [runs]);

  if (loading) return <Loader fullPage label="Crunching your numbers..." />;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Statistics</h1>
        <p className="text-sm text-slate-400">Your overall running progress.</p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard icon={<FiMapPin />} label="Total Distance" value={formatDistance(stats?.totalDistance)} />
        <StatsCard icon={<FiTrendingUp />} label="Average Pace" value={formatPace(stats?.averagePace)} />
        <StatsCard icon={<FiAward />} label="Longest Run" value={formatDistance(stats?.longestRun)} />
        <StatsCard icon={<FaFire />} label="Total Calories" value={formatCalories(stats?.totalCalories)} color="green" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-white">Weekly distance (last 7 weeks)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
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
              <Bar dataKey="km" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-white">Monthly distance (last 6 months)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="km" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
