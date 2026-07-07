// layout/Navbar.jsx
//
// WHAT: The top navigation bar — logo, primary nav links, and logout.
// WHY: Persistent across every authenticated page (rendered by
//      DashboardLayout), so it's a standalone component rather than
//      copy-pasted into each page.

import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiActivity, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { resolveFileUrl } from '../utils/formatters';

const navLinkClass = ({ isActive }) =>
  `hidden sm:inline-block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? 'text-primary bg-primary-light' : 'text-slate-400 hover:text-primary hover:bg-primary-light'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <FiActivity className="text-xl text-primary" />
        <span className="text-base font-semibold text-white">Running Tracker</span>
      </div>

      <nav className="flex items-center gap-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/run/start" className={navLinkClass}>
          Start Run
        </NavLink>
        <NavLink to="/history" className={navLinkClass}>
          History
        </NavLink>
        <NavLink to="/statistics" className={navLinkClass}>
          Statistics
        </NavLink>
        <NavLink to="/leaderboard" className={navLinkClass}>
        Leaderboard
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary-light"
          title="View profile"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-light text-xs font-semibold text-primary">
            {user?.profileImage ? (
              <img
                src={resolveFileUrl(user.profileImage)}
                alt={user?.name || 'Profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || <FiUser />
            )}
          </span>
          <span className="hidden text-sm font-medium text-slate-200 sm:inline">{user?.name}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-primary-light hover:text-primary"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
