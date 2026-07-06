// pages/NotFound.jsx
//
// WHAT: A simple, friendly 404 page.
// WHY: Catches any route that doesn't match — better than a blank screen.

import { Link } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <FiActivity className="text-3xl text-slate-600" />
      <h1 className="text-2xl font-semibold text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-400">
        Looks like you've wandered off route. Let's get you back on track.
      </p>
      <Link to="/dashboard">
        <Button className="mt-2">Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
