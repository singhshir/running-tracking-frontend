// App.jsx
//
// WHAT: Top-level route table for the whole app.
// WHY: Central place to see every route at a glance — public auth pages,
//      the protected app shell (DashboardLayout) wrapping all authenticated
//      pages, and the catch-all 404.

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StartRun from './pages/StartRun';
import RunHistory from './pages/RunHistory';
import RunDetails from './pages/RunDetails';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/run/start" element={<StartRun />} />
          <Route path="/history" element={<RunHistory />} />
          <Route path="/history/:id" element={<RunDetails />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
