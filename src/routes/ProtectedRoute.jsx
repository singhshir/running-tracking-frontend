// routes/ProtectedRoute.jsx
//
// WHAT: A route guard — redirects to /login if there's no authenticated
//       user, otherwise renders the nested routes.
// WHY: Keeps auth-checking logic in one place instead of every page
//      checking `useAuth()` and redirecting manually.

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullPage label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
