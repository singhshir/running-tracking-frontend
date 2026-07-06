// layout/Sidebar.jsx
//
// WHAT: The left icon sidebar for quick navigation, visible on desktop/tablet.
// WHY: Spec calls for both a top navbar (text links) and a left sidebar
//      (icon shortcuts) — this covers the icon-only, always-visible nav.

import { NavLink } from 'react-router-dom';
import { FiGrid, FiPlayCircle, FiClock, FiBarChart2 } from 'react-icons/fi';

const links = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/run/start', icon: FiPlayCircle, label: 'Run' },
  { to: '/history', icon: FiClock, label: 'History' },
  { to: '/statistics', icon: FiBarChart2, label: 'Stats' },
];

const linkClass = ({ isActive }) =>
  `flex flex-col items-center gap-1 rounded-lg px-3 py-3 text-xs transition-colors ${
    isActive ? 'bg-primary-light text-primary' : 'text-slate-500 hover:text-primary hover:bg-primary-light'
  }`;

const Sidebar = () => {
  return (
    <aside className="hidden w-20 flex-shrink-0 flex-col items-center gap-2 border-r border-border bg-surface py-6 md:flex">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={linkClass}>
          <Icon className="text-lg" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
