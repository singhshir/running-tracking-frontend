// pages/Home.jsx
//
// WHAT: Public marketing/landing page shown at "/" to visitors who
//       aren't logged in yet — hero, feature highlights, "why us" grid,
//       about section, and footer.
// WHY: Every app needs a front door. This lives outside ProtectedRoute so
//      it's visible without logging in, and links out to /login and
//      /register for the actual app.

import { Link, Navigate } from 'react-router-dom';
import {
  FaRunning,
  FaMedal,
  FaTrophy,
  FaLock,
} from 'react-icons/fa';
import {
  FiTarget,
  FiBarChart2,
  FiClock,
  FiMap,
  FiGlobe,
  FiGift,
  FiTrendingUp,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const heroStats = [
  { icon: <FiMap />, title: 'Track Distance', desc: 'Log every km you run' },
  { icon: <FiClock />, title: 'Monitor Pace', desc: 'Auto calculated min/km' },
  { icon: <FiTarget />, title: 'Set Goals', desc: 'Weekly and monthly targets' },
  { icon: <FiBarChart2 />, title: 'View Progress', desc: 'Charts and statistics' },
];

const whyCards = [
  {
    icon: <FiGift />,
    iconBg: 'bg-blue-500/20 text-blue-400',
    title: '100% Free',
    desc: 'No hidden fees, no premium plans. Everything is free for all runners.',
  },
  {
    icon: <FiGlobe />,
    iconBg: 'bg-sky-500/20 text-sky-400',
    title: 'Web Based',
    desc: 'Access from any device with a browser. No app download needed.',
  },
  {
    icon: <FiTrendingUp />,
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    title: 'Progress Charts',
    desc: 'Visual weekly and monthly charts to see your improvement over time.',
  },
  {
    icon: <FaTrophy />,
    iconBg: 'bg-amber-500/20 text-amber-400',
    title: 'Personal Best',
    desc: 'Automatically tracks your best run by distance and pace.',
  },
  {
    icon: <FiTarget />,
    iconBg: 'bg-pink-500/20 text-pink-400',
    title: 'Goal Setting',
    desc: 'Set weekly or monthly distance goals and track your achievement.',
  },
  {
    icon: <FaLock />,
    iconBg: 'bg-orange-500/20 text-orange-400',
    title: 'Secure & Private',
    desc: 'Your data is protected with secure login and encrypted passwords.',
  },
];

const Home = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage label="Loading..." />;
  }

  // Already logged in? Skip the marketing page and go straight to the app.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* NAVBAR */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-orange-500">
            <FaRunning />
            Running Tracker
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 sm:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#about" className="hover:text-white">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-500/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Track Your{' '}
          <span className="bg-gradient-to-r from-orange-400 to-lime-400 bg-clip-text text-transparent">
            Running
          </span>{' '}
          Journey <FaMedal className="inline text-orange-400" />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-slate-400">
          Log your runs, monitor your progress, set goals and become a better runner every day.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition-colors hover:border-slate-400"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {heroStats.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-800 bg-slate-800/60 p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center text-2xl text-slate-300">
                {item.icon}
              </div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US / FEATURES */}
      <section id="features" className="border-t border-slate-800 bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-extrabold text-white">Why Use Running Tracker?</h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-slate-800 bg-slate-800/60 p-6"
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-lg ${card.iconBg}`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-slate-800 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white">About This Project</h2>
          <p className="mt-6 text-slate-400">
            Running Tracker is a MERN-stack web app that helps runners log their runs in
            real time, follow their route on a live map, and track distance, pace, and
            calories over time — all from the browser, on any device.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Start Tracking Today
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <FaRunning className="text-orange-500" />
          Running Tracker &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Home;
